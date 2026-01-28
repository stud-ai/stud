import z from "zod"
import { Tool } from "../tool"
import { RobloxAuth } from "@/roblox/auth"

const TOOLBOX_API = "https://apis.roblox.com/toolbox-service/v1"
const TIMEOUT_MS = 15000

// Asset category IDs for Roblox toolbox
export const AssetCategories = {
  Models: 10,
  Audio: 3,
  Decals: 13,
  Meshes: 4,
  Plugins: 38,
  Images: 1,
  Videos: 62,
  Animations: 24,
} as const

export type AssetCategoryName = keyof typeof AssetCategories

// Asset type ID to name mapping
const AssetTypeNames: Record<number, string> = {
  1: "Image",
  2: "TShirt",
  3: "Audio",
  4: "Mesh",
  5: "Lua",
  8: "Hat",
  9: "Place",
  10: "Model",
  11: "Shirt",
  12: "Pants",
  13: "Decal",
  17: "Head",
  18: "Face",
  19: "Gear",
  21: "Badge",
  24: "Animation",
  32: "Package",
  34: "GamePass",
  38: "Plugin",
  40: "MeshPart",
  62: "Video",
}

export function getAssetTypeName(id: number): string {
  return AssetTypeNames[id] || `Type(${id})`
}

interface ToolboxSearchResponse {
  totalResults: number
  filteredKeyword: string
  nextPageCursor: string | null
  data: Array<{
    id: number
    searchResultSource: string
  }>
}

interface ToolboxAssetDetails {
  asset: {
    id: number
    name: string
    typeId: number
    description: string
    hasScripts: boolean
    scriptCount: number
    createdUtc: string
    updatedUtc: string
    isEndorsed: boolean
    categoryPath: string
  }
  creator: {
    id: number
    name: string
    type: number
    isVerifiedCreator: boolean
  }
  voting: {
    upVotes: number
    downVotes: number
    voteCount: number
    upVotePercent: number
  }
  fiatProduct: {
    isFree: boolean
    purchasable: boolean
    published?: boolean
  }
}

interface ToolboxDetailsResponse {
  data: ToolboxAssetDetails[]
}

async function fetchWithTimeout<T>(
  url: string,
  cookie?: string,
): Promise<{ success: boolean; data?: T; error?: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const headers: Record<string, string> = {}
    if (cookie) {
      headers.Cookie = `.ROBLOSECURITY=${cookie}`
    }
    const response = await fetch(url, { signal: controller.signal, headers })
    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Unauthorized - please login to Roblox via Settings > Roblox Account" }
      }
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
    }
    const data = await response.json()
    return { success: true, data: data as T }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, error: "Request timed out" }
    }
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  } finally {
    clearTimeout(timeout)
  }
}

export interface ToolboxAsset {
  id: number
  name: string
  thumbnailUrl: string
  type: string
  typeId: number
  creator: string
  creatorId: number
  verified: boolean
  isFree: boolean
  hasScripts: boolean
  scriptCount: number
  voteCount: number
  votePercent: number
  description: string
}

export const RobloxToolboxSearchTool = Tool.define<
  z.ZodObject<{
    keyword: z.ZodString
    category: z.ZodOptional<z.ZodString>
    freeOnly: z.ZodOptional<z.ZodBoolean>
    limit: z.ZodOptional<z.ZodNumber>
  }>,
  { keyword: string; category: string; resultCount: number; assets: ToolboxAsset[] }
>("roblox_toolbox_search", {
  description: `Search the Roblox toolbox for free assets.

Searches for models, audio, decals, meshes, plugins, and other assets by keyword.
By default, only returns FREE assets that can be inserted into your game.

Categories:
- Models (default): 3D models, tools, NPCs, vehicles, etc.
- Audio: Sound effects and music
- Decals: 2D images for surfaces
- Meshes: 3D mesh parts
- Plugins: Studio plugins
- Images: Textures and images
- Videos: Video assets
- Animations: Character animations

Returns asset IDs that can be inserted using InsertService:LoadAsset(id).

Example: Search "car" in Models category to find free car models.`,
  parameters: z.object({
    keyword: z.string().describe("Search keyword (e.g., 'car', 'sword', 'tree')"),
    category: z
      .string()
      .optional()
      .describe("Asset category: Models, Audio, Decals, Meshes, Plugins, Images, Videos, Animations (default: Models)"),
    freeOnly: z.boolean().optional().describe("Only return free assets (default: true)"),
    limit: z.number().min(1).max(30).optional().describe("Maximum results (1-30, default: 10)"),
  }),
  async execute(params) {
    const category = (params.category as AssetCategoryName) || "Models"
    const categoryId = AssetCategories[category] || AssetCategories.Models
    const freeOnly = params.freeOnly !== false // default true
    const limit = params.limit || 10

    // Get auth cookie for authenticated requests
    const cookie = await RobloxAuth.getCookie()

    // Step 1: Search for assets
    const searchUrl = `${TOOLBOX_API}/marketplace/${categoryId}?keyword=${encodeURIComponent(params.keyword)}&pageNumber=1&pageSize=${limit}`
    const searchResult = await fetchWithTimeout<ToolboxSearchResponse>(searchUrl, cookie ?? undefined)

    if (!searchResult.success) {
      return {
        title: `Search: ${params.keyword}`,
        output: `Error searching toolbox: ${searchResult.error}`,
        metadata: { keyword: params.keyword, category, resultCount: 0, assets: [] },
      }
    }

    const assetIds = searchResult.data!.data.slice(0, limit).map((item) => item.id)
    if (assetIds.length === 0) {
      return {
        title: `Search: ${params.keyword}`,
        output: `No ${category.toLowerCase()} found for "${params.keyword}".`,
        metadata: { keyword: params.keyword, category, resultCount: 0, assets: [] },
      }
    }

    // Step 2: Batch fetch details for all assets (single request!)
    const detailsUrl = `${TOOLBOX_API}/items/details?assetIds=${assetIds.join(",")}`
    const detailsResult = await fetchWithTimeout<ToolboxDetailsResponse>(detailsUrl, cookie ?? undefined)

    if (!detailsResult.success) {
      // Fallback: return just IDs if details fail
      const output = assetIds.map((id) => `[${id}] (details unavailable)`).join("\n")
      return {
        title: `Search: ${params.keyword}`,
        output: `Found ${assetIds.length} result(s) for "${params.keyword}":\n\n${output}`,
        metadata: { keyword: params.keyword, category, resultCount: assetIds.length, assets: [] },
      }
    }

    // Step 3: Filter and format results
    // Only show assets that are:
    // 1. Free (if freeOnly is true)
    // 2. Purchasable (can actually be inserted/used)
    // 3. Published (publicly available)
    let assets = detailsResult.data!.data.filter((a) => {
      const canUse = a.fiatProduct.purchasable && a.fiatProduct.published !== false
      if (freeOnly) {
        return a.fiatProduct.isFree && canUse
      }
      return canUse
    })

    if (assets.length === 0) {
      return {
        title: `Search: ${params.keyword}`,
        output: `No usable free ${category.toLowerCase()} found for "${params.keyword}". Try setting freeOnly: false to see paid assets.`,
        metadata: { keyword: params.keyword, category, resultCount: 0, assets: [] },
      }
    }

    // Build structured asset data for UI
    const structuredAssets: ToolboxAsset[] = assets.map((a) => ({
      id: a.asset.id,
      name: a.asset.name,
      thumbnailUrl: `https://www.roblox.com/asset-thumbnail/image?assetId=${a.asset.id}&width=150&height=150&format=png`,
      type: getAssetTypeName(a.asset.typeId),
      typeId: a.asset.typeId,
      creator: a.creator.name,
      creatorId: a.creator.id,
      verified: a.creator.isVerifiedCreator,
      isFree: a.fiatProduct.isFree,
      hasScripts: a.asset.hasScripts,
      scriptCount: a.asset.scriptCount,
      voteCount: a.voting.voteCount,
      votePercent: a.voting.upVotePercent,
      description: a.asset.description,
    }))

    const details = assets.map((a) => {
      const verified = a.creator.isVerifiedCreator ? " (Verified)" : ""
      const scripts = a.asset.hasScripts ? ` | ${a.asset.scriptCount} scripts` : ""
      const votes = a.voting.voteCount > 0 ? ` | ${a.voting.upVotePercent}% liked (${a.voting.voteCount} votes)` : ""
      const thumb = `https://www.roblox.com/asset-thumbnail/image?assetId=${a.asset.id}&width=150&height=150&format=png`

      return (
        `### [${a.asset.id}] ${a.asset.name}\n\n` +
        `![${a.asset.name}](${thumb})\n\n` +
        `${getAssetTypeName(a.asset.typeId)} | Free | By: ${a.creator.name}${verified}${scripts}${votes}`
      )
    })

    const output = [`Found ${assets.length} free ${category.toLowerCase()} for "${params.keyword}":\n`, ...details]

    if (searchResult.data!.nextPageCursor) {
      output.push(`\nMore results available (${searchResult.data!.totalResults} total).`)
    }

    output.push(`\nTo insert an asset into your game, use the roblox_insert_asset tool with the asset ID.`)
    output.push(`Or manually: game:GetService("InsertService"):LoadAsset(ASSET_ID).Parent = workspace`)

    return {
      title: `${category}: ${params.keyword}`,
      output: output.join("\n"),
      metadata: { keyword: params.keyword, category, resultCount: assets.length, assets: structuredAssets },
    }
  },
})

const THUMBNAIL_API = "https://thumbnails.roblox.com/v1/assets"

function getThumbnailUrl(assetId: number): string {
  return `${THUMBNAIL_API}?assetIds=${assetId}&size=150x150&format=Png`
}

export const RobloxInsertAssetTool = Tool.define<
  z.ZodObject<{
    assetId: z.ZodNumber
    parent: z.ZodOptional<z.ZodString>
    name: z.ZodOptional<z.ZodString>
  }>,
  { assetId: number; inserted: boolean }
>("roblox_insert_asset", {
  description: `Insert a toolbox asset into the game.

Fetches the asset from Roblox's servers and inserts it into your game.
Uses game:GetObjects() which works in Studio without requiring asset ownership.

The inserted asset will be a Model containing the asset's contents.
Use roblox_toolbox_search to find asset IDs.

Examples:
- Insert a car model: assetId=17158839996, parent="game.Workspace"
- Insert into specific folder: assetId=123456, parent="game.Workspace.Models"`,
  parameters: z.object({
    assetId: z.number().describe("The asset ID to insert (from toolbox search)"),
    parent: z.string().optional().describe("Parent path for the asset (default: game.Workspace)"),
    name: z.string().optional().describe("Optional name for the inserted model"),
  }),
  async execute(params) {
    const { studioRequest, isStudioConnected, notConnectedError } = await import("./client")

    if (!(await isStudioConnected())) {
      return {
        title: "Not connected",
        output: notConnectedError(),
        metadata: { assetId: params.assetId, inserted: false },
      }
    }

    const parentPath = params.parent || "game.Workspace"
    const nameAssignment = params.name ? `model.Name = "${params.name}"` : ""

    // Use game:GetObjects() instead of InsertService:LoadAsset()
    // GetObjects works in Studio without requiring the user to own the asset
    const code = `
local assetId = ${params.assetId}
local success, result = pcall(function()
  local objects = game:GetObjects("rbxassetid://" .. assetId)
  if #objects == 0 then
    error("No objects returned for asset " .. assetId)
  end
  local model = objects[1]
  ${nameAssignment}
  model.Parent = ${parentPath}
  return model:GetFullName() .. " (" .. #model:GetDescendants() .. " descendants)"
end)
if success then
  print("Inserted: " .. result)
  return result
else
  error(result or "Failed to insert asset")
end
`

    const result = await studioRequest<{ output: string; error?: string }>("/code/run", { code })

    if (!result.success) {
      return {
        title: `Insert ${params.assetId}`,
        output: `Error: ${result.error}`,
        metadata: { assetId: params.assetId, inserted: false },
      }
    }

    if (result.data.error) {
      return {
        title: `Insert ${params.assetId}`,
        output: `Failed to insert asset: ${result.data.error}`,
        metadata: { assetId: params.assetId, inserted: false },
      }
    }

    return {
      title: `Inserted ${params.assetId}`,
      output: result.data.output || `Asset ${params.assetId} inserted into ${parentPath}`,
      metadata: { assetId: params.assetId, inserted: true },
    }
  },
})

export const RobloxAssetDetailsTool = Tool.define<
  z.ZodObject<{
    assetId: z.ZodNumber
  }>,
  { assetId: number }
>("roblox_asset_details", {
  description: `Get detailed information about a Roblox asset.

Returns name, description, type, creator, voting stats, script info, and whether it's free.
Use the asset ID from roblox_toolbox_search or from the Roblox website URL.

The asset ID can be used with InsertService:LoadAsset() to insert the asset into your game.`,
  parameters: z.object({
    assetId: z.number().describe("The asset ID to look up"),
  }),
  async execute(params) {
    const cookie = await RobloxAuth.getCookie()
    const url = `${TOOLBOX_API}/items/details?assetIds=${params.assetId}`
    const result = await fetchWithTimeout<ToolboxDetailsResponse>(url, cookie ?? undefined)

    if (!result.success) {
      return {
        title: `Asset ${params.assetId}`,
        output: `Error fetching asset details: ${result.error}`,
        metadata: { assetId: params.assetId },
      }
    }

    if (!result.data!.data || result.data!.data.length === 0) {
      return {
        title: `Asset ${params.assetId}`,
        output: `Asset not found or not accessible.`,
        metadata: { assetId: params.assetId },
      }
    }

    const a = result.data!.data[0]
    const verified = a.creator.isVerifiedCreator ? " (Verified)" : ""
    const creatorType = a.creator.type === 1 ? "User" : "Group"

    const thumbUrl = `https://www.roblox.com/asset-thumbnail/image?assetId=${a.asset.id}&width=420&height=420&format=png`

    const output = [
      `# ${a.asset.name}`,
      ``,
      `![${a.asset.name}](${thumbUrl})`,
      ``,
      `| Property | Value |`,
      `|----------|-------|`,
      `| Asset ID | ${a.asset.id} |`,
      `| Type | ${getAssetTypeName(a.asset.typeId)} |`,
      `| Category | ${a.asset.categoryPath || "N/A"} |`,
      `| Price | ${a.fiatProduct.isFree ? "Free" : "Paid"} |`,
      `| Purchasable | ${a.fiatProduct.purchasable ? "Yes" : "No"} |`,
      `| Creator | ${a.creator.name}${verified} (${creatorType}) |`,
      `| Votes | ${a.voting.upVotePercent}% liked (${a.voting.voteCount} total) |`,
      `| Scripts | ${a.asset.hasScripts ? `Yes (${a.asset.scriptCount})` : "No"} |`,
      `| Endorsed | ${a.asset.isEndorsed ? "Yes" : "No"} |`,
      ``,
      `## Description`,
      ``,
      a.asset.description || "(No description)",
      ``,
      `---`,
      ``,
      `To insert this asset, use \`roblox_insert_asset\` with \`assetId=${a.asset.id}\``,
    ]

    return {
      title: a.asset.name,
      output: output.join("\n"),
      metadata: { assetId: params.assetId },
    }
  },
})

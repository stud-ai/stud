import z from "zod"
import { Tool } from "../tool"

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
  }
}

interface ToolboxDetailsResponse {
  data: ToolboxAssetDetails[]
}

async function fetchWithTimeout<T>(url: string): Promise<{ success: boolean; data?: T; error?: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
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

export const RobloxToolboxSearchTool = Tool.define<
  z.ZodObject<{
    keyword: z.ZodString
    category: z.ZodOptional<z.ZodString>
    freeOnly: z.ZodOptional<z.ZodBoolean>
    limit: z.ZodOptional<z.ZodNumber>
  }>,
  { keyword: string; category: string; resultCount: number }
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

    // Step 1: Search for assets
    const searchUrl = `${TOOLBOX_API}/marketplace/${categoryId}?keyword=${encodeURIComponent(params.keyword)}&pageNumber=1&pageSize=${limit}`
    const searchResult = await fetchWithTimeout<ToolboxSearchResponse>(searchUrl)

    if (!searchResult.success) {
      return {
        title: `Search: ${params.keyword}`,
        output: `Error searching toolbox: ${searchResult.error}`,
        metadata: { keyword: params.keyword, category, resultCount: 0 },
      }
    }

    const assetIds = searchResult.data!.data.slice(0, limit).map((item) => item.id)
    if (assetIds.length === 0) {
      return {
        title: `Search: ${params.keyword}`,
        output: `No ${category.toLowerCase()} found for "${params.keyword}".`,
        metadata: { keyword: params.keyword, category, resultCount: 0 },
      }
    }

    // Step 2: Batch fetch details for all assets (single request!)
    const detailsUrl = `${TOOLBOX_API}/items/details?assetIds=${assetIds.join(",")}`
    const detailsResult = await fetchWithTimeout<ToolboxDetailsResponse>(detailsUrl)

    if (!detailsResult.success) {
      // Fallback: return just IDs if details fail
      const output = assetIds.map((id) => `[${id}] (details unavailable)`).join("\n")
      return {
        title: `Search: ${params.keyword}`,
        output: `Found ${assetIds.length} result(s) for "${params.keyword}":\n\n${output}`,
        metadata: { keyword: params.keyword, category, resultCount: assetIds.length },
      }
    }

    // Step 3: Filter and format results
    let assets = detailsResult.data!.data
    if (freeOnly) {
      assets = assets.filter((a) => a.fiatProduct.isFree)
    }

    if (assets.length === 0) {
      return {
        title: `Search: ${params.keyword}`,
        output: `No free ${category.toLowerCase()} found for "${params.keyword}". Try setting freeOnly: false to see paid assets.`,
        metadata: { keyword: params.keyword, category, resultCount: 0 },
      }
    }

    const details = assets.map((a) => {
      const verified = a.creator.isVerifiedCreator ? " ✓" : ""
      const scripts = a.asset.hasScripts ? ` | ${a.asset.scriptCount} scripts` : ""
      const votes = a.voting.voteCount > 0 ? ` | ${a.voting.upVotePercent}% liked (${a.voting.voteCount} votes)` : ""
      const free = a.fiatProduct.isFree ? "Free" : "Paid"

      return (
        `[${a.asset.id}] ${a.asset.name}\n` +
        `  ${getAssetTypeName(a.asset.typeId)} | ${free} | By: ${a.creator.name}${verified}${scripts}${votes}`
      )
    })

    const output = [`Found ${assets.length} free ${category.toLowerCase()} for "${params.keyword}":\n`, ...details]

    if (searchResult.data!.nextPageCursor) {
      output.push(`\nMore results available (${searchResult.data!.totalResults} total).`)
    }

    output.push(`\nTo insert an asset into your game:`)
    output.push(`  local asset = game:GetService("InsertService"):LoadAsset(ASSET_ID)`)
    output.push(`  asset.Parent = workspace`)

    return {
      title: `${category}: ${params.keyword}`,
      output: output.join("\n"),
      metadata: { keyword: params.keyword, category, resultCount: assets.length },
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
    const url = `${TOOLBOX_API}/items/details?assetIds=${params.assetId}`
    const result = await fetchWithTimeout<ToolboxDetailsResponse>(url)

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

    const output = [
      `Name: ${a.asset.name}`,
      `Asset ID: ${a.asset.id}`,
      `Type: ${getAssetTypeName(a.asset.typeId)}`,
      `Category: ${a.asset.categoryPath || "N/A"}`,
      ``,
      `Description:`,
      a.asset.description || "(No description)",
      ``,
      `Creator: ${a.creator.name}${verified} (${creatorType})`,
      ``,
      `Price: ${a.fiatProduct.isFree ? "Free" : "Paid"}`,
      `Purchasable: ${a.fiatProduct.purchasable ? "Yes" : "No"}`,
      ``,
      `Votes: ${a.voting.upVotePercent}% liked (${a.voting.voteCount} total)`,
      `  👍 ${a.voting.upVotes}  👎 ${a.voting.downVotes}`,
      ``,
      `Scripts: ${a.asset.hasScripts ? `Yes (${a.asset.scriptCount} scripts)` : "No"}`,
      `Endorsed: ${a.asset.isEndorsed ? "Yes" : "No"}`,
      ``,
      `Created: ${a.asset.createdUtc}`,
      `Updated: ${a.asset.updatedUtc}`,
      ``,
      `To insert this asset in Roblox:`,
      `  local asset = game:GetService("InsertService"):LoadAsset(${a.asset.id})`,
      `  asset.Parent = workspace`,
    ]

    return {
      title: a.asset.name,
      output: output.join("\n"),
      metadata: { assetId: params.assetId },
    }
  },
})

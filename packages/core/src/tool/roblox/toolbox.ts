import z from "zod"
import { Tool } from "../tool"

const CATALOG_API = "https://catalog.roblox.com"
const ECONOMY_API = "https://economy.roblox.com"
const TIMEOUT_MS = 15000

// Asset type mappings for Roblox catalog
export const AssetTypes = {
  Image: 1,
  TShirt: 2,
  Audio: 3,
  Mesh: 4,
  Lua: 5,
  Hat: 8,
  Place: 9,
  Model: 10,
  Shirt: 11,
  Pants: 12,
  Decal: 13,
  Head: 17,
  Face: 18,
  Gear: 19,
  Badge: 21,
  Animation: 24,
  Torso: 27,
  RightArm: 28,
  LeftArm: 29,
  LeftLeg: 30,
  RightLeg: 31,
  Package: 32,
  GamePass: 34,
  Plugin: 38,
  MeshPart: 40,
  HairAccessory: 41,
  FaceAccessory: 42,
  NeckAccessory: 43,
  ShoulderAccessory: 44,
  FrontAccessory: 45,
  BackAccessory: 46,
  WaistAccessory: 47,
  ClimbAnimation: 48,
  DeathAnimation: 49,
  FallAnimation: 50,
  IdleAnimation: 51,
  JumpAnimation: 52,
  RunAnimation: 53,
  SwimAnimation: 54,
  WalkAnimation: 55,
  PoseAnimation: 56,
  Video: 62,
  TShirtAccessory: 64,
  ShirtAccessory: 65,
  PantsAccessory: 66,
  JacketAccessory: 67,
  SweaterAccessory: 68,
  ShortsAccessory: 69,
  LeftShoeAccessory: 70,
  RightShoeAccessory: 71,
  DressSkirtAccessory: 72,
  FontFamily: 73,
  EyebrowAccessory: 76,
  EyelashAccessory: 77,
  MoodAnimation: 78,
  DynamicHead: 79,
} as const

export type AssetTypeName = keyof typeof AssetTypes

interface CatalogSearchResult {
  keyword: string | null
  previousPageCursor: string | null
  nextPageCursor: string | null
  data: Array<{
    id: number
    itemType: "Asset" | "Bundle"
  }>
}

interface AssetDetails {
  TargetId: number
  ProductType: string
  AssetId: number
  ProductId: number
  Name: string
  Description: string
  AssetTypeId: number
  Creator: {
    Id: number
    Name: string
    CreatorType: string
    CreatorTargetId: number
    HasVerifiedBadge: boolean
  }
  IconImageAssetId: number
  Created: string
  Updated: string
  PriceInRobux: number | null
  Sales: number
  IsNew: boolean
  IsForSale: boolean
  IsPublicDomain: boolean
  IsLimited: boolean
  IsLimitedUnique: boolean
  Remaining: number
  MinimumMembershipLevel: number
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

export function getAssetTypeName(id: number): string {
  for (const [name, typeId] of Object.entries(AssetTypes)) {
    if (typeId === id) return name
  }
  return `Unknown(${id})`
}

export const RobloxToolboxSearchTool = Tool.define<
  z.ZodObject<{
    keyword: z.ZodString
    limit: z.ZodOptional<z.ZodNumber>
    cursor: z.ZodOptional<z.ZodString>
  }>,
  { keyword: string; resultCount: number }
>("roblox_toolbox_search", {
  description: `Search the Roblox catalog/toolbox for assets.

Searches for models, audio, images, plugins, and other assets by keyword.
Returns asset IDs that can be used with roblox_asset_details to get more info,
or with InsertService in Roblox to insert the asset into your game.

Examples:
- Search "car" to find car models
- Search "sword" to find weapon models
- Search "background music" to find audio

Note: This searches the public catalog. Results may include both free and paid assets.`,
  parameters: z.object({
    keyword: z.string().describe("Search keyword (e.g., 'car', 'sword', 'tree')"),
    limit: z.number().min(10).max(30).optional().describe("Maximum results: 10, 28, or 30 (default 10)"),
    cursor: z.string().optional().describe("Pagination cursor from previous search"),
  }),
  async execute(params) {
    // API only allows 10, 28, 30, 50, 60, 100, 120 - map to closest allowed value
    const allowedLimits = [10, 28, 30]
    const requestedLimit = params.limit || 10
    const limit = allowedLimits.reduce((prev, curr) =>
      Math.abs(curr - requestedLimit) < Math.abs(prev - requestedLimit) ? curr : prev,
    )

    const url = new URL(`${CATALOG_API}/v1/search/items`)
    url.searchParams.set("keyword", params.keyword)
    url.searchParams.set("limit", limit.toString())
    if (params.cursor) {
      url.searchParams.set("cursor", params.cursor)
    }

    const result = await fetchWithTimeout<CatalogSearchResult>(url.toString())
    if (!result.success) {
      return {
        title: `Search: ${params.keyword}`,
        output: `Error searching catalog: ${result.error}`,
        metadata: { keyword: params.keyword, resultCount: 0 },
      }
    }

    const items = result.data!.data
    if (items.length === 0) {
      return {
        title: `Search: ${params.keyword}`,
        output: `No results found for "${params.keyword}".`,
        metadata: { keyword: params.keyword, resultCount: 0 },
      }
    }

    // Fetch details for each asset
    const details: string[] = []
    for (const item of items) {
      const detailUrl = `${ECONOMY_API}/v2/assets/${item.id}/details`
      const detailResult = await fetchWithTimeout<AssetDetails>(detailUrl)
      if (detailResult.success && detailResult.data) {
        const d = detailResult.data
        const price = d.IsPublicDomain ? "Free" : d.PriceInRobux ? `${d.PriceInRobux} R$` : "Not for sale"
        details.push(
          `[${item.id}] ${d.Name}\n` +
            `  Type: ${getAssetTypeName(d.AssetTypeId)} | ${price}\n` +
            `  By: ${d.Creator.Name} | Sales: ${d.Sales}`,
        )
      } else {
        details.push(`[${item.id}] (${item.itemType}) - Details unavailable`)
      }
    }

    const output = [`Found ${items.length} result(s) for "${params.keyword}":`, "", ...details]

    if (result.data!.nextPageCursor) {
      output.push("")
      output.push(`More results available. Use cursor: "${result.data!.nextPageCursor}"`)
    }

    return {
      title: `Search: ${params.keyword}`,
      output: output.join("\n"),
      metadata: { keyword: params.keyword, resultCount: items.length },
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

Returns name, description, type, price, creator, sales count, and more.
Use the asset ID from roblox_toolbox_search or from the Roblox website URL.

The asset ID can be used with InsertService:LoadAsset() in Roblox to insert
the asset into your game (if it's a model, audio, etc.).`,
  parameters: z.object({
    assetId: z.number().describe("The asset ID to look up"),
  }),
  async execute(params) {
    const url = `${ECONOMY_API}/v2/assets/${params.assetId}/details`
    const result = await fetchWithTimeout<AssetDetails>(url)

    if (!result.success) {
      return {
        title: `Asset ${params.assetId}`,
        output: `Error fetching asset details: ${result.error}`,
        metadata: { assetId: params.assetId },
      }
    }

    const d = result.data!
    const price = d.IsPublicDomain
      ? "Free (Public Domain)"
      : d.PriceInRobux
        ? `${d.PriceInRobux} Robux`
        : "Not for sale"

    const output = [
      `Name: ${d.Name}`,
      `Asset ID: ${d.AssetId}`,
      `Type: ${getAssetTypeName(d.AssetTypeId)}`,
      ``,
      `Description:`,
      d.Description || "(No description)",
      ``,
      `Creator: ${d.Creator.Name} (${d.Creator.CreatorType})`,
      `Verified: ${d.Creator.HasVerifiedBadge ? "Yes" : "No"}`,
      ``,
      `Price: ${price}`,
      `Sales: ${d.Sales.toLocaleString()}`,
      `For Sale: ${d.IsForSale ? "Yes" : "No"}`,
      `Public Domain: ${d.IsPublicDomain ? "Yes" : "No"}`,
      ``,
      `Created: ${d.Created}`,
      `Updated: ${d.Updated}`,
      ``,
      `To insert this asset in Roblox:`,
      `  local asset = game:GetService("InsertService"):LoadAsset(${d.AssetId})`,
      `  asset.Parent = workspace`,
    ]

    if (d.IsLimited || d.IsLimitedUnique) {
      output.splice(10, 0, `Limited: ${d.IsLimitedUnique ? "Limited Unique" : "Limited"}`)
      if (d.Remaining > 0) {
        output.splice(11, 0, `Remaining: ${d.Remaining}`)
      }
    }

    return {
      title: d.Name,
      output: output.join("\n"),
      metadata: { assetId: params.assetId },
    }
  },
})

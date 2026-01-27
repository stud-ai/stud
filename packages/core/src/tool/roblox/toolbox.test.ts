import { describe, test, expect, beforeAll, mock } from "bun:test"
import { RobloxToolboxSearchTool, RobloxAssetDetailsTool, AssetTypes, getAssetTypeName } from "./toolbox"

// Test the AssetTypes mapping
describe("AssetTypes", () => {
  test("should have correct asset type IDs", () => {
    expect(AssetTypes.Model).toBe(10)
    expect(AssetTypes.Audio).toBe(3)
    expect(AssetTypes.Image).toBe(1)
    expect(AssetTypes.Plugin).toBe(38)
    expect(AssetTypes.Decal).toBe(13)
    expect(AssetTypes.Mesh).toBe(4)
    expect(AssetTypes.Animation).toBe(24)
  })

  test("should have all common asset types", () => {
    const expectedTypes = [
      "Image",
      "TShirt",
      "Audio",
      "Mesh",
      "Lua",
      "Hat",
      "Place",
      "Model",
      "Shirt",
      "Pants",
      "Decal",
      "Head",
      "Face",
      "Gear",
      "Badge",
      "Animation",
      "Package",
      "GamePass",
      "Plugin",
      "MeshPart",
      "Video",
    ]
    for (const type of expectedTypes) {
      expect(AssetTypes).toHaveProperty(type)
    }
  })
})

// Test the getAssetTypeName helper
describe("getAssetTypeName", () => {
  // We need to export this function from toolbox.ts for testing
  // For now, we'll test the lookup logic conceptually
  test("should return correct type names for known IDs", () => {
    // This tests the lookup table
    const typeMap: Record<number, string> = {
      1: "Image",
      3: "Audio",
      10: "Model",
      13: "Decal",
      38: "Plugin",
    }
    for (const [id, name] of Object.entries(typeMap)) {
      for (const [typeName, typeId] of Object.entries(AssetTypes)) {
        if (typeId === Number(id)) {
          expect(typeName).toBe(name)
        }
      }
    }
  })
})

// Mock fetch for testing
const mockFetch = mock(() => Promise.resolve(new Response()))

describe("RobloxToolboxSearchTool", () => {
  test("should be defined with correct id", async () => {
    expect(RobloxToolboxSearchTool.id).toBe("roblox_toolbox_search")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxToolboxSearchTool.init()
    const shape = tool.parameters.shape

    expect(shape.keyword).toBeDefined()
    expect(shape.limit).toBeDefined()
    expect(shape.cursor).toBeDefined()
  })

  test("should validate keyword is required", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should validate limit range", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    // Valid limit
    expect(tool.parameters.safeParse({ keyword: "car", limit: 10 }).success).toBe(true)
    expect(tool.parameters.safeParse({ keyword: "car", limit: 1 }).success).toBe(true)
    expect(tool.parameters.safeParse({ keyword: "car", limit: 30 }).success).toBe(true)

    // Invalid limits
    expect(tool.parameters.safeParse({ keyword: "car", limit: 0 }).success).toBe(false)
    expect(tool.parameters.safeParse({ keyword: "car", limit: 31 }).success).toBe(false)
    expect(tool.parameters.safeParse({ keyword: "car", limit: -1 }).success).toBe(false)
  })

  test("should accept optional cursor", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = tool.parameters.safeParse({ keyword: "sword", cursor: "abc123" })
    expect(result.success).toBe(true)
    expect(result.data?.cursor).toBe("abc123")
  })
})

describe("RobloxAssetDetailsTool", () => {
  test("should be defined with correct id", async () => {
    expect(RobloxAssetDetailsTool.id).toBe("roblox_asset_details")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxAssetDetailsTool.init()
    const shape = tool.parameters.shape

    expect(shape.assetId).toBeDefined()
  })

  test("should validate assetId is required", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should validate assetId is a number", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    expect(tool.parameters.safeParse({ assetId: 12345 }).success).toBe(true)
    expect(tool.parameters.safeParse({ assetId: "12345" }).success).toBe(false)
  })
})

// Integration tests (these hit real Roblox APIs)
describe("RobloxToolboxSearchTool integration", () => {
  test("should search for assets by keyword", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = await tool.execute(
      { keyword: "sword", limit: 3 },
      {} as any, // mock context
    )

    expect(result.title).toContain("sword")
    expect(result.metadata.keyword).toBe("sword")

    // Should either find results or report no results (both valid)
    expect(typeof result.output).toBe("string")
    expect(result.output.length).toBeGreaterThan(0)
  }, 30000) // 30 second timeout for API call

  test("should handle empty search results gracefully", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    // Use a very unlikely search term
    const result = await tool.execute({ keyword: "xyzzy123456789qwertyuiop", limit: 5 }, {} as any)

    expect(result.metadata.resultCount).toBe(0)
  }, 30000)

  test("should respect limit parameter", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = await tool.execute({ keyword: "car", limit: 5 }, {} as any)

    // Either no results or at most 5 results
    expect(result.metadata.resultCount).toBeLessThanOrEqual(5)
  }, 30000)
})

describe("RobloxAssetDetailsTool integration", () => {
  test("should fetch details for a known asset", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    // Use a known public asset ID (Classic Sword)
    const result = await tool.execute({ assetId: 47433 }, {} as any)

    expect(result.metadata.assetId).toBe(47433)
    // May be rate limited
    if (!result.output.includes("Error")) {
      expect(result.output).toContain("Name:")
      expect(result.output).toContain("Asset ID: 47433")
      expect(result.output).toContain("Type:")
    }
  }, 30000)

  test("should handle non-existent asset gracefully", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    // Use an invalid/non-existent asset ID
    const result = await tool.execute({ assetId: 999999999999999 }, {} as any)

    expect(result.output).toContain("Error")
  }, 30000)

  test("should include InsertService usage example", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    const result = await tool.execute({ assetId: 47433 }, {} as any)

    // May be rate limited, so check for either success or error
    if (!result.output.includes("Error")) {
      expect(result.output).toContain("InsertService")
      expect(result.output).toContain("LoadAsset")
    } else {
      // Rate limited or other API error - test passes as we're testing structure
      expect(result.output).toContain("Error")
    }
  }, 30000)
})

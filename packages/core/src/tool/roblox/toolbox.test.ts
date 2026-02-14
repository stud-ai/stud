import { describe, test, expect } from "bun:test"
import {
  RobloxToolboxSearchTool,
  RobloxAssetDetailsTool,
  RobloxInsertAssetTool,
  AssetCategories,
  getAssetTypeName,
} from "./toolbox"

// Test the AssetCategories mapping
describe("AssetCategories", () => {
  test("should have correct category IDs", () => {
    expect(AssetCategories.Models).toBe(10)
    expect(AssetCategories.Audio).toBe(3)
    expect(AssetCategories.Decals).toBe(13)
    expect(AssetCategories.Meshes).toBe(4)
    expect(AssetCategories.Plugins).toBe(38)
    expect(AssetCategories.Images).toBe(1)
    expect(AssetCategories.Videos).toBe(62)
    expect(AssetCategories.Animations).toBe(24)
  })
})

// Test the getAssetTypeName helper
describe("getAssetTypeName", () => {
  test("should return correct type names for known IDs", () => {
    expect(getAssetTypeName(10)).toBe("Model")
    expect(getAssetTypeName(3)).toBe("Audio")
    expect(getAssetTypeName(13)).toBe("Decal")
    expect(getAssetTypeName(38)).toBe("Plugin")
    expect(getAssetTypeName(1)).toBe("Image")
  })

  test("should return fallback for unknown IDs", () => {
    expect(getAssetTypeName(99999)).toBe("Type(99999)")
  })
})

describe("RobloxToolboxSearchTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxToolboxSearchTool.id).toBe("roblox_toolbox_search")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxToolboxSearchTool.init()
    const shape = tool.parameters.shape

    expect(shape.keyword).toBeDefined()
    expect(shape.category).toBeDefined()
    expect(shape.freeOnly).toBeDefined()
    expect(shape.limit).toBeDefined()
  })

  test("should validate keyword is required", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should validate limit range", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    // Valid limits
    expect(tool.parameters.safeParse({ keyword: "car", limit: 10 }).success).toBe(true)
    expect(tool.parameters.safeParse({ keyword: "car", limit: 1 }).success).toBe(true)
    expect(tool.parameters.safeParse({ keyword: "car", limit: 30 }).success).toBe(true)

    // Invalid limits
    expect(tool.parameters.safeParse({ keyword: "car", limit: 0 }).success).toBe(false)
    expect(tool.parameters.safeParse({ keyword: "car", limit: 31 }).success).toBe(false)
  })

  test("should accept optional category", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = tool.parameters.safeParse({ keyword: "sword", category: "Audio" })
    expect(result.success).toBe(true)
    expect(result.data?.category).toBe("Audio")
  })

  test("should accept optional freeOnly", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = tool.parameters.safeParse({ keyword: "sword", freeOnly: false })
    expect(result.success).toBe(true)
    expect(result.data?.freeOnly).toBe(false)
  })
})

describe("RobloxAssetDetailsTool", () => {
  test("should be defined with correct id", () => {
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
// Note: These tests are skipped because the execute() function now requires
// instance context for the Picker system. The API functionality is still tested
// in test/roblox/toolbox.test.ts
describe.skip("RobloxToolboxSearchTool integration", () => {
  test("should search for free models by keyword", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = await tool.execute({ keyword: "sword", limit: 10 }, {} as any)

    expect(result.title).toContain("sword")
    expect(result.metadata.keyword).toBe("sword")
    expect(result.metadata.category).toBe("Models")

    // Should find results
    expect(typeof result.output).toBe("string")
    expect(result.output.length).toBeGreaterThan(0)

    // Should mention "Free" since freeOnly defaults to true
    if (result.metadata.resultCount > 0) {
      expect(result.output).toContain("Free")
    }
  }, 30000)

  test("should search in different categories", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = await tool.execute({ keyword: "music", category: "Audio", limit: 10 }, {} as any)

    expect(result.metadata.category).toBe("Audio")
  }, 30000)

  test("should handle search with uncommon keywords", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    // Even random keywords may return results from Roblox's search
    const result = await tool.execute({ keyword: "xyzzy123456789qwertyuiop", limit: 10 }, {} as any)

    // Should return a valid response (may or may not have results)
    expect(typeof result.output).toBe("string")
    expect(result.metadata.resultCount).toBeGreaterThanOrEqual(0)
  }, 30000)

  test("should respect limit parameter", async () => {
    const tool = await RobloxToolboxSearchTool.init()

    const result = await tool.execute({ keyword: "car", limit: 10 }, {} as any)

    // At most 10 results
    expect(result.metadata.resultCount).toBeLessThanOrEqual(10)
  }, 30000)
})

describe("RobloxAssetDetailsTool integration", () => {
  test("should fetch details for a known free asset", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    // Use the Classic Sword (known free model)
    const result = await tool.execute({ assetId: 47433 }, {} as any)

    expect(result.metadata.assetId).toBe(47433)

    // Should have asset info in markdown format
    if (!result.output.includes("Error")) {
      expect(result.output).toContain("# ")
      expect(result.output).toContain("Asset ID | 47433")
      expect(result.output).toContain("Free")
      expect(result.output).toContain("roblox_insert_asset")
    }
  }, 30000)

  test("should handle non-existent asset gracefully", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    // Use an invalid/non-existent asset ID
    const result = await tool.execute({ assetId: 999999999999999 }, {} as any)

    expect(result.output).toMatch(/Error|not found|not accessible/i)
  }, 30000)

  test("should include InsertService usage example", async () => {
    const tool = await RobloxAssetDetailsTool.init()

    const result = await tool.execute({ assetId: 47433 }, {} as any)

    // May be rate limited, so check for either success or error
    if (!result.output.includes("Error") && !result.output.includes("not found")) {
      expect(result.output).toContain("roblox_insert_asset")
    }
  }, 30000)
})

describe("RobloxInsertAssetTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxInsertAssetTool.id).toBe("roblox_insert_asset")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxInsertAssetTool.init()
    const shape = tool.parameters.shape

    expect(shape.assetId).toBeDefined()
    expect(shape.parent).toBeDefined()
    expect(shape.name).toBeDefined()
  })

  test("should validate assetId is required", async () => {
    const tool = await RobloxInsertAssetTool.init()

    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should validate assetId is a number", async () => {
    const tool = await RobloxInsertAssetTool.init()

    expect(tool.parameters.safeParse({ assetId: 12345 }).success).toBe(true)
    expect(tool.parameters.safeParse({ assetId: "12345" }).success).toBe(false)
  })

  test("should accept optional parent parameter", async () => {
    const tool = await RobloxInsertAssetTool.init()

    const result = tool.parameters.safeParse({
      assetId: 12345,
      parent: "game.Workspace.MyFolder",
    })
    expect(result.success).toBe(true)
    expect(result.data?.parent).toBe("game.Workspace.MyFolder")
  })

  test("should accept optional name parameter", async () => {
    const tool = await RobloxInsertAssetTool.init()

    const result = tool.parameters.safeParse({
      assetId: 12345,
      name: "MyCar",
    })
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe("MyCar")
  })

  test("should accept all parameters together", async () => {
    const tool = await RobloxInsertAssetTool.init()

    const result = tool.parameters.safeParse({
      assetId: 12345,
      parent: "game.Workspace.Models",
      name: "ImportedModel",
    })
    expect(result.success).toBe(true)
    expect(result.data?.assetId).toBe(12345)
    expect(result.data?.parent).toBe("game.Workspace.Models")
    expect(result.data?.name).toBe("ImportedModel")
  })
})

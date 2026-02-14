import { describe, test, expect } from "bun:test"
import {
  RobloxToolboxSearchTool,
  RobloxAssetDetailsTool,
  RobloxInsertAssetTool,
  AssetCategories,
  getAssetTypeName,
} from "../../src/tool/roblox/toolbox"

// ============================================================================
// Asset Categories Tests
// ============================================================================

describe("AssetCategories", () => {
  test("should have correct category ID for Models", () => {
    expect(AssetCategories.Models).toBe(10)
  })

  test("should have correct category ID for Audio", () => {
    expect(AssetCategories.Audio).toBe(3)
  })

  test("should have correct category ID for Decals", () => {
    expect(AssetCategories.Decals).toBe(13)
  })

  test("should have correct category ID for Meshes", () => {
    expect(AssetCategories.Meshes).toBe(4)
  })

  test("should have correct category ID for Plugins", () => {
    expect(AssetCategories.Plugins).toBe(38)
  })

  test("should have correct category ID for Images", () => {
    expect(AssetCategories.Images).toBe(1)
  })

  test("should have correct category ID for Videos", () => {
    expect(AssetCategories.Videos).toBe(62)
  })

  test("should have correct category ID for Animations", () => {
    expect(AssetCategories.Animations).toBe(24)
  })

  test("should have all expected categories", () => {
    const expectedCategories = ["Models", "Audio", "Decals", "Meshes", "Plugins", "Images", "Videos", "Animations"]
    const actualCategories = Object.keys(AssetCategories)
    expect(actualCategories.sort()).toEqual(expectedCategories.sort())
  })
})

// ============================================================================
// getAssetTypeName Tests
// ============================================================================

describe("getAssetTypeName", () => {
  test("should return 'Model' for type 10", () => {
    expect(getAssetTypeName(10)).toBe("Model")
  })

  test("should return 'Audio' for type 3", () => {
    expect(getAssetTypeName(3)).toBe("Audio")
  })

  test("should return 'Decal' for type 13", () => {
    expect(getAssetTypeName(13)).toBe("Decal")
  })

  test("should return 'Plugin' for type 38", () => {
    expect(getAssetTypeName(38)).toBe("Plugin")
  })

  test("should return 'Image' for type 1", () => {
    expect(getAssetTypeName(1)).toBe("Image")
  })

  test("should return 'Video' for type 62", () => {
    expect(getAssetTypeName(62)).toBe("Video")
  })

  test("should return 'Animation' for type 24", () => {
    expect(getAssetTypeName(24)).toBe("Animation")
  })

  test("should return 'Mesh' for type 4", () => {
    expect(getAssetTypeName(4)).toBe("Mesh")
  })

  test("should return fallback for unknown type 0", () => {
    expect(getAssetTypeName(0)).toBe("Type(0)")
  })

  test("should return fallback for unknown type 99999", () => {
    expect(getAssetTypeName(99999)).toBe("Type(99999)")
  })

  test("should return fallback for negative type", () => {
    expect(getAssetTypeName(-1)).toBe("Type(-1)")
  })
})

// ============================================================================
// RobloxToolboxSearchTool Tests
// ============================================================================

describe("RobloxToolboxSearchTool", () => {
  test("should be defined", () => {
    expect(RobloxToolboxSearchTool).toBeDefined()
  })

  test("should have correct id", () => {
    expect(RobloxToolboxSearchTool.id).toBe("roblox_toolbox_search")
  })

  test("should have description when initialized", async () => {
    const tool = await RobloxToolboxSearchTool.init()
    expect(tool.description).toBeDefined()
    expect(typeof tool.description).toBe("string")
  })

  describe("parameters", () => {
    test("should have parameters", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      expect(tool.parameters).toBeDefined()
    })

    test("should have keyword parameter", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      expect(tool.parameters.shape.keyword).toBeDefined()
    })

    test("should have category parameter", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      expect(tool.parameters.shape.category).toBeDefined()
    })

    test("should have freeOnly parameter", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      expect(tool.parameters.shape.freeOnly).toBeDefined()
    })

    test("should have limit parameter", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      expect(tool.parameters.shape.limit).toBeDefined()
    })

    test("should have recommended parameter", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      expect(tool.parameters.shape.recommended).toBeDefined()
    })

    test("should require keyword", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const result = tool.parameters.safeParse({})
      expect(result.success).toBe(false)
    })

    test("should accept valid parameters", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const result = tool.parameters.safeParse({
        keyword: "car",
        category: "Models",
        freeOnly: true,
        limit: 10,
      })
      expect(result.success).toBe(true)
    })

    test("should validate limit min value", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const result = tool.parameters.safeParse({
        keyword: "car",
        limit: 0,
      })
      expect(result.success).toBe(false)
    })

    test("should validate limit max value", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const result = tool.parameters.safeParse({
        keyword: "car",
        limit: 31,
      })
      expect(result.success).toBe(false)
    })

    test("should accept limit at minimum boundary", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const result = tool.parameters.safeParse({
        keyword: "car",
        limit: 1,
      })
      expect(result.success).toBe(true)
    })

    test("should accept limit at maximum boundary", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const result = tool.parameters.safeParse({
        keyword: "car",
        limit: 30,
      })
      expect(result.success).toBe(true)
    })

    test("should accept recommended as number array", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const result = tool.parameters.safeParse({
        keyword: "car",
        recommended: [123, 456, 789],
      })
      expect(result.success).toBe(true)
    })

    test("should accept all categories", async () => {
      const tool = await RobloxToolboxSearchTool.init()
      const categories = ["Models", "Audio", "Decals", "Meshes", "Plugins", "Images", "Videos", "Animations"]

      for (const category of categories) {
        const result = tool.parameters.safeParse({
          keyword: "test",
          category,
        })
        expect(result.success).toBe(true)
      }
    })
  })
})

// ============================================================================
// RobloxAssetDetailsTool Tests
// ============================================================================

describe("RobloxAssetDetailsTool", () => {
  test("should be defined", () => {
    expect(RobloxAssetDetailsTool).toBeDefined()
  })

  test("should have correct id", () => {
    expect(RobloxAssetDetailsTool.id).toBe("roblox_asset_details")
  })

  test("should have description when initialized", async () => {
    const tool = await RobloxAssetDetailsTool.init()
    expect(tool.description).toBeDefined()
    expect(typeof tool.description).toBe("string")
  })

  describe("parameters", () => {
    test("should have parameters", async () => {
      const tool = await RobloxAssetDetailsTool.init()
      expect(tool.parameters).toBeDefined()
    })

    test("should have assetId parameter", async () => {
      const tool = await RobloxAssetDetailsTool.init()
      expect(tool.parameters.shape.assetId).toBeDefined()
    })

    test("should require assetId", async () => {
      const tool = await RobloxAssetDetailsTool.init()
      const result = tool.parameters.safeParse({})
      expect(result.success).toBe(false)
    })

    test("should accept valid assetId", async () => {
      const tool = await RobloxAssetDetailsTool.init()
      const result = tool.parameters.safeParse({ assetId: 12345 })
      expect(result.success).toBe(true)
    })

    test("should reject string assetId", async () => {
      const tool = await RobloxAssetDetailsTool.init()
      const result = tool.parameters.safeParse({ assetId: "12345" })
      expect(result.success).toBe(false)
    })

    test("should accept zero assetId", async () => {
      const tool = await RobloxAssetDetailsTool.init()
      const result = tool.parameters.safeParse({ assetId: 0 })
      expect(result.success).toBe(true)
    })

    test("should accept large assetId", async () => {
      const tool = await RobloxAssetDetailsTool.init()
      const result = tool.parameters.safeParse({ assetId: 999999999999 })
      expect(result.success).toBe(true)
    })
  })
})

// ============================================================================
// RobloxInsertAssetTool Tests
// ============================================================================

describe("RobloxInsertAssetTool", () => {
  test("should be defined", () => {
    expect(RobloxInsertAssetTool).toBeDefined()
  })

  test("should have correct id", () => {
    expect(RobloxInsertAssetTool.id).toBe("roblox_insert_asset")
  })

  test("should have description when initialized", async () => {
    const tool = await RobloxInsertAssetTool.init()
    expect(tool.description).toBeDefined()
    expect(typeof tool.description).toBe("string")
  })

  describe("parameters", () => {
    test("should have parameters", async () => {
      const tool = await RobloxInsertAssetTool.init()
      expect(tool.parameters).toBeDefined()
    })

    test("should have assetId parameter", async () => {
      const tool = await RobloxInsertAssetTool.init()
      expect(tool.parameters.shape.assetId).toBeDefined()
    })

    test("should have parent parameter", async () => {
      const tool = await RobloxInsertAssetTool.init()
      expect(tool.parameters.shape.parent).toBeDefined()
    })

    test("should have name parameter", async () => {
      const tool = await RobloxInsertAssetTool.init()
      expect(tool.parameters.shape.name).toBeDefined()
    })

    test("should require assetId", async () => {
      const tool = await RobloxInsertAssetTool.init()
      const result = tool.parameters.safeParse({})
      expect(result.success).toBe(false)
    })

    test("should accept assetId only", async () => {
      const tool = await RobloxInsertAssetTool.init()
      const result = tool.parameters.safeParse({ assetId: 12345 })
      expect(result.success).toBe(true)
    })

    test("should accept all parameters", async () => {
      const tool = await RobloxInsertAssetTool.init()
      const result = tool.parameters.safeParse({
        assetId: 12345,
        parent: "game.Workspace.Models",
        name: "MyCar",
      })
      expect(result.success).toBe(true)
    })

    test("should accept optional parent", async () => {
      const tool = await RobloxInsertAssetTool.init()
      const result = tool.parameters.safeParse({
        assetId: 12345,
        parent: "game.ServerStorage",
      })
      expect(result.success).toBe(true)
    })

    test("should accept optional name", async () => {
      const tool = await RobloxInsertAssetTool.init()
      const result = tool.parameters.safeParse({
        assetId: 12345,
        name: "CustomName",
      })
      expect(result.success).toBe(true)
    })

    test("should reject string assetId", async () => {
      const tool = await RobloxInsertAssetTool.init()
      const result = tool.parameters.safeParse({
        assetId: "12345",
        parent: "game.Workspace",
      })
      expect(result.success).toBe(false)
    })
  })
})

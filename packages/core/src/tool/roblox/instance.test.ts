import { describe, test, expect } from "bun:test"
import {
  RobloxMoveTool,
  RobloxBulkCreateTool,
  RobloxBulkDeleteTool,
  RobloxBulkSetPropertyTool,
  RobloxGetChildrenTool,
  RobloxGetPropertiesTool,
  RobloxSetPropertyTool,
  RobloxCreateTool,
  RobloxDeleteTool,
  RobloxCloneTool,
  RobloxSearchTool,
  RobloxGetSelectionTool,
  RobloxRunCodeTool,
} from "./instance"

describe("RobloxMoveTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxMoveTool.id).toBe("roblox_move")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxMoveTool.init()
    const shape = tool.parameters.shape

    expect(shape.path).toBeDefined()
    expect(shape.newParent).toBeDefined()
  })

  test("should validate path is required", async () => {
    const tool = await RobloxMoveTool.init()

    const result = tool.parameters.safeParse({ newParent: "game.Workspace" })
    expect(result.success).toBe(false)
  })

  test("should validate newParent is required", async () => {
    const tool = await RobloxMoveTool.init()

    const result = tool.parameters.safeParse({ path: "game.Workspace.Part" })
    expect(result.success).toBe(false)
  })

  test("should accept valid parameters", async () => {
    const tool = await RobloxMoveTool.init()

    const result = tool.parameters.safeParse({
      path: "game.Workspace.Part",
      newParent: "game.ServerStorage",
    })
    expect(result.success).toBe(true)
    expect(result.data?.path).toBe("game.Workspace.Part")
    expect(result.data?.newParent).toBe("game.ServerStorage")
  })
})

describe("RobloxBulkCreateTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxBulkCreateTool.id).toBe("roblox_bulk_create")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxBulkCreateTool.init()
    const shape = tool.parameters.shape

    expect(shape.instances).toBeDefined()
  })

  test("should validate instances array is required", async () => {
    const tool = await RobloxBulkCreateTool.init()

    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should validate instances array structure", async () => {
    const tool = await RobloxBulkCreateTool.init()

    // Valid structure
    const validResult = tool.parameters.safeParse({
      instances: [
        { className: "Part", parent: "game.Workspace" },
        { className: "Script", parent: "game.ServerScriptService", name: "MyScript" },
      ],
    })
    expect(validResult.success).toBe(true)

    // Invalid - missing className
    const invalidResult = tool.parameters.safeParse({
      instances: [{ parent: "game.Workspace" }],
    })
    expect(invalidResult.success).toBe(false)

    // Invalid - missing parent
    const invalidResult2 = tool.parameters.safeParse({
      instances: [{ className: "Part" }],
    })
    expect(invalidResult2.success).toBe(false)
  })

  test("should accept empty instances array", async () => {
    const tool = await RobloxBulkCreateTool.init()

    const result = tool.parameters.safeParse({ instances: [] })
    expect(result.success).toBe(true)
  })

  test("should accept optional name in instances", async () => {
    const tool = await RobloxBulkCreateTool.init()

    const result = tool.parameters.safeParse({
      instances: [{ className: "Part", parent: "game.Workspace", name: "MyPart" }],
    })
    expect(result.success).toBe(true)
    expect(result.data?.instances[0].name).toBe("MyPart")
  })
})

describe("RobloxBulkDeleteTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxBulkDeleteTool.id).toBe("roblox_bulk_delete")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxBulkDeleteTool.init()
    const shape = tool.parameters.shape

    expect(shape.paths).toBeDefined()
  })

  test("should validate paths array is required", async () => {
    const tool = await RobloxBulkDeleteTool.init()

    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should accept valid paths array", async () => {
    const tool = await RobloxBulkDeleteTool.init()

    const result = tool.parameters.safeParse({
      paths: ["game.Workspace.Part1", "game.Workspace.Part2", "game.Workspace.Part3"],
    })
    expect(result.success).toBe(true)
    expect(result.data?.paths.length).toBe(3)
  })

  test("should accept empty paths array", async () => {
    const tool = await RobloxBulkDeleteTool.init()

    const result = tool.parameters.safeParse({ paths: [] })
    expect(result.success).toBe(true)
  })

  test("should validate paths are strings", async () => {
    const tool = await RobloxBulkDeleteTool.init()

    const result = tool.parameters.safeParse({ paths: [123, 456] })
    expect(result.success).toBe(false)
  })
})

describe("RobloxBulkSetPropertyTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxBulkSetPropertyTool.id).toBe("roblox_bulk_set_property")
  })

  test("should have required parameters", async () => {
    const tool = await RobloxBulkSetPropertyTool.init()
    const shape = tool.parameters.shape

    expect(shape.operations).toBeDefined()
  })

  test("should validate operations array is required", async () => {
    const tool = await RobloxBulkSetPropertyTool.init()

    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should validate operations array structure", async () => {
    const tool = await RobloxBulkSetPropertyTool.init()

    // Valid structure
    const validResult = tool.parameters.safeParse({
      operations: [
        { path: "game.Workspace.Part", property: "Anchored", value: "true" },
        { path: "game.Workspace.Part", property: "BrickColor", value: "Bright red" },
      ],
    })
    expect(validResult.success).toBe(true)

    // Invalid - missing path
    const invalidResult = tool.parameters.safeParse({
      operations: [{ property: "Anchored", value: "true" }],
    })
    expect(invalidResult.success).toBe(false)

    // Invalid - missing property
    const invalidResult2 = tool.parameters.safeParse({
      operations: [{ path: "game.Workspace.Part", value: "true" }],
    })
    expect(invalidResult2.success).toBe(false)

    // Invalid - missing value
    const invalidResult3 = tool.parameters.safeParse({
      operations: [{ path: "game.Workspace.Part", property: "Anchored" }],
    })
    expect(invalidResult3.success).toBe(false)
  })

  test("should accept empty operations array", async () => {
    const tool = await RobloxBulkSetPropertyTool.init()

    const result = tool.parameters.safeParse({ operations: [] })
    expect(result.success).toBe(true)
  })
})

// Existing tools - basic definition tests
describe("RobloxGetChildrenTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxGetChildrenTool.id).toBe("roblox_get_children")
  })

  test("should validate path is required", async () => {
    const tool = await RobloxGetChildrenTool.init()
    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })

  test("should accept optional recursive parameter", async () => {
    const tool = await RobloxGetChildrenTool.init()
    const result = tool.parameters.safeParse({ path: "game.Workspace", recursive: true })
    expect(result.success).toBe(true)
    expect(result.data?.recursive).toBe(true)
  })
})

describe("RobloxGetPropertiesTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxGetPropertiesTool.id).toBe("roblox_get_properties")
  })

  test("should validate path is required", async () => {
    const tool = await RobloxGetPropertiesTool.init()
    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("RobloxSetPropertyTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxSetPropertyTool.id).toBe("roblox_set_property")
  })

  test("should validate all required parameters", async () => {
    const tool = await RobloxSetPropertyTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.Workspace.Part" }).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.Workspace.Part", property: "Anchored" }).success).toBe(false)
    expect(
      tool.parameters.safeParse({ path: "game.Workspace.Part", property: "Anchored", value: "true" }).success,
    ).toBe(true)
  })
})

describe("RobloxCreateTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxCreateTool.id).toBe("roblox_create")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxCreateTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ className: "Part" }).success).toBe(false)
    expect(tool.parameters.safeParse({ className: "Part", parent: "game.Workspace" }).success).toBe(true)
  })

  test("should accept optional name", async () => {
    const tool = await RobloxCreateTool.init()
    const result = tool.parameters.safeParse({ className: "Part", parent: "game.Workspace", name: "MyPart" })
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe("MyPart")
  })
})

describe("RobloxDeleteTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxDeleteTool.id).toBe("roblox_delete")
  })

  test("should validate path is required", async () => {
    const tool = await RobloxDeleteTool.init()
    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.Workspace.Part" }).success).toBe(true)
  })
})

describe("RobloxCloneTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxCloneTool.id).toBe("roblox_clone")
  })

  test("should validate path is required", async () => {
    const tool = await RobloxCloneTool.init()
    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.Workspace.Part" }).success).toBe(true)
  })

  test("should accept optional parent", async () => {
    const tool = await RobloxCloneTool.init()
    const result = tool.parameters.safeParse({ path: "game.Workspace.Part", parent: "game.ServerStorage" })
    expect(result.success).toBe(true)
    expect(result.data?.parent).toBe("game.ServerStorage")
  })
})

describe("RobloxSearchTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxSearchTool.id).toBe("roblox_search")
  })

  test("should accept optional parameters", async () => {
    const tool = await RobloxSearchTool.init()

    const result = tool.parameters.safeParse({
      root: "game.Workspace",
      name: "Part",
      className: "BasePart",
      limit: 25,
    })
    expect(result.success).toBe(true)
  })
})

describe("RobloxGetSelectionTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxGetSelectionTool.id).toBe("roblox_get_selection")
  })

  test("should accept empty parameters", async () => {
    const tool = await RobloxGetSelectionTool.init()
    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(true)
  })
})

describe("RobloxRunCodeTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxRunCodeTool.id).toBe("roblox_run_code")
  })

  test("should validate code is required", async () => {
    const tool = await RobloxRunCodeTool.init()
    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ code: 'print("Hello")' }).success).toBe(true)
  })
})

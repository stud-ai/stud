import { describe, expect, test } from "bun:test"
import { RobloxPlaytestRunTool } from "./playtest"

describe("RobloxPlaytestRunTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxPlaytestRunTool.id).toBe("roblox_playtest_run")
  })

  test("should require suite and checks", async () => {
    const tool = await RobloxPlaytestRunTool.init()
    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ suite: "combat-suite" }).success).toBe(false)
    expect(tool.parameters.safeParse({ checks: [] }).success).toBe(false)
  })

  test("should validate all supported check types", async () => {
    const tool = await RobloxPlaytestRunTool.init()
    const result = tool.parameters.safeParse({
      suite: "combat-suite",
      checks: [
        {
          id: "exists-classic-sword",
          label: "ClassicSword exists",
          type: "instance_exists",
          path: "game.StarterPack.ClassicSword",
        },
        {
          id: "anchored-baseplate",
          label: "Baseplate is anchored",
          type: "property_equals",
          path: "game.Workspace.Baseplate",
          property: "Anchored",
          expected: "true",
        },
        {
          id: "sword-system-compiles",
          label: "SwordSystem compiles",
          type: "script_compiles",
          path: "game.ServerScriptService.SwordSystem",
        },
      ],
    })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.checks).toHaveLength(3)
  })

  test("should reject malformed checks", async () => {
    const tool = await RobloxPlaytestRunTool.init()

    const missingPath = tool.parameters.safeParse({
      suite: "combat-suite",
      checks: [{ id: "x", label: "x", type: "instance_exists" }],
    })
    expect(missingPath.success).toBe(false)

    const missingExpected = tool.parameters.safeParse({
      suite: "combat-suite",
      checks: [{ id: "x", label: "x", type: "property_equals", path: "game.Workspace.Baseplate", property: "Anchored" }],
    })
    expect(missingExpected.success).toBe(false)
  })
})

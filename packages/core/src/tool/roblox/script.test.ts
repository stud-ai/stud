import { describe, test, expect } from "bun:test"
import { RobloxGetScriptTool, RobloxSetScriptTool, RobloxEditScriptTool } from "./script"
import { isStudioConnected } from "./client"
import { Tool } from "../tool"

const ctx: Tool.Context = {
  sessionID: "test",
  messageID: "test",
  agent: "test",
  abort: new AbortController().signal,
  messages: [],
  metadata: () => {},
  ask: async () => {},
}

describe("RobloxGetScriptTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxGetScriptTool.id).toBe("roblox_get_script")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxGetScriptTool.init()
    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.ServerScriptService.MainScript" }).success).toBe(true)
  })

  test("returns not connected response when Studio is unavailable", async () => {
    const connected = await isStudioConnected()
    if (connected) return
    const tool = await RobloxGetScriptTool.init()
    const result = await tool.execute({ path: "game.Workspace.Part.Script" }, ctx)
    expect(result.title).toBe("Not connected")
    expect(result.output).toContain("Roblox Studio is not connected")
    expect(result.metadata.path).toBe("game.Workspace.Part.Script")
  })
})

describe("RobloxSetScriptTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxSetScriptTool.id).toBe("roblox_set_script")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxSetScriptTool.init()
    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.ServerScriptService.MainScript" }).success).toBe(false)
    expect(
      tool.parameters.safeParse({ path: "game.ServerScriptService.MainScript", source: "print('hi')" }).success,
    ).toBe(true)
  })

  test("returns not connected response when Studio is unavailable", async () => {
    const connected = await isStudioConnected()
    if (connected) return
    const tool = await RobloxSetScriptTool.init()
    const result = await tool.execute({ path: "game.ServerScriptService.MainScript", source: "print('hi')" }, ctx)
    expect(result.title).toBe("Not connected")
    expect(result.output).toContain("Roblox Studio is not connected")
    expect(result.metadata.path).toBe("game.ServerScriptService.MainScript")
  })
})

describe("RobloxEditScriptTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxEditScriptTool.id).toBe("roblox_edit_script")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxEditScriptTool.init()
    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.ServerScriptService.MainScript" }).success).toBe(false)
    expect(tool.parameters.safeParse({ path: "game.ServerScriptService.MainScript", oldCode: "a" }).success).toBe(false)
    expect(
      tool.parameters.safeParse({
        path: "game.ServerScriptService.MainScript",
        oldCode: "local speed = 10",
        newCode: "local speed = 20",
      }).success,
    ).toBe(true)
  })

  test("returns not connected response when Studio is unavailable", async () => {
    const connected = await isStudioConnected()
    if (connected) return
    const tool = await RobloxEditScriptTool.init()
    const result = await tool.execute(
      { path: "game.ServerScriptService.MainScript", oldCode: "local speed = 10", newCode: "local speed = 20" },
      ctx,
    )
    expect(result.title).toBe("Not connected")
    expect(result.output).toContain("Roblox Studio is not connected")
    expect(result.metadata.path).toBe("game.ServerScriptService.MainScript")
  })
})


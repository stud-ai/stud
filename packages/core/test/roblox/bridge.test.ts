import { describe, test, expect } from "bun:test"
import { isStudioConnected, isBridgeRunning, studioRequest } from "../../src/tool/roblox/client"

describe("Bridge Server", () => {
  test("bridge is running", async () => {
    const running = await isBridgeRunning()
    console.log(`Bridge running: ${running}`)
    expect(running).toBe(true)
  })

  test("Studio is connected", async () => {
    const connected = await isStudioConnected()
    console.log(`Studio connected: ${connected}`)
    // This will fail if Studio isn't connected - that's expected
    expect(connected).toBe(true)
  })

  test("can execute code in Studio", async () => {
    const connected = await isStudioConnected()
    if (!connected) {
      console.log("Skipping - Studio not connected")
      return
    }

    const result = await studioRequest<{ output: string }>("/code/run", {
      code: 'print("Hello from test"); return "success"',
    })

    console.log("Result:", result)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.output).toContain("success")
    }
  })

  test("can get workspace children", async () => {
    const connected = await isStudioConnected()
    if (!connected) {
      console.log("Skipping - Studio not connected")
      return
    }

    const result = await studioRequest<{ children: string[] }>("/instance/children", {
      path: "game.Workspace",
    })

    console.log("Workspace children:", result)
    expect(result.success).toBe(true)
  })
})

describe("InsertService", () => {
  test("can check InsertService availability", async () => {
    const connected = await isStudioConnected()
    if (!connected) {
      console.log("Skipping - Studio not connected")
      return
    }

    const result = await studioRequest<{ output: string }>("/code/run", {
      code: `
        local InsertService = game:GetService("InsertService")
        return "InsertService available: " .. tostring(InsertService ~= nil)
      `,
    })

    console.log("InsertService check:", result)
    expect(result.success).toBe(true)
  })

  test("can load asset using game:GetObjects (the fix)", async () => {
    const connected = await isStudioConnected()
    if (!connected) {
      console.log("Skipping - Studio not connected")
      return
    }

    // Use game:GetObjects which works in Studio without ownership
    const assetId = 17158839996 // A free car model
    const result = await studioRequest<{ output: string; error?: string }>("/code/run", {
      code: `
        local assetId = ${assetId}
        local success, result = pcall(function()
          local objects = game:GetObjects("rbxassetid://" .. assetId)
          if #objects == 0 then
            error("No objects returned")
          end
          local model = objects[1]
          model.Name = "TestCar_" .. tick()
          model.Parent = workspace
          return "SUCCESS: " .. model.Name .. " with " .. #model:GetDescendants() .. " descendants"
        end)
        if success then
          return result
        else
          error(result)
        end
      `,
    })

    console.log("GetObjects result:", result)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.output).toContain("SUCCESS")
    }
  })
})

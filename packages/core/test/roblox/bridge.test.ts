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

  test("can run structured playtest checks", async () => {
    const connected = await isStudioConnected()
    if (!connected) {
      console.log("Skipping - Studio not connected")
      return
    }

    await studioRequest<{ output: string }>("/code/run", {
      code: `
        local parent = game:GetService("ServerScriptService")

        local passScript = parent:FindFirstChild("StudPlaytestPass")
        if not passScript then
          passScript = Instance.new("ModuleScript")
          passScript.Name = "StudPlaytestPass"
          passScript.Parent = parent
        end
        passScript.Source = "return true"

        local failScript = parent:FindFirstChild("StudPlaytestFail")
        if not failScript then
          failScript = Instance.new("ModuleScript")
          failScript.Name = "StudPlaytestFail"
          failScript.Parent = parent
        end
        failScript.Source = "local x ="

        return "prepared"
      `,
    })

    const result = await studioRequest<{
      suite: string
      passed: boolean
      totals: { total: number; passed: number; failed: number }
      checks: Array<{ id: string; passed: boolean; detail: string }>
    }>("/playtest/run", {
      suite: "bridge-playtest",
      checks: [
        {
          id: "instance-pass",
          label: "Workspace exists",
          type: "instance_exists",
          path: "game.Workspace",
        },
        {
          id: "instance-fail",
          label: "Missing object fails",
          type: "instance_exists",
          path: "game.DoesNotExist",
        },
        {
          id: "property-pass",
          label: "Workspace name check",
          type: "property_equals",
          path: "game.Workspace",
          property: "Name",
          expected: "Workspace",
        },
        {
          id: "script-pass",
          label: "Valid script compiles",
          type: "script_compiles",
          path: "game.ServerScriptService.StudPlaytestPass",
        },
        {
          id: "script-fail",
          label: "Invalid script fails",
          type: "script_compiles",
          path: "game.ServerScriptService.StudPlaytestFail",
        },
      ],
    })

    console.log("Playtest result:", result)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.suite).toBe("bridge-playtest")
      expect(result.data.totals.total).toBe(5)
      expect(result.data.totals.passed).toBe(3)
      expect(result.data.totals.failed).toBe(2)

      const byID = new Map(result.data.checks.map((check) => [check.id, check]))
      expect(byID.get("instance-pass")?.passed).toBe(true)
      expect(byID.get("instance-fail")?.passed).toBe(false)
      expect(byID.get("property-pass")?.passed).toBe(true)
      expect(byID.get("script-pass")?.passed).toBe(true)
      expect(byID.get("script-fail")?.passed).toBe(false)
    }

    await studioRequest<{ output: string }>("/code/run", {
      code: `
        local parent = game:GetService("ServerScriptService")
        local passScript = parent:FindFirstChild("StudPlaytestPass")
        if passScript then passScript:Destroy() end
        local failScript = parent:FindFirstChild("StudPlaytestFail")
        if failScript then failScript:Destroy() end
      `,
    })
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

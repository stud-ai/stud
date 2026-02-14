import z from "zod"
import { Tool } from "../tool"
import { studioRequest, isStudioConnected, notConnectedError } from "./client"

interface ScriptContent {
  path: string
  source: string
  className: string
}

export const RobloxGetScriptTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
  }>,
  { path: string }
>("roblox_get_script", {
  description: `Read the source code of a script in Roblox Studio.

Use this to read scripts like ServerScriptService.MainScript or Workspace.Part.LocalScript.
The path should be the full instance path from game root.

Usage:
- You MUST read a script before editing or replacing it. This tool is a prerequisite for roblox_edit_script and roblox_set_script.
- Results are returned with line numbers for easy reference.
- You can call this tool multiple times in parallel to read several scripts at once.

Examples:
- game.ServerScriptService.MainScript
- game.ReplicatedStorage.Modules.Utils
- game.Workspace.SpawnLocation.TouchScript`,
  parameters: z.object({
    path: z.string().describe("Full instance path to the script (e.g. game.ServerScriptService.MainScript)"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<ScriptContent>("/script/get", { path: params.path })
    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    const lines = result.data.source.split("\n")
    const numbered = lines.map((line, i) => `${(i + 1).toString().padStart(5, "0")}| ${line}`).join("\n")

    return {
      title: params.path,
      output: `<script path="${result.data.path}" class="${result.data.className}">\n${numbered}\n</script>`,
      metadata: { path: result.data.path },
    }
  },
})

export const RobloxSetScriptTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
    source: z.ZodString
  }>,
  { path: string }
>("roblox_set_script", {
  description: `Replace the entire source code of a script in Roblox Studio.

This completely replaces the script's contents. For partial edits, use roblox_edit_script instead — it is safer and more precise.

Usage:
- You MUST use roblox_get_script first to read the current source before replacing.
- Only use this when writing a completely new script or rewriting the majority of the code.
- The path should be the full instance path from game root.`,
  parameters: z.object({
    path: z.string().describe("Full instance path to the script"),
    source: z.string().describe("The new source code for the script"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<{ path: string }>("/script/set", {
      path: params.path,
      source: params.source,
    })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    const lines = params.source.split("\n").length
    return {
      title: params.path,
      output: `Successfully updated ${result.data.path} (${lines} lines)`,
      metadata: { path: result.data.path },
    }
  },
})

export const RobloxEditScriptTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
    oldCode: z.ZodString
    newCode: z.ZodString
  }>,
  { path: string }
>("roblox_edit_script", {
  description: `Edit a portion of a script by replacing specific code.

This performs a find-and-replace operation on the script source.
ALWAYS prefer this over roblox_set_script when making partial changes.

Usage:
- You MUST use roblox_get_script first to read the current source. Never edit a script you haven't read.
- The oldCode must match EXACTLY — including whitespace, indentation, and line breaks. Copy it precisely from the roblox_get_script output.
- If the oldCode appears multiple times in the script, all occurrences will be replaced. Provide enough surrounding context in oldCode to uniquely identify the section you want to change.
- Keep oldCode as small as needed to be unique — don't include the entire script.

Example:
  oldCode: "local speed = 10"
  newCode: "local speed = 20"`,
  parameters: z.object({
    path: z.string().describe("Full instance path to the script"),
    oldCode: z.string().describe("The exact code to find and replace"),
    newCode: z.string().describe("The new code to replace it with"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<{ path: string; replaced: number }>("/script/edit", {
      path: params.path,
      oldCode: params.oldCode,
      newCode: params.newCode,
    })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    return {
      title: params.path,
      output: `Successfully edited ${result.data.path} (${result.data.replaced} replacement${result.data.replaced !== 1 ? "s" : ""})`,
      metadata: { path: result.data.path },
    }
  },
})

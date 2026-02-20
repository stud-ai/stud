import z from "zod"
import { Tool } from "../tool"
import { isStudioConnected, notConnectedError, studioRequest } from "./client"

const InstanceExistsCheck = z.object({
  id: z.string().describe("Stable check identifier"),
  label: z.string().describe("Human-readable check label"),
  type: z.literal("instance_exists"),
  path: z.string().describe("Instance path to verify"),
})

const PropertyEqualsCheck = z.object({
  id: z.string().describe("Stable check identifier"),
  label: z.string().describe("Human-readable check label"),
  type: z.literal("property_equals"),
  path: z.string().describe("Instance path to verify"),
  property: z.string().describe("Property name to compare"),
  expected: z.string().describe("Expected property value"),
})

const ScriptCompilesCheck = z.object({
  id: z.string().describe("Stable check identifier"),
  label: z.string().describe("Human-readable check label"),
  type: z.literal("script_compiles"),
  path: z.string().describe("Script instance path to compile"),
})

const PlaytestCheck = z.discriminatedUnion("type", [InstanceExistsCheck, PropertyEqualsCheck, ScriptCompilesCheck])

export type PlaytestRunRequest = {
  suite: string
  checks: Array<z.infer<typeof PlaytestCheck>>
}

export type PlaytestRunResponse = {
  suite: string
  passed: boolean
  totals: { total: number; passed: number; failed: number }
  checks: Array<{
    id: string
    label: string
    passed: boolean
    detail: string
    durationMs: number
  }>
}

const pluginOutdatedMessage = `Playtest endpoint is unavailable in your installed Studio plugin.

Update your local plugin from studio-plugin/Stud.server.lua and reconnect Studio, then run this playtest again.`

function isMissingEndpointError(input: string) {
  const error = input.toLowerCase()
  if (!error.includes("not found")) return false
  return error.includes("/playtest/run")
}

function formatOutput(result: PlaytestRunResponse) {
  const lines = [
    `Suite: ${result.suite}`,
    `Result: ${result.passed ? "PASS" : "FAIL"} (${result.totals.passed}/${result.totals.total})`,
    "",
    "Checks:",
  ]

  for (const check of result.checks) {
    const status = check.passed ? "PASS" : "FAIL"
    lines.push(`- [${status}] ${check.label} (${check.durationMs}ms)`)
    lines.push(`  ${check.detail}`)
  }

  return lines.join("\n")
}

export const RobloxPlaytestRunTool = Tool.define<
  z.ZodObject<{
    suite: z.ZodString
    checks: z.ZodArray<typeof PlaytestCheck>
  }>,
  PlaytestRunResponse & { source: "studio-plugin" }
>("roblox_playtest_run", {
  description: `Run a structured playtest verification suite inside Roblox Studio.

Checks are executed by the Studio plugin and return deterministic pass/fail results.
Use this after making gameplay or hierarchy changes to validate game state before publish.`,
  parameters: z.object({
    suite: z.string().describe("Name of the playtest suite"),
    checks: z.array(PlaytestCheck).min(1).describe("Playtest checks to execute"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return {
        title: "Not connected",
        output: notConnectedError(),
        metadata: {
          suite: params.suite,
          passed: false,
          totals: {
            total: params.checks.length,
            passed: 0,
            failed: params.checks.length,
          },
          checks: params.checks.map((check) => ({
            id: check.id,
            label: check.label,
            passed: false,
            detail: "Studio not connected",
            durationMs: 0,
          })),
          source: "studio-plugin",
        },
      }
    }

    const result = await studioRequest<PlaytestRunResponse>("/playtest/run", params)
    if (!result.success) {
      const missing = isMissingEndpointError(result.error)
      const output = missing ? pluginOutdatedMessage : `Error running playtest: ${result.error}`
      return {
        title: `Playtest: ${params.suite}`,
        output,
        metadata: {
          suite: params.suite,
          passed: false,
          totals: {
            total: params.checks.length,
            passed: 0,
            failed: params.checks.length,
          },
          checks: params.checks.map((check) => ({
            id: check.id,
            label: check.label,
            passed: false,
            detail: missing ? "Studio plugin missing /playtest/run endpoint" : result.error,
            durationMs: 0,
          })),
          source: "studio-plugin",
        },
      }
    }

    return {
      title: `Playtest ${result.data.passed ? "passed" : "failed"}`,
      output: formatOutput(result.data),
      metadata: {
        ...result.data,
        source: "studio-plugin",
      },
    }
  },
})

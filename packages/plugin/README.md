# @stud/plugin

Plugin SDK for extending Stud with custom tools, hooks, and authentication providers.

## Overview

Plugins are async functions that receive a `PluginInput` context and return a `Hooks` object. Hooks let you intercept and modify behavior at various points in the Stud lifecycle.

## Creating a Plugin

```ts
import type { Plugin } from "@stud/plugin"

const myPlugin: Plugin = async (input) => {
  return {
    // React to events
    event: async ({ event }) => {
      console.log("Event:", event)
    },

    // Add custom tools
    tool: {
      myTool: {
        description: "Does something useful",
        parameters: z.object({ input: z.string() }),
        async execute(args) {
          return { output: `Processed: ${args.input}` }
        },
      },
    },

    // Modify chat parameters before sending to LLM
    "chat.params": async (input, output) => {
      output.temperature = 0.5
    },
  }
}
```

## Available Hooks

| Hook | Description |
|------|-------------|
| `event` | React to system events |
| `config` | Modify configuration at startup |
| `tool` | Register custom tools |
| `auth` | Custom authentication (OAuth, API key) |
| `chat.message` | Intercept new messages |
| `chat.params` | Modify LLM parameters (temperature, etc.) |
| `chat.headers` | Add custom headers to LLM requests |
| `permission.ask` | Override permission prompts |
| `command.execute.before` | Pre-process commands |
| `tool.execute.before` | Pre-process tool calls |
| `tool.execute.after` | Post-process tool results |

## Exports

| Export | Description |
|--------|-------------|
| `@stud/plugin` | Plugin types and `ToolDefinition` |
| `@stud/plugin/tool` | Tool definition types |

## Development

```bash
bun run typecheck
```

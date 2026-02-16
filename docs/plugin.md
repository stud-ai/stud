# `packages/plugin` — Plugin SDK

The plugin package defines the public API for extending Stud with custom hooks, tools, and authentication methods.

## Overview

- **Package name**: `@stud/plugin`
- **Entry**: `src/index.ts`
- **Purpose**: Define the plugin interface that external/internal plugins implement

## Plugin Interface

A plugin is an async function that receives a context and returns a `Hooks` object:

```ts
import type { Plugin } from "@stud/plugin"

const myPlugin: Plugin = async ({ client, project, directory, $ }) => {
  return {
    // Hook implementations
  }
}
```

### Plugin Input

| Property | Type | Description |
|----------|------|-------------|
| `client` | SDK Client | Pre-configured API client |
| `project` | `Project` | Current project metadata |
| `directory` | `string` | Project root directory |
| `worktree` | `string` | Git worktree path |
| `serverUrl` | `URL` | Local server URL |
| `$` | `BunShell` | Shell execution helper |

## Available Hooks

### Event Hooks

| Hook | Description |
|------|-------------|
| `event` | Called for every server-sent event |
| `config` | Called when project configuration changes |

### Chat Hooks

| Hook | Description |
|------|-------------|
| `chat.message` | Called when a new user message is sent |
| `chat.params` | Modify LLM parameters (temperature, topP, etc.) before sending |
| `chat.headers` | Add custom HTTP headers to LLM requests |

### Tool Hooks

| Hook | Description |
|------|-------------|
| `tool` | Register custom tools the AI can use |
| `tool.execute.before` | Modify tool arguments before execution |
| `tool.execute.after` | Transform tool output after execution |

### Permission Hooks

| Hook | Description |
|------|-------------|
| `permission.ask` | Override permission prompts (auto-approve, deny, etc.) |

### Command Hooks

| Hook | Description |
|------|-------------|
| `command.execute.before` | Intercept slash commands before execution |

### Authentication Hooks

| Hook | Description |
|------|-------------|
| `auth` | Register custom authentication methods (OAuth, API key) |

### Experimental Hooks

| Hook | Description |
|------|-------------|
| `experimental.chat.messages.transform` | Transform the message array before sending to the LLM |
| `experimental.chat.system.transform` | Modify the system prompt |
| `experimental.session.compacting` | Customize session compaction behavior |
| `experimental.text.complete` | Post-process streamed text |

## Custom Tools

Plugins can register custom tools:

```ts
import type { ToolDefinition } from "@stud/plugin"

const myTool: ToolDefinition = {
  name: "my_tool",
  description: "Does something useful",
  parameters: {
    type: "object",
    properties: {
      input: { type: "string", description: "The input" },
    },
    required: ["input"],
  },
  async execute({ input }) {
    return { title: "Result", output: `Processed: ${input}` }
  },
}
```

## Shell Helper

The `$` helper provides a safe way to run shell commands:

```ts
const result = await $`ls -la ${directory}`
console.log(result.stdout)
```

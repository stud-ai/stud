# @stud/core

The AI engine that powers Stud. Handles sessions, tool execution, LLM provider integration, the local bridge server, and Roblox-specific tooling.

## What's Inside

| Module | Description |
|--------|-------------|
| `session/` | Session lifecycle, prompt processing, message formatting, compaction |
| `provider/` | Multi-provider LLM abstraction (Anthropic, OpenAI, Google, Groq, Mistral, …) |
| `tool/` | Built-in tool registry — file ops, bash, search, Roblox tools, web fetch |
| `server/` | Hono HTTP server powering the desktop app and Studio bridge |
| `roblox/` | Roblox Studio bridge, cloud APIs, discovery |
| `agent/` | Agent configuration and multi-agent orchestration |
| `cli/` | Terminal UI and CLI commands |
| `mcp/` | Model Context Protocol client integration |
| `acp/` | Agent Client Protocol server ([docs](src/acp/README.md)) |
| `plugin/` | Plugin loading and hook execution |
| `config/` | Project configuration (`stud.jsonc`) |

## Development

```bash
# Run in dev mode
bun run dev

# Typecheck
bun run typecheck

# Run tests
bun test
```

## Build

```bash
bun run build
```

Produces platform-specific binaries in `dist/`.

## Exports

All source modules are exported via `"./*": "./src/*.ts"`, so consumers import as:

```ts
import { Session } from "@stud/core/session"
import { Provider } from "@stud/core/provider"
```

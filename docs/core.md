# `packages/core` — AI Engine

The core package is the brain of Stud. It contains the AI engine, CLI interface, tool definitions, session management, provider integrations, and the local HTTP bridge server.

## Overview

- **Package name**: `@stud/core`
- **Runtime**: Bun
- **Entry point**: `src/index.ts` (CLI entry via `yargs`)

## Directory Structure

```
packages/core/src/
├── index.ts              # CLI entry point — registers all commands
├── agent/                # Agent orchestration and multi-step planning
├── acp/                  # Agent Communication Protocol support
├── auth/                 # Authentication management (API keys, OAuth)
├── bus/                  # Event bus for internal pub/sub messaging
├── cli/                  # CLI commands and TUI interface
│   └── cmd/              # Individual CLI commands (run, serve, auth, mcp, etc.)
│       └── tui/          # Terminal UI — interactive session interface
├── command/              # Slash command system (/init, /review, etc.)
├── config/               # Project configuration loading and validation
├── env/                  # Environment variable resolution
├── file/                 # File system operations and watching
├── flag/                 # Feature flags and runtime environment variables
├── format/               # Code formatting integration
├── global/               # Global state management
├── id/                   # ID generation utilities (ULID-based)
├── ide/                  # IDE integration hooks
├── installation/         # Installation metadata and version tracking
├── lsp/                  # Language Server Protocol integration
├── mcp/                  # Model Context Protocol client and OAuth support
├── migration/            # Data migration utilities
├── patch/                # Code patching utilities
├── permission/           # Permission system for tool execution
├── picker/               # File/model picker logic
├── plugin/               # Plugin loading and lifecycle management
├── project/              # Project discovery and workspace management
├── provider/             # AI provider integrations
│   └── sdk/              # OpenAI-compatible provider implementations
├── pty/                  # Pseudo-terminal management
├── question/             # User question/confirmation system
├── roblox/               # Roblox-specific integrations
├── scheduler/            # Task scheduling
├── server/               # Local HTTP bridge server (Hono)
├── session/              # Chat session management and message processing
│   └── prompt/           # System prompt templates for different AI models
├── share/                # Session sharing functionality
├── shell/                # Shell execution utilities
├── skill/                # Skill/ability system
├── snapshot/             # State snapshot management
├── storage/              # Persistent storage layer
├── tool/                 # AI tool definitions (30+ tools)
│   └── roblox/           # Roblox-specific tools (bridge, cloud, instance, etc.)
├── util/                 # Internal utilities (logging, queue, diff, etc.)
└── worktree/             # Git worktree management
```

## Key Subsystems

### AI Providers (`provider/`)

Supports multiple AI backends through a unified interface:

- Anthropic (Claude)
- OpenAI (GPT-4, o-series)
- Google (Gemini)
- Groq
- Mistral
- Amazon Bedrock
- Azure OpenAI
- xAI (Grok)
- DeepSeek
- Any OpenAI-compatible endpoint

Provider configuration includes model discovery, authentication, and parameter transformation.

### Tools (`tool/`)

The AI agent can use 30+ tools to interact with the codebase and Roblox Studio:

| Category | Tools |
|----------|-------|
| **File Operations** | `read`, `write`, `edit`, `multiedit`, `ls`, `glob`, `grep`, `codesearch` |
| **Code Execution** | `bash` (shell), `apply_patch` |
| **Planning** | `plan`, `task`, `todo` |
| **Web** | `websearch`, `webfetch` |
| **IDE** | `lsp` (diagnostics, definitions) |
| **Roblox Studio** | `script/get`, `script/set`, `instance/create`, `instance/properties`, etc. |
| **Roblox Cloud** | `datastore`, `ordered-datastore`, `publish-place`, `toolbox-search` |
| **Interaction** | `question` (ask the user), `skill` |

Each tool has a `.ts` implementation and a `.txt` prompt description that tells the AI when and how to use it.

### Session Management (`session/`)

Handles the full lifecycle of a chat conversation:

- **Message processing** — converts user input into AI-consumable format
- **System prompts** — model-specific prompt templates (Claude, GPT, Gemini, Qwen, etc.)
- **Compaction** — intelligent context window management to stay within token limits
- **Retry logic** — automatic retry with backoff on transient failures
- **Summary** — session summarization for context preservation
- **Revert** — undo file changes made during a session

### Bridge Server (`server/`)

A local HTTP server built with [Hono](https://hono.dev/) that:

1. Exposes a REST API consumed by the desktop app and SDK
2. Bridges commands to the Roblox Studio plugin via a polling mechanism
3. Provides SSE (Server-Sent Events) for real-time UI updates
4. Handles authentication via Basic Auth (password auto-generated per session)

### CLI Commands

The core package doubles as a CLI tool (`stud`):

| Command | Description |
|---------|-------------|
| `stud` | Launch the TUI (default) |
| `stud run` | Run a prompt non-interactively |
| `stud serve` | Start the HTTP server without TUI |
| `stud web` | Start the web-based UI |
| `stud auth` | Manage AI provider authentication |
| `stud mcp` | Manage MCP server connections |
| `stud models` | List available AI models |
| `stud stats` | Show usage statistics |
| `stud export` | Export session data |
| `stud import` | Import session data |
| `stud github` | GitHub Actions integration |
| `stud pr` | Pull request review |
| `stud acp` | Agent Communication Protocol mode |
| `stud upgrade` | Upgrade to the latest version |
| `stud uninstall` | Uninstall Stud |

### MCP Integration (`mcp/`)

Full support for the [Model Context Protocol](https://modelcontextprotocol.io/):

- Connect to external MCP servers (stdio and SSE transport)
- OAuth authentication for protected MCP servers
- Dynamic client registration (RFC 7591)
- Tools from MCP servers are surfaced to the AI agent

### Permission System (`permission/`)

Safety-first approach to tool execution:

- Commands are classified by risk level
- Destructive operations require user approval
- Configurable allow/deny rules per project
- Arity-based command validation

# Stud Prompt System - Technical Documentation

> **Note**: Stud is forked from OpenCode. This document explains how the current prompt system works and identifies opportunities for improvement.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Prompts](#system-prompts)
3. [User Prompt Handling](#user-prompt-handling)
4. [Context Injection](#context-injection)
5. [Tool/Function Definitions](#toolfunction-definitions)
6. [Message Formatting](#message-formatting)
7. [Provider Abstraction](#provider-abstraction)
8. [Token Management & Compaction](#token-management--compaction)
9. [Memory & History](#memory--history)
10. [Improvement Opportunities](#improvement-opportunities)

---

## Architecture Overview

```
User Input
    │
    ▼
┌─────────────────────────────────────────┐
│           SessionPrompt.prompt()         │
│  /packages/core/src/session/prompt.ts   │
└─────────────────────────────────────────┘
    │
    ├─► createUserMessage() → Parse parts, read files, invoke tools
    │
    ▼
┌─────────────────────────────────────────┐
│            SessionPrompt.loop()          │
└─────────────────────────────────────────┘
    │
    ├─► Agent.get() → Load agent config and prompt
    ├─► resolveTools() → Build tool set from registry + MCP
    ├─► insertReminders() → Plan mode prompts
    │
    ▼
┌─────────────────────────────────────────┐
│          SessionProcessor.process()      │
│  /packages/core/src/session/processor.ts │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│              LLM.stream()                │
│    /packages/core/src/session/llm.ts     │
└─────────────────────────────────────────┘
    │
    ├─► SystemPrompt.provider() → Model-specific base prompt
    ├─► SystemPrompt.environment() → Runtime context
    ├─► InstructionPrompt.system() → AGENTS.md, CLAUDE.md
    ├─► Plugin.trigger() → Plugin transformations
    ├─► ProviderTransform.message() → Format for provider
    │
    ▼
┌─────────────────────────────────────────┐
│           AI SDK streamText()            │
│     + wrapLanguageModel middleware       │
└─────────────────────────────────────────┘
    │
    ▼
Provider SDK (Anthropic, OpenAI, Google, etc.)
```

---

## System Prompts

### File Locations

| Provider | Prompt File |
|----------|-------------|
| Claude (Anthropic) | `packages/core/src/session/prompt/anthropic.txt` |
| Gemini (Google) | `packages/core/src/session/prompt/gemini.txt` |
| GPT (OpenAI) | `packages/core/src/session/prompt/beast.txt` |
| Codex (OpenAI) | `packages/core/src/session/prompt/codex_header.txt` |
| Fallback | `packages/core/src/session/prompt/qwen.txt` |
| Roblox Context | `packages/core/src/session/prompt/roblox.txt` |

### Selection Logic

Located in `packages/core/src/session/system.ts`:

```typescript
export function provider(model: Provider.Model) {
  if (model.api.id.includes("gpt-5")) return [PROMPT_CODEX]
  if (model.api.id.includes("gpt-") || model.api.id.includes("o1") || model.api.id.includes("o3"))
    return [PROMPT_BEAST]
  if (model.api.id.includes("gemini-")) return [PROMPT_GEMINI]
  if (model.api.id.includes("claude")) return [PROMPT_ANTHROPIC]
  return [PROMPT_ANTHROPIC_WITHOUT_TODO]
}
```

### Environment Injection

Runtime context is added via `SystemPrompt.environment()`:

```typescript
export async function environment(model: Provider.Model) {
  return [
    [
      `You are powered by the model named ${model.api.id}.`,
      `<env>`,
      `  Working directory: ${Instance.directory}`,
      `  Is directory a git repo: ${project.vcs === "git" ? "yes" : "no"}`,
      `  Platform: ${process.platform}`,
      `  Today's date: ${new Date().toDateString()}`,
      `</env>`,
    ].join("\n"),
    PROMPT_ROBLOX.trim(), // Roblox-specific context
  ]
}
```

---

## User Prompt Handling

### Entry Point

`packages/core/src/session/prompt.ts` - `SessionPrompt.prompt()`

### Input Schema

```typescript
export const PromptInput = z.object({
  sessionID: Identifier.schema("session"),
  messageID: Identifier.schema("message").optional(),
  model: z.object({
    providerID: z.string(),
    modelID: z.string(),
  }).optional(),
  agent: z.string().optional(),
  noReply: z.boolean().optional(),
  tools: z.record(z.string(), z.boolean()).optional(),
  system: z.string().optional(),
  parts: z.array(
    z.discriminatedUnion("type", [
      MessageV2.TextPart,
      MessageV2.FilePart,
      MessageV2.AgentPart,
      MessageV2.SubtaskPart,
    ])
  ),
})
```

### Part Processing (`createUserMessage`)

| Part Type | Processing |
|-----------|------------|
| `TextPart` | Preserved as-is |
| `FilePart` | Read from disk, converted to tool call output |
| `DirectoryPart` | Uses List tool to enumerate contents |
| `AgentPart` (`@agent`) | Triggers Task tool invocation |
| `MCP Resource` | Fetched from MCP server and included |

---

## Context Injection

### Instruction Sources

Located in `packages/core/src/session/instruction.ts`:

1. **Project-level files** (checked in order):
   - `AGENTS.md`
   - `CLAUDE.md`
   - `CONTEXT.md` (deprecated)

2. **Global user files**:
   - `~/.stud/AGENTS.md`
   - `~/.claude/CLAUDE.md` (Claude Code compatibility)
   - Custom config directory `AGENTS.md`

3. **Config-defined instructions** (`stud.jsonc`):
   ```json
   {
     "instructions": [
       "https://example.com/instructions.md",
       "~/custom-instructions.md",
       "./local-instructions.md"
     ]
   }
   ```

4. **Per-directory instructions**:
   - AGENTS.md files found walking up from edited files

### Instruction Format

Instructions are wrapped in XML tags:

```xml
<instructions source="AGENTS.md">
  Content of the instruction file...
</instructions>
```

---

## Tool/Function Definitions

### Tool Registry

Located in `packages/core/src/tool/registry.ts`:

```typescript
const BUILTIN_TOOLS = [
  InvalidTool,
  QuestionTool,
  BashTool,
  ReadTool,
  GlobTool,
  GrepTool,
  EditTool,
  WriteTool,
  TaskTool,
  WebFetchTool,
  TodoWriteTool,
  TodoReadTool,
  WebSearchTool,
  CodeSearchTool,
  SkillTool,
  ApplyPatchTool,
  // Roblox-specific
  RobloxGetScriptTool,
  RobloxSetScriptTool,
  RobloxInstanceGetTool,
  // ... etc
]
```

### Tool Definition Structure

```typescript
export interface Info {
  id: string
  init: (ctx?: { agent?: Agent.Info }) => Promise<{
    parameters: z.ZodObject<any>
    description: string
    execute: (args: any, ctx: Context) => Promise<ToolResult>
  }>
}
```

### Tool Resolution Flow

1. Get agent configuration
2. Filter tools based on agent permissions
3. Load MCP tools dynamically
4. Transform tool schemas per-provider via `ProviderTransform.schema()`

---

## Message Formatting

### Message Part Types

Located in `packages/core/src/session/message-v2.ts`:

| Part Type | Purpose |
|-----------|---------|
| `TextPart` | User/assistant text content |
| `ReasoningPart` | Model thinking/reasoning (Claude extended thinking) |
| `FilePart` | Attached files (images, PDFs, etc.) |
| `ToolPart` | Tool calls with states: pending, running, completed, error |
| `AgentPart` | Agent invocations |
| `SubtaskPart` | Subtask delegations |
| `CompactionPart` | Context compaction markers |
| `StepStartPart` / `StepFinishPart` | Agentic step boundaries |
| `SnapshotPart` / `PatchPart` | File system snapshots for undo |

### Conversion to Model Messages

```typescript
export function toModelMessages(
  input: WithParts[],
  model: Provider.Model
): ModelMessage[] {
  const result: UIMessage[] = []

  for (const msg of input) {
    if (msg.info.role === "user") {
      // Convert text parts, file parts, compaction markers
    }
    if (msg.info.role === "assistant") {
      // Convert text, reasoning, tool calls with results
      // Handle different model format requirements
    }
  }

  return convertToModelMessages(result, { tools })
}
```

---

## Provider Abstraction

### Supported Providers

Located in `packages/core/src/provider/provider.ts`:

```typescript
const BUNDLED_PROVIDERS = {
  "@ai-sdk/anthropic": createAnthropic,
  "@ai-sdk/openai": createOpenAI,
  "@ai-sdk/google": createGoogleGenerativeAI,
  "@ai-sdk/google-vertex": createVertex,
  "@ai-sdk/amazon-bedrock": createAmazonBedrock,
  "@ai-sdk/azure": createAzure,
  "@openrouter/ai-sdk-provider": createOpenRouter,
  "@ai-sdk/xai": createXai,
  "@ai-sdk/mistral": createMistral,
  "@ai-sdk/groq": createGroq,
  // ... many more
}
```

### Provider Transformations

Located in `packages/core/src/provider/transform.ts`:

| Transformation | Description |
|----------------|-------------|
| Message normalization | Anthropic empty content filtering, tool ID sanitization |
| Prompt caching | Cache control metadata for Anthropic/OpenRouter/Bedrock |
| Temperature defaults | Model-specific temperature/topP/topK |
| Reasoning variants | Extended thinking budget per model family |

---

## Token Management & Compaction

### Overflow Detection

Located in `packages/core/src/session/compaction.ts`:

```typescript
export async function isOverflow(input: {
  tokens: MessageV2.Assistant["tokens"]
  model: Provider.Model
}) {
  const context = input.model.limit.context
  const count = input.tokens.input + input.tokens.cache.read + input.tokens.output
  const output = Math.min(input.model.limit.output, OUTPUT_TOKEN_MAX)
  const usable = input.model.limit.input || context - output
  return count > usable
}
```

### Pruning Strategy

1. Protect last 40,000 tokens of tool calls
2. Clear output of older tool calls beyond threshold
3. Minimum prune size: 20,000 tokens
4. Protected tools: `["skill"]`

### Compaction Process

1. Detect context overflow
2. Prune old tool call outputs
3. If still overflowing, generate summary via "compaction" agent
4. Replace old messages with CompactionPart containing summary

### Output Token Limits

```typescript
export const OUTPUT_TOKEN_MAX =
  Flag.OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX || 32_000
```

---

## Memory & History

### Session Storage

Located in `packages/core/src/session/index.ts`:

```typescript
export const Info = z.object({
  id: Identifier.schema("session"),
  slug: z.string(),
  projectID: z.string(),
  directory: z.string(),
  parentID: Identifier.schema("session").optional(), // Child sessions
  title: z.string(),
  version: z.string(),
  time: z.object({
    created: z.number(),
    updated: z.number(),
    compacting: z.number().optional(),
    archived: z.number().optional(),
  }),
  permission: PermissionNext.Ruleset.optional(),
  revert: z.object({...}).optional(), // Undo tracking
})
```

### Message Streaming

Messages are loaded lazily and filtered at compaction boundaries:

```typescript
export async function* stream(sessionID) {
  const list = await Storage.list(["message", sessionID])
  for (let i = list.length - 1; i >= 0; i--) {
    yield await get({ sessionID, messageID: list[i][2] })
  }
}

export async function filterCompacted(stream) {
  // Stops at compaction boundary to avoid loading pre-compaction history
}
```

---

## Improvement Opportunities

### 1. Prompt Duplication

**Current Issue**: Provider-specific prompts (`anthropic.txt`, `gemini.txt`, `beast.txt`) share ~70% identical content but are maintained separately.

**Improvement**: Create a base prompt template with provider-specific overrides:
```typescript
// Proposed structure
const basePrompt = loadPrompt("base.txt")
const providerOverrides = {
  anthropic: { todoSection: true, xmlTags: true },
  openai: { todoSection: false, jsonPreferred: true },
}
const finalPrompt = mergePrompt(basePrompt, providerOverrides[provider])
```

### 2. Static System Prompt

**Current Issue**: The system prompt is entirely static and doesn't adapt to the current task context.

**Improvement**: Dynamic prompt sections based on task type:
```typescript
// Example: Trim irrelevant sections for pure chat vs coding
if (taskType === "chat") {
  exclude(["tool_usage_policy", "code_references", "commit_guidelines"])
}
```

### 3. Context Window Waste

**Current Issue**: Full tool descriptions are always included even when tools won't be used.

**Improvement**:
- Lazy tool loading based on conversation context
- Compress tool descriptions for less-used tools
- Use tool categories with on-demand expansion

### 4. Compaction Quality

**Current Issue**: Compaction uses a generic prompt that may lose important context.

**Improvement**:
- Task-aware compaction that preserves relevant information
- Structured summaries with explicit sections (files modified, decisions made, etc.)
- Allow user-defined compaction priorities

### 5. Instruction File Chaos

**Current Issue**: Multiple instruction sources (`AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, config instructions) with unclear precedence.

**Improvement**:
- Consolidate to single `STUD.md` or similar
- Clear documentation on precedence
- Validation for conflicting instructions

### 6. Missing Prompt Versioning

**Current Issue**: No versioning or A/B testing for prompt changes.

**Improvement**:
```typescript
// Proposed: Versioned prompts with metrics
const prompts = {
  "v1.0": { content: "...", metrics: { successRate: 0.85 } },
  "v1.1": { content: "...", metrics: { successRate: 0.89 } },
}
```

### 7. Roblox-Specific Context Overload

**Current Issue**: `roblox.txt` is always injected for Stud, even when not working with Roblox files.

**Improvement**: Conditional injection based on project detection:
```typescript
if (project.hasRoblox || recentFiles.some(f => f.endsWith(".lua"))) {
  systemPrompt.push(PROMPT_ROBLOX)
}
```

### 8. Tool Permission Complexity

**Current Issue**: Permission system is complex with multiple layers (agent, session, global).

**Improvement**:
- Simplified permission model with clear inheritance
- Visual permission debugger in UI
- Permission presets for common use cases

### 9. No Prompt Debugging

**Current Issue**: Hard to debug what prompt was actually sent to the model.

**Improvement**:
- Prompt inspector in dev tools
- Token count breakdown by section
- Diff view for prompt changes

### 10. Provider Transform Coupling

**Current Issue**: `ProviderTransform` has provider-specific logic scattered throughout.

**Improvement**: Extract to provider-specific transform classes:
```typescript
class AnthropicTransform extends BaseTransform {
  sanitizeToolId(id: string) { /* ... */ }
  addCacheControl(messages: Message[]) { /* ... */ }
}
```

---

## Configuration Reference

### Key Config Options (`stud.jsonc`)

```jsonc
{
  // Default model
  "model": "anthropic/claude-sonnet-4",

  // Agent configurations
  "agent": {
    "custom-agent": {
      "model": "openai/gpt-4",
      "prompt": "You are a specialized assistant for..."
    }
  },

  // Tool permissions
  "permission": {
    "allow": ["Read", "Glob", "Grep"],
    "deny": ["Bash"]
  },

  // MCP servers
  "mcp": {
    "my-server": {
      "command": "node",
      "args": ["./mcp-server.js"]
    }
  },

  // Additional instruction files
  "instructions": [
    "./custom-instructions.md",
    "https://example.com/team-guidelines.md"
  ],

  // Compaction settings
  "compaction": {
    "auto": true,
    "pruneThreshold": 40000
  }
}
```

---

## File Summary

| Component | Primary Files |
|-----------|---------------|
| System Prompts | `packages/core/src/session/system.ts`, `packages/core/src/session/prompt/*.txt` |
| User Prompt Handling | `packages/core/src/session/prompt.ts` |
| Context Injection | `packages/core/src/session/instruction.ts` |
| Tool Definitions | `packages/core/src/tool/registry.ts`, `packages/core/src/tool/*.ts` |
| Message Formatting | `packages/core/src/session/message-v2.ts` |
| Provider Abstraction | `packages/core/src/provider/provider.ts`, `packages/core/src/provider/transform.ts` |
| Token Management | `packages/core/src/session/compaction.ts` |
| Memory/History | `packages/core/src/session/index.ts`, `packages/core/src/session/processor.ts` |
| Configuration | `packages/core/src/config/config.ts` |

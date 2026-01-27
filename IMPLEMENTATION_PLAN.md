# Stud - Implementation Plan

> AI-Powered Roblox Studio Development Tool

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Phase 1: Native Roblox Tools](#phase-1-native-roblox-tools)
4. [Phase 2: Roblox Cloud API Tools](#phase-2-roblox-cloud-api-tools)
5. [Phase 3: System Prompt & Luau Knowledge](#phase-3-system-prompt--luau-knowledge)
6. [Phase 4: UI Customization](#phase-4-ui-customization)
7. [Phase 5: Rebranding](#phase-5-rebranding)
8. [Quick Start](#quick-start)

---

## Overview

**Stud** is a fork of opencode with **native** Roblox Studio tools built directly into the CLI—no external MCP server process needed.

### Two Modes of Operation

| Mode            | Use Case                                   | Plugin Required?                        |
| --------------- | ------------------------------------------ | --------------------------------------- |
| **File-Based**  | Edit scripts via Rojo project              | No - uses existing `read`/`write` tools |
| **Live Studio** | Manipulate instances, properties, run code | Yes - HTTP plugin                       |

### Project Structure

```
stud/
├── packages/
│   ├── desktop/                      # Tauri desktop app
│   ├── app/                          # SolidJS UI
│   ├── ui/                           # Shared components
│   ├── core/                         # AI engine
│   │   └── src/
│   │       ├── tool/
│   │       │   ├── roblox/           # Native Roblox tools
│   │       │   │   ├── client.ts     # HTTP client for Studio plugin
│   │       │   │   ├── script.ts     # Script read/write/edit tools
│   │       │   │   ├── instance.ts   # Instance manipulation tools
│   │       │   │   ├── property.ts   # Property get/set tools
│   │       │   │   ├── cloud.ts      # Open Cloud API tools
│   │       │   │   └── index.ts      # Export all tools
│   │       │   └── registry.ts       # Register Roblox tools
│   │       └── session/
│   │           └── prompt/
│   │               └── roblox.txt    # Roblox-specific instructions
│   ├── util/
│   ├── plugin/
│   └── sdk/
└── studio-plugin/                    # Luau plugin for Roblox Studio
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         STUD DESKTOP                            │
├─────────────────────────────────────────────────────────────────┤
│  Existing Tools          │  New Roblox Tools                   │
│  ├── read               │  ├── roblox_get_script    ─┐        │
│  ├── write              │  ├── roblox_set_script     │        │
│  ├── edit               │  ├── roblox_get_children   ├► HTTP  │
│  ├── bash               │  ├── roblox_set_property   │ :3002  │
│  ├── grep               │  ├── roblox_create         │        │
│  └── ...                │  └── roblox_run_code      ─┘        │
├─────────────────────────────────────────────────────────────────┤
│  Cloud API Tools (direct HTTPS to apis.roblox.com)             │
│  ├── roblox_datastore_get                                      │
│  ├── roblox_datastore_set                                      │
│  ├── roblox_publish_place                                      │
│  └── roblox_universe_info                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
            HTTP localhost:3002 (only for live Studio tools)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Roblox Studio Plugin (Luau)                        │
│  • Handles: script access, instance manipulation, code exec    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Native Roblox Tools

### 1.1 HTTP Client

Create `packages/core/src/tool/roblox/client.ts`:

```typescript
import { Log } from "../../util/log"

const log = Log.create({ service: "roblox-client" })
const STUDIO_URL = "http://localhost:3002"
const TIMEOUT_MS = 10000

export async function studioRequest<T>(endpoint: string, data: object): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${STUDIO_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Studio error ${response.status}: ${text}`)
    }
    return response.json()
  } finally {
    clearTimeout(timeout)
  }
}

export async function isStudioConnected(): Promise<boolean> {
  try {
    const response = await fetch(`${STUDIO_URL}/api/ping`, {
      method: "GET",
      signal: AbortSignal.timeout(1000),
    })
    return response.ok
  } catch {
    return false
  }
}
```

### 1.2 Script Tools

- `roblox_get_script` - Read script source code
- `roblox_set_script` - Replace entire script
- `roblox_edit_lines` - Edit specific lines

### 1.3 Instance Tools

- `roblox_get_children` - List children of an instance
- `roblox_get_properties` - Get all properties
- `roblox_set_property` - Set a property value
- `roblox_create` - Create new instance
- `roblox_delete` - Delete instance
- `roblox_clone` - Clone instance
- `roblox_search` - Search instances
- `roblox_get_selection` - Get selected objects
- `roblox_run_code` - Execute Luau code

---

## Phase 2: Roblox Cloud API Tools

Cloud API tools connect directly to `apis.roblox.com`:

- `roblox_universe_info` - Get experience info
- `roblox_datastore_list` - List DataStores
- `roblox_datastore_get` - Read DataStore entry
- `roblox_datastore_set` - Write DataStore entry
- `roblox_publish_place` - Publish place version

Requires `ROBLOX_API_KEY` environment variable.

---

## Phase 3: System Prompt & Luau Knowledge

### Luau Language Guidelines

Luau is NOT standard Lua. Key differences:

- Type annotations: `local x: number = 5`
- Type inference with strict mode: `--!strict`
- Generics: `function foo<T>(x: T): T`
- Union types: `type Result = Success | Failure`
- No `continue` keyword (use `if` guards instead)
- Tables are 1-indexed
- Use `task.wait()` not `wait()` (deprecated)
- Use `task.spawn()` not `spawn()` (deprecated)
- Use `game:GetService("ServiceName")` for services

### Common Services

| Service               | Purpose               |
| --------------------- | --------------------- |
| `Players`             | Player management     |
| `ReplicatedStorage`   | Shared assets/modules |
| `ServerStorage`       | Server-only assets    |
| `ServerScriptService` | Server scripts        |
| `Workspace`           | 3D world, physics     |
| `DataStoreService`    | Persistent data       |
| `HttpService`         | HTTP requests, JSON   |
| `TweenService`        | Animations            |
| `RunService`          | Frame updates         |
| `UserInputService`    | Player input (client) |

### Script Types

- `Script` (.server.luau): Runs on server only
- `LocalScript` (.client.luau): Runs on client only
- `ModuleScript` (.luau): Shared code, must return a value

---

## Phase 4: UI Customization

### Stud Theme

Light theme with pink/blue accents inspired by Paragon:

- Primary accent: `#e91e63` (pink)
- Secondary accent: `#00a2ff` (blue)
- Success: `#4caf50` (green)
- Background: `#f5f5f5` (light gray)

### Components

- ASCII logo with progress bar
- Studio connection status indicator
- Command hints with `/command` syntax

---

## Phase 5: Rebranding

### Completed

- [x] Package names: `@stud/*`
- [x] Config: `stud.json`
- [x] Tauri app: "Stud"
- [x] Removed CLI (desktop-only)

### Remaining

- [ ] Environment variables: `STUD_*`
- [ ] Update all string references

---

## Quick Start

### For Users

```bash
# Install Stud desktop app
# Download from releases

# Install Studio plugin
# Copy studio-plugin to Roblox Plugins folder

# Open Studio, enable the plugin, then launch Stud
```

### For Development

```bash
# Install dependencies
bun install

# Run desktop app
bun run dev

# Typecheck
bun run typecheck
```

### Environment Variables

```bash
# For Cloud API tools (optional)
export ROBLOX_API_KEY="your-key-from-creator-hub"
export ROBLOX_UNIVERSE_ID="123456789"
```

---

## Tool Reference

### Studio Tools (require plugin)

| Tool                    | Description                   |
| ----------------------- | ----------------------------- |
| `roblox_get_script`     | Read script source            |
| `roblox_set_script`     | Replace script source         |
| `roblox_edit_lines`     | Edit specific lines           |
| `roblox_get_children`   | List instance children        |
| `roblox_get_properties` | Get instance properties       |
| `roblox_set_property`   | Set a property                |
| `roblox_create`         | Create new instance           |
| `roblox_delete`         | Delete instance               |
| `roblox_clone`          | Clone instance                |
| `roblox_search`         | Search by name/class/property |
| `roblox_get_selection`  | Get selected objects          |
| `roblox_run_code`       | Execute Luau code             |

### Cloud Tools (require API key)

| Tool                    | Description           |
| ----------------------- | --------------------- |
| `roblox_universe_info`  | Get experience info   |
| `roblox_datastore_list` | List DataStores       |
| `roblox_datastore_get`  | Read DataStore entry  |
| `roblox_datastore_set`  | Write DataStore entry |
| `roblox_publish_place`  | Publish place version |

---

## Implementation Checklist

### Phase 1: Native Tools

- [x] `tool/roblox/client.ts` - HTTP client via bridge server
- [x] `tool/roblox/script.ts` - Script tools (get, set, edit)
- [x] `tool/roblox/instance.ts` - Instance tools (children, properties, create, delete, clone, search, selection, run code)
- [x] `tool/roblox/bridge.ts` - Bridge server for Studio plugin communication
- [x] Update `tool/registry.ts` - Register all 12 Roblox tools
- [x] `studio-plugin/Stud.server.lua` - Roblox Studio plugin
- [ ] Test with Studio plugin

### Phase 2: Cloud API

- [x] `tool/roblox/cloud.ts` - Cloud API tools
- [ ] Rate limiting & error handling

### Phase 3: Knowledge

- [x] `session/prompt/roblox.txt` - Luau knowledge
- [ ] Update system prompt to include roblox.txt

### Phase 4: UI

- [x] Stud theme
- [ ] Studio connection indicator

### Phase 5: Rebrand

- [x] Environment variables (STUD*\* aliases with OPENCODE*\* fallback)
- [ ] Documentation

---

_Last updated: January 27, 2026_

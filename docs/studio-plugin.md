# `studio-plugin/` — Roblox Studio Plugin

The studio plugin is a Luau script that runs inside Roblox Studio, enabling live communication between Stud and the Studio editor.

## Overview

- **Language**: Luau
- **File**: `Stud.server.lua` (34 KB)
- **Communication**: HTTP polling against the Stud local bridge server

## How It Works

```
┌──────────────────────┐      HTTP       ┌──────────────────────┐
│  Roblox Studio       │ ◄──────────────► │  Stud Bridge Server  │
│  (Stud.server.lua)   │  poll/respond   │  (localhost:3001)    │
└──────────────────────┘                 └──────────────────────┘
```

1. The Stud desktop app runs a local HTTP bridge server on `localhost:3001`
2. The Studio plugin polls `GET /stud/poll` every ~200ms for pending requests
3. When a request is received, the plugin executes it inside Studio
4. Results are sent back via `POST /stud/respond`

## Installation

1. Copy `Stud.server.lua` to your Roblox Plugins folder:
   - **macOS**: `~/Documents/Roblox/Plugins/Stud.server.lua`
   - **Windows**: `%LOCALAPPDATA%\Roblox\Plugins\Stud.server.lua`
2. Restart Roblox Studio
3. Enable **HTTP Requests** in Game Settings → Security

> **Tip**: The `start.sh` script auto-installs the plugin for you.

## Available Operations

### Script Operations

| Endpoint | Description |
|----------|-------------|
| `/script/get` | Read the source code of a script |
| `/script/set` | Replace the entire source of a script |
| `/script/edit` | Find and replace text within a script |

### Instance Operations

| Endpoint | Description |
|----------|-------------|
| `/instance/children` | List children of an instance |
| `/instance/properties` | Get all properties of an instance |
| `/instance/set` | Set a property value on an instance |
| `/instance/create` | Create a new instance |
| `/instance/delete` | Delete an instance |
| `/instance/clone` | Clone an instance |
| `/instance/search` | Search instances by name or class |

### Selection & Execution

| Endpoint | Description |
|----------|-------------|
| `/selection/get` | Get the currently selected objects in Studio |
| `/code/run` | Execute arbitrary Luau code inside Studio |
| `/ping` | Health check — verifies plugin is running |

## Toolbar

The plugin adds a **"Stud"** button to the Studio toolbar. Click it to toggle the connection on/off.

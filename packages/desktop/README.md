# Stud Desktop

Native Stud desktop app for Roblox development, built with Tauri v2.

## Features

- **Roblox Studio Integration** - Connect to Roblox Studio via the Stud plugin for live game manipulation
- **Instance Explorer** - Browse and select instances from your game hierarchy with @ mentions
- **Script Editing** - Read and modify scripts directly in Studio
- **Toolbox Integration** - Search and insert assets from the Roblox toolbox
- **Rojo Support** - Works with Rojo projects for file-based workflows

## Prerequisites

Running the desktop app requires:

1. **Tauri dependencies** - Rust toolchain and platform-specific libraries. See the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)
2. **Roblox Studio** - For Studio integration features
3. **Stud Plugin** - Install the plugin in Studio (see `studio-plugin/` directory)

## Development

From the repo root:

```bash
bun install
bun run --cwd packages/desktop tauri dev
```

This starts the Vite dev server on http://localhost:1420 and opens the native window.

If you only want the web dev server (no native shell):

```bash
bun run --cwd packages/desktop dev
```

## Build

To create a production `dist/` and build the native app bundle:

```bash
bun run --cwd packages/desktop tauri build
```

## Studio Plugin

The Stud plugin (`studio-plugin/Stud.server.lua`) enables communication between the desktop app and Roblox Studio. It provides:

- Instance tree browsing
- Selection sync
- Script read/write
- Property manipulation
- Code execution

To install, copy `Stud.server.lua` to your Studio plugins folder or use the Rojo sync.

## Troubleshooting

### App shows white screen on restart
The app includes automatic recovery - if restart fails, it will fall back to a page reload.

### Studio not connecting
1. Ensure the Stud plugin is installed and enabled in Studio
2. Check that port 3001 is available (used by the bridge server)
3. Look for connection status in the app's Explorer panel

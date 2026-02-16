# `packages/desktop` — Tauri Native Shell

The desktop package wraps the SolidJS app in a native [Tauri v2](https://v2.tauri.app/) shell, providing cross-platform desktop distribution with native OS integration.

## Overview

- **Package name**: `@stud/desktop`
- **Framework**: Tauri v2 (Rust backend + WebView frontend)
- **Platforms**: macOS, Windows, Linux
- **Sidecar**: The core engine is bundled as a sidecar binary

## Directory Structure

```
packages/desktop/
├── src/                   # Frontend entry (TypeScript)
│   ├── index.tsx          # App bootstrap — server gate, platform config
│   ├── cli.ts             # CLI launcher helper
│   ├── menu.ts            # Native application menu (File, Edit, View, etc.)
│   ├── updater.ts         # Auto-update configuration
│   ├── webview-zoom.ts    # WebView zoom controls (Ctrl+/-)
│   └── styles.css         # Desktop-specific styles
├── src-tauri/             # Tauri backend (Rust)
│   ├── tauri.conf.json    # Tauri configuration
│   ├── src/               # Rust source code
│   │   ├── main.rs        # Main entry point
│   │   └── lib.rs         # Core library — server management, sidecar, markdown
│   ├── icons/             # App icons (all sizes, all platforms)
│   ├── entitlements.plist  # macOS sandbox entitlements
│   └── Cargo.toml         # Rust dependencies
└── package.json
```

## Architecture

```
┌─────────────────────────────────────────┐
│  Tauri Shell (Rust)                     │
│  ┌───────────────────────────────────┐  │
│  │  WebView                          │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  SolidJS App (@stud/app)    │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Sidecar: stud-core binary              │
│  (AI engine, local server, tools)       │
└─────────────────────────────────────────┘
```

## Key Features

### Server Gate

The desktop app uses a "server gate" pattern — it waits for the core sidecar to initialize before rendering the UI. If the server fails to start, it shows a helpful error with a restart button.

### Native Menu

A full native application menu with keyboard shortcuts:

- **File**: New Session, Open Project, Quit
- **Edit**: Undo, Redo, Cut, Copy, Paste, Select All
- **View**: Zoom In/Out, Reset Zoom, Fullscreen, Developer Tools

### Auto-Update

Built-in auto-updater via `@tauri-apps/plugin-updater`. Updates are downloaded and installed on restart (configurable per channel).

### Platform Integration

- Native file/directory picker dialogs
- Desktop notifications
- System tray integration
- macOS traffic light positioning
- WebView zoom controls

### Sidecar Management

The Rust backend manages the stud-core binary as a sidecar process:

1. Starts the core server on app launch
2. Monitors the process health
3. Provides `kill_sidecar`, `ensure_server_ready`, and server URL management via Tauri commands
4. Handles graceful shutdown and restart

## Configuration

Key settings in `tauri.conf.json`:

| Setting | Value |
|---------|-------|
| `productName` | Stud |
| `identifier` | app.stud.desktop |
| `titleBarStyle` | Overlay (transparent title bar) |
| `macOSPrivateApi` | true (for overlay title bar) |
| `externalBin` | `sidecars/stud-core` |
| `bundle.targets` | deb, rpm, dmg, nsis, app |

## Development

```bash
# Start desktop app in dev mode (from repo root)
bun run dev

# Build for production
bun run build
```

# Plan: Production-Ready start.sh with Modern TUI

## Overview

Rewrite `start.sh` to be a polished, user-friendly startup script with:

- Modern minimal TUI (box-drawing characters, spinners, no emojis)
- Interactive prerequisite installation with yes/no prompts
- CLI flags (`--help`, `--check`, `--build`, `--version`)
- Version info from git
- Graceful error handling

## Changes

### File: `start.sh` (complete rewrite)

**Current size:** 122 lines  
**New size:** ~400 lines

### Features

1. **CLI Flags**
   - `./start.sh` - Normal interactive start
   - `./start.sh --help` - Show usage
   - `./start.sh --version` - Show version info
   - `./start.sh --check` - Check prerequisites only, don't start
   - `./start.sh --build` - Build for production
   - `./start.sh --skip-plugin` - Skip Roblox plugin installation

2. **Prerequisites with Auto-Install**
   | Tool | Check Command | Auto-Install |
   |------|---------------|--------------|
   | Bun | `command -v bun` | `curl -fsSL https://bun.sh/install \| bash` |
   | Rust | `command -v cargo` | `curl https://sh.rustup.rs \| sh -s -- -y` |
   | macOS: Xcode CLI | `xcode-select -p` | `xcode-select --install` |
   | Linux: WebKit2GTK | `pkg-config --exists webkit2gtk-4.1` | `apt/dnf/pacman install` |

   Each missing tool prompts:

   ```
   Bun is required. Install it now?
   [Y/n] _
   ```

3. **Spinner for Long Operations**
   - Animated `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` spinner while waiting
   - Shows during: bun install, rust install, build

4. **Status Display**

   ```
   Prerequisites

     [OK]   Bun 1.3.5
     [OK]   Rust 1.75.0
     [OK]   Platform dependencies

   Setup

     [OK]   Dependencies installed
     [OK]   Plugin installed to ~/Documents/Roblox/Plugins
     [OK]   Core binary ready
   ```

5. **Improved Header**

   ```
     ███████╗████████╗██╗   ██╗██████╗
     ██╔════╝╚══██╔══╝██║   ██║██╔══██╗
     ███████╗   ██║   ██║   ██║██║  ██║
     ╚════██║   ██║   ██║   ██║██║  ██║
     ███████║   ██║   ╚██████╔╝██████╔╝
     ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝

     AI-Powered Roblox Development              v0.1.0
     commit: abc1234
   ```

6. **Error Handling**
   - Trap Ctrl+C gracefully
   - Clean up background processes on exit
   - Clear error messages with solutions

7. **Connection Instructions**
   - Shows after launch with clear steps for Roblox Studio

## Flow

```
start.sh
├── Parse CLI flags
├── Print header (logo + version)
├── Check prerequisites
│   ├── Bun → install if missing (with prompt)
│   ├── Rust → install if missing (with prompt)
│   └── Platform deps → install if missing (with prompt)
├── Run setup
│   ├── bun install (with spinner)
│   ├── Copy plugin to Roblox folder
│   └── Build core binary if needed
├── Show connection instructions
└── exec bun run dev
```

## Implementation

See the full script implementation below (will be applied when Plan Mode is exited):

```bash
#!/bin/bash

# Full implementation is ~400 lines
# Key sections:
# - Colors and formatting
# - Spinner animation
# - Prerequisite checks with auto-install
# - Setup functions (dependencies, plugin, core)
# - Launch with connection instructions
```

## Approval Required

When you're ready to implement this plan, exit Plan Mode and I'll create the new `start.sh`.

#!/bin/bash

# Stud Start Script
# One command to install, setup, and run Stud

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   ███████╗████████╗██╗   ██╗██████╗                          ║"
echo "║   ██╔════╝╚══██╔══╝██║   ██║██╔══██╗                         ║"
echo "║   ███████╗   ██║   ██║   ██║██║  ██║                         ║"
echo "║   ╚════██║   ██║   ██║   ██║██║  ██║                         ║"
echo "║   ███████║   ██║   ╚██████╔╝██████╔╝                         ║"
echo "║   ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝                          ║"
echo "║                                                               ║"
echo "║   AI-Powered Roblox Development Tool                         ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

success() { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${BLUE}→${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; exit 1; }

# Check and install Bun if needed
if command -v bun &> /dev/null; then
    success "Bun $(bun --version)"
else
    info "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    success "Bun installed"
fi

# Install dependencies if node_modules missing or package.json changed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    info "Installing dependencies..."
    bun install --silent
    success "Dependencies installed"
else
    success "Dependencies up to date"
fi

# Install Roblox Studio Plugin
PLUGIN_SOURCE="$SCRIPT_DIR/studio-plugin/Stud.server.lua"

if [[ "$OSTYPE" == "darwin"* ]]; then
    PLUGIN_DIR="$HOME/Documents/Roblox/Plugins"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    PLUGIN_DIR="$LOCALAPPDATA/Roblox/Plugins"
else
    PLUGIN_DIR="$HOME/.local/share/roblox/plugins"
fi

if [ -f "$PLUGIN_SOURCE" ]; then
    mkdir -p "$PLUGIN_DIR"
    # Only copy if plugin doesn't exist or source is newer
    if [ ! -f "$PLUGIN_DIR/Stud.server.lua" ] || [ "$PLUGIN_SOURCE" -nt "$PLUGIN_DIR/Stud.server.lua" ]; then
        cp "$PLUGIN_SOURCE" "$PLUGIN_DIR/"
        success "Plugin installed to $PLUGIN_DIR"
    else
        success "Plugin up to date"
    fi
else
    warn "Plugin source not found (studio-plugin/Stud.server.lua)"
fi

# Set Rust target for Tauri
if [[ "$OSTYPE" == "darwin"* ]]; then
    if [[ $(uname -m) == "arm64" ]]; then
        export RUST_TARGET="aarch64-apple-darwin"
    else
        export RUST_TARGET="x86_64-apple-darwin"
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    export RUST_TARGET="x86_64-pc-windows-msvc"
else
    if [[ $(uname -m) == "aarch64" ]]; then
        export RUST_TARGET="aarch64-unknown-linux-gnu"
    else
        export RUST_TARGET="x86_64-unknown-linux-gnu"
    fi
fi

# Build core if binary doesn't exist
CORE_BIN="$SCRIPT_DIR/packages/core/dist/stud-$RUST_TARGET"
if [ ! -f "$CORE_BIN" ]; then
    info "Building core..."
    cd "$SCRIPT_DIR/packages/core"
    bun run build 2>/dev/null || warn "Core build skipped (needs Rust)"
    cd "$SCRIPT_DIR"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
success "Starting Stud Desktop..."
echo ""
echo -e "${CYAN}Roblox Studio Connection:${NC}"
echo "  1. Open Roblox Studio"
echo "  2. Enable HTTP Requests (Game Settings → Security)"
echo "  3. Click 'Stud' button in toolbar"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# Run the desktop app
exec bun run dev

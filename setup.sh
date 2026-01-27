#!/bin/bash

# Stud Setup Script
# This script sets up the Stud development environment

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

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

success() { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${BLUE}→${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }

# Step 1: Check for Bun
echo ""
echo "Step 1: Checking dependencies..."
echo "────────────────────────────────"

if command -v bun &> /dev/null; then
    success "Bun is installed ($(bun --version))"
else
    info "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    success "Bun installed"
fi

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing project dependencies..."
echo "───────────────────────────────────────────"

cd "$SCRIPT_DIR"
bun install
success "Dependencies installed"

# Step 3: Install Roblox Studio Plugin
echo ""
echo "Step 3: Installing Roblox Studio Plugin..."
echo "───────────────────────────────────────────"

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
    cp "$PLUGIN_SOURCE" "$PLUGIN_DIR/"
    success "Plugin installed to $PLUGIN_DIR/Stud.server.lua"
else
    warn "Plugin source not found at $PLUGIN_SOURCE"
fi

# Step 4: Build the core
echo ""
echo "Step 4: Building Stud Core..."
echo "─────────────────────────────"

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

info "Target: $RUST_TARGET"
cd "$SCRIPT_DIR/packages/core"
bun run build 2>/dev/null || warn "Core build skipped (may need Rust toolchain)"
success "Build complete"

# Step 5: Environment setup
echo ""
echo "Step 5: Environment Variables (Optional)"
echo "─────────────────────────────────────────"

echo "For Roblox Cloud API features, set these environment variables:"
echo ""
echo "  export ROBLOX_API_KEY=\"your-api-key-from-creator-hub\""
echo "  export ROBLOX_UNIVERSE_ID=\"your-universe-id\""
echo ""
echo "Get your API key at: https://create.roblox.com/dashboard/credentials"

# Done!
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
success "Setup complete!"
echo ""
echo "To start Stud Desktop:"
echo "  cd $SCRIPT_DIR/packages/desktop"
echo "  RUST_TARGET=$RUST_TARGET bunx tauri dev"
echo ""
echo "Or use the quick start command:"
echo "  bun run dev"
echo ""
echo "Before using Stud with Roblox Studio:"
echo "  1. Open Roblox Studio"
echo "  2. Go to Game Settings → Security → Enable HTTP Requests"
echo "  3. Look for the 'Stud' button in the toolbar"
echo ""
echo "════════════════════════════════════════════════════════════════"

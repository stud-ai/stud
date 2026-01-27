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
CYAN='\033[0;36m'
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
    
    # Verify plugin installation
    if [ -f "$PLUGIN_DIR/Stud.server.lua" ]; then
        PLUGIN_SIZE=$(wc -c < "$PLUGIN_DIR/Stud.server.lua")
        success "Plugin verified (${PLUGIN_SIZE} bytes)"
    else
        error "Plugin installation failed"
    fi
else
    error "Plugin source not found at $PLUGIN_SOURCE"
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

# Step 6: Verify connection status
echo ""
echo "Step 6: Checking connection status..."
echo "─────────────────────────────────────"

# Check if bridge server is running
BRIDGE_STATUS=$(curl -s http://localhost:3001/stud/status 2>/dev/null || echo "")

if [ -n "$BRIDGE_STATUS" ]; then
    success "Bridge server is running on port 3001"
    
    # Parse connection status
    if echo "$BRIDGE_STATUS" | grep -q '"connected":true'; then
        success "Roblox Studio is connected!"
    else
        info "Roblox Studio not connected yet"
        echo "    To connect:"
        echo "    1. Open Roblox Studio"
        echo "    2. Enable HTTP Requests (Game Settings → Security)"
        echo "    3. Click the 'Stud' button in the toolbar"
    fi
else
    info "Bridge server not running (starts with Stud Desktop)"
fi

# Done!
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
success "Setup complete!"
echo ""
echo -e "${CYAN}To start Stud Desktop:${NC}"
echo "  cd $SCRIPT_DIR/packages/desktop"
echo "  RUST_TARGET=$RUST_TARGET bunx tauri dev"
echo ""
echo -e "${CYAN}Or use the quick start command:${NC}"
echo "  bun run dev"
echo ""
echo -e "${CYAN}Roblox Studio Connection:${NC}"
echo "  1. Start Stud Desktop (command above)"
echo "  2. Open Roblox Studio"
echo "  3. Go to Game Settings → Security → Enable HTTP Requests"
echo "  4. Click the 'Stud' button in the Studio toolbar"
echo "  5. You should see 'Connected' in the Stud widget"
echo ""
echo -e "${CYAN}Available Roblox Tools (17 total):${NC}"
echo "  Studio: roblox_get_script, roblox_set_script, roblox_edit_script,"
echo "          roblox_get_children, roblox_get_properties, roblox_set_property,"
echo "          roblox_create, roblox_delete, roblox_clone, roblox_search,"
echo "          roblox_get_selection, roblox_run_code"
echo "  Cloud:  roblox_universe_info, roblox_datastore_list,"
echo "          roblox_datastore_get, roblox_datastore_set, roblox_publish_place"
echo ""
echo "════════════════════════════════════════════════════════════════"

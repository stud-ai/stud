#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# Stud - AI-Powered Roblox Development Tool
# Start script with prerequisite checking and auto-installation
# ═══════════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ─────────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────────

VERSION="0.1.0"
MIN_BUN_VERSION="1.0.0"

# ─────────────────────────────────────────────────────────────────────────────────
# Colors and Formatting
# ─────────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

# ─────────────────────────────────────────────────────────────────────────────────
# Output Functions
# ─────────────────────────────────────────────────────────────────────────────────

print_header() {
    clear
    echo ""

    # Try to use oh-my-logo for a beautiful gradient logo
    if command -v bun &> /dev/null; then
        bunx --bun oh-my-logo "STUD" grad-blue --color 2>/dev/null || print_fallback_logo
    else
        print_fallback_logo
    fi

    echo ""
    echo -e "  ${DIM}AI-Powered Roblox Development${NC}              ${DIM}v${VERSION}${NC}"

    # Show git commit if available
    if [ -d ".git" ]; then
        local commit=$(git rev-parse --short HEAD 2>/dev/null || echo "")
        if [ -n "$commit" ]; then
            echo -e "  ${DIM}commit: ${commit}${NC}"
        fi
    fi
    echo ""
    echo -e "  ${DIM}────────────────────────────────────────────${NC}"
    echo ""
}

print_fallback_logo() {
    echo -e "${CYAN}"
    echo "  ███████╗████████╗██╗   ██╗██████╗ "
    echo "  ██╔════╝╚══██╔══╝██║   ██║██╔══██╗"
    echo "  ███████╗   ██║   ██║   ██║██║  ██║"
    echo "  ╚════██║   ██║   ██║   ██║██║  ██║"
    echo "  ███████║   ██║   ╚██████╔╝██████╔╝"
    echo "  ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ "
    echo -e "${NC}"
}

status_ok() {
    echo -e "  ${GREEN}[OK]${NC}   $1"
}

status_skip() {
    echo -e "  ${YELLOW}[SKIP]${NC} $1"
}

status_fail() {
    echo -e "  ${RED}[FAIL]${NC} $1"
}

status_wait() {
    echo -e "  ${BLUE}[..]${NC}   $1"
}

info() {
    echo -e "  ${BLUE}>${NC} $1"
}

warn() {
    echo -e "  ${YELLOW}!${NC} $1"
}

error() {
    echo -e "\n  ${RED}Error:${NC} $1\n"
    exit 1
}

section() {
    echo ""
    echo -e "  ${BOLD}$1${NC}"
    echo ""
}

# ─────────────────────────────────────────────────────────────────────────────────
# Spinner for long operations
# ─────────────────────────────────────────────────────────────────────────────────

spinner_pid=""

start_spinner() {
    local message="$1"
    (
        local frames='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
        local i=0
        while true; do
            printf "\r  ${BLUE}%s${NC}  %s" "${frames:$i:1}" "$message"
            i=$(( (i + 1) % ${#frames} ))
            sleep 0.1
        done
    ) &
    spinner_pid=$!
    disown
}

stop_spinner() {
    if [ -n "$spinner_pid" ]; then
        kill "$spinner_pid" 2>/dev/null || true
        wait "$spinner_pid" 2>/dev/null || true
        spinner_pid=""
        printf "\r\033[K"  # Clear line
    fi
}

# ─────────────────────────────────────────────────────────────────────────────────
# User Prompts
# ─────────────────────────────────────────────────────────────────────────────────

confirm() {
    local message="$1"
    local default="${2:-y}"
    
    if [ "$default" = "y" ]; then
        local prompt="[Y/n]"
    else
        local prompt="[y/N]"
    fi
    
    echo ""
    echo -e "  ${CYAN}$message${NC}"
    echo -n "  $prompt "
    read -r response
    
    if [ -z "$response" ]; then
        response="$default"
    fi
    
    case "$response" in
        [yY]|[yY][eE][sS]) return 0 ;;
        *) return 1 ;;
    esac
}

# ─────────────────────────────────────────────────────────────────────────────────
# Cleanup
# ─────────────────────────────────────────────────────────────────────────────────

cleanup() {
    stop_spinner
}

trap cleanup EXIT
trap 'echo -e "\n\n  ${DIM}Interrupted.${NC}"; exit 130' INT

# ─────────────────────────────────────────────────────────────────────────────────
# Help
# ─────────────────────────────────────────────────────────────────────────────────

show_help() {
    echo ""
    echo "  Stud - AI-Powered Roblox Development Tool"
    echo ""
    echo "  Usage: ./start.sh [options]"
    echo ""
    echo "  Options:"
    echo "    --help, -h      Show this help message"
    echo "    --version, -v   Show version information"
    echo "    --check         Check prerequisites only (don't start)"
    echo "    --build         Build for production"
    echo "    --skip-plugin   Skip Roblox plugin installation"
    echo ""
    exit 0
}

show_version() {
    echo "Stud v${VERSION}"
    if [ -d ".git" ]; then
        local commit=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
        echo "commit: $commit"
    fi
    exit 0
}

# ─────────────────────────────────────────────────────────────────────────────────
# Prerequisite Checks
# ─────────────────────────────────────────────────────────────────────────────────

check_bun() {
    if command -v bun &> /dev/null; then
        local bun_version=$(bun --version 2>/dev/null)
        status_ok "Bun ${bun_version}"
        return 0
    else
        status_fail "Bun not found"
        return 1
    fi
}

install_bun() {
    info "Installing Bun..."
    start_spinner "Downloading and installing Bun"
    curl -fsSL https://bun.sh/install | bash &>/dev/null
    stop_spinner
    
    # Add to PATH for this session
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    
    if command -v bun &> /dev/null; then
        status_ok "Bun $(bun --version) installed"
        return 0
    else
        status_fail "Failed to install Bun"
        return 1
    fi
}

check_rust() {
    if command -v cargo &> /dev/null; then
        local rust_version=$(rustc --version 2>/dev/null | cut -d' ' -f2)
        status_ok "Rust ${rust_version}"
        return 0
    else
        status_fail "Rust not found"
        return 1
    fi
}

install_rust() {
    info "Installing Rust..."
    start_spinner "Downloading and installing Rust"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y &>/dev/null
    stop_spinner
    
    # Add to PATH for this session
    source "$HOME/.cargo/env" 2>/dev/null || true
    
    if command -v cargo &> /dev/null; then
        status_ok "Rust $(rustc --version | cut -d' ' -f2) installed"
        return 0
    else
        status_fail "Failed to install Rust"
        return 1
    fi
}

check_platform_deps() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - check for Xcode CLI tools
        if xcode-select -p &> /dev/null; then
            status_ok "Xcode CLI tools"
            return 0
        else
            status_fail "Xcode CLI tools not found"
            return 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux - check for WebKit2GTK and other deps
        local missing=()
        
        if ! pkg-config --exists webkit2gtk-4.1 2>/dev/null; then
            missing+=("libwebkit2gtk-4.1-dev")
        fi
        if ! pkg-config --exists gtk+-3.0 2>/dev/null; then
            missing+=("libgtk-3-dev")
        fi
        
        if [ ${#missing[@]} -eq 0 ]; then
            status_ok "Linux build dependencies"
            return 0
        else
            status_fail "Missing: ${missing[*]}"
            return 1
        fi
    else
        # Windows or other - assume OK
        status_ok "Platform dependencies"
        return 0
    fi
}

install_platform_deps() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        info "Installing Xcode CLI tools..."
        xcode-select --install 2>/dev/null || true
        echo ""
        warn "A dialog may have appeared. Please complete the installation and run this script again."
        exit 0
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        info "Installing Linux build dependencies..."
        echo ""
        
        # Detect package manager
        if command -v apt-get &> /dev/null; then
            echo "  Running: sudo apt update && sudo apt install ..."
            echo ""
            sudo apt update
            sudo apt install -y libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
        elif command -v dnf &> /dev/null; then
            echo "  Running: sudo dnf install ..."
            echo ""
            sudo dnf install -y webkit2gtk4.1-devel gtk3-devel libappindicator-gtk3-devel librsvg2-devel
        elif command -v pacman &> /dev/null; then
            echo "  Running: sudo pacman -S ..."
            echo ""
            sudo pacman -S --noconfirm webkit2gtk-4.1 gtk3 libappindicator-gtk3 librsvg
        else
            error "Unsupported package manager. Please install WebKit2GTK 4.1 and GTK3 manually."
        fi
        
        status_ok "Linux dependencies installed"
        return 0
    fi
}

check_rojo() {
    # Ensure cargo bin is in PATH for rojo check
    if [ -d "$HOME/.cargo/bin" ]; then
        export PATH="$HOME/.cargo/bin:$PATH"
    fi

    if command -v rojo &> /dev/null; then
        local rojo_version=$(rojo --version 2>/dev/null | cut -d' ' -f2)
        status_ok "Rojo ${rojo_version}"
        return 0
    else
        status_fail "Rojo not found"
        return 1
    fi
}

install_rojo() {
    info "Installing Rojo..."

    # Ensure cargo bin is in PATH
    if [ -d "$HOME/.cargo/bin" ]; then
        export PATH="$HOME/.cargo/bin:$PATH"
    fi

    # Try aftman first (Roblox toolchain manager)
    if command -v aftman &> /dev/null; then
        start_spinner "Installing Rojo via Aftman"
        aftman add rojo-rbx/rojo@latest &>/dev/null || true
        stop_spinner
    # Try cargo if available
    elif command -v cargo &> /dev/null; then
        start_spinner "Installing Rojo via Cargo"
        cargo install rojo 2>&1 | tail -5 || true
        stop_spinner
        # Ensure cargo bin is in PATH after install
        export PATH="$HOME/.cargo/bin:$PATH"
    # Try downloading binary directly
    else
        start_spinner "Downloading Rojo binary"
        local os_type=""
        local arch=""
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            os_type="macos"
            if [[ $(uname -m) == "arm64" ]]; then
                arch="aarch64"
            else
                arch="x86_64"
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            os_type="linux"
            arch="x86_64"
        else
            stop_spinner
            status_fail "Please install Rojo manually: https://rojo.space/docs/installation/"
            return 1
        fi
        
        # Download latest release
        local download_url="https://github.com/rojo-rbx/rojo/releases/latest/download/rojo-${os_type}-${arch}.zip"
        local temp_dir=$(mktemp -d)
        
        if curl -fsSL "$download_url" -o "$temp_dir/rojo.zip" 2>/dev/null; then
            unzip -q "$temp_dir/rojo.zip" -d "$temp_dir"
            mkdir -p "$HOME/.local/bin"
            mv "$temp_dir/rojo" "$HOME/.local/bin/" 2>/dev/null || mv "$temp_dir/rojo-"* "$HOME/.local/bin/rojo"
            chmod +x "$HOME/.local/bin/rojo"
            export PATH="$HOME/.local/bin:$PATH"
            rm -rf "$temp_dir"
            stop_spinner
        else
            stop_spinner
            rm -rf "$temp_dir"
            status_fail "Failed to download Rojo"
            info "Install manually: https://rojo.space/docs/installation/"
            return 1
        fi
    fi
    
    if command -v rojo &> /dev/null; then
        status_ok "Rojo $(rojo --version | cut -d' ' -f2) installed"
        return 0
    else
        status_fail "Failed to install Rojo"
        info "Install manually: https://rojo.space/docs/installation/"
        return 1
    fi
}

run_prereq_checks() {
    section "Prerequisites"
    
    local all_ok=true
    
    # Check Bun
    if ! check_bun; then
        if confirm "Bun is required. Install it now?"; then
            install_bun || all_ok=false
        else
            all_ok=false
        fi
    fi
    
    # Check Rust
    if ! check_rust; then
        if confirm "Rust is required for the desktop app. Install it now?"; then
            install_rust || all_ok=false
        else
            all_ok=false
        fi
    fi
    
    # Check platform-specific deps
    if ! check_platform_deps; then
        if confirm "Platform dependencies are missing. Install them now?"; then
            install_platform_deps || all_ok=false
        else
            all_ok=false
        fi
    fi
    
    # Check Rojo
    if ! check_rojo; then
        if confirm "Rojo is recommended for syncing with Roblox Studio. Install it now?"; then
            install_rojo || true  # Don't fail if Rojo install fails, it's optional
        else
            status_skip "Rojo installation skipped (you can install later)"
        fi
    fi
    
    if [ "$all_ok" = false ]; then
        echo ""
        error "Some prerequisites are missing. Please install them and try again."
    fi
    
    return 0
}

# ─────────────────────────────────────────────────────────────────────────────────
# Setup Functions
# ─────────────────────────────────────────────────────────────────────────────────

install_dependencies() {
    # Check if node_modules needs update
    local needs_install=false

    if [ ! -d "node_modules" ]; then
        needs_install=true
    elif [ "package.json" -nt "node_modules" ]; then
        needs_install=true
    elif [ "bun.lock" -nt "node_modules" ]; then
        needs_install=true
    fi

    if [ "$needs_install" = true ]; then
        start_spinner "Installing dependencies"
        bun install --silent 2>/dev/null
        stop_spinner
        status_ok "Dependencies installed"
    else
        status_ok "Dependencies up to date"
    fi
}

check_source_changes() {
    # Check if any source files have changed since last build
    # This helps users know if they need to restart the app
    local last_build_marker="$SCRIPT_DIR/.last-dev-start"

    if [ ! -f "$last_build_marker" ]; then
        touch "$last_build_marker"
        return 0
    fi

    local changed_files=0

    # Check for changes in key directories
    for dir in "packages/core/src" "packages/ui/src" "packages/app/src" "studio-plugin"; do
        if [ -d "$SCRIPT_DIR/$dir" ]; then
            local newer_files=$(find "$SCRIPT_DIR/$dir" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.lua" -o -name "*.css" \) -newer "$last_build_marker" 2>/dev/null | wc -l | tr -d ' ')
            changed_files=$((changed_files + newer_files))
        fi
    done

    if [ "$changed_files" -gt 0 ]; then
        status_ok "Source changes detected ($changed_files files)"
        echo -e "         ${DIM}Hot reload will apply most changes automatically${NC}"
    fi

    # Update the marker
    touch "$last_build_marker"
}

install_plugin() {
    local plugin_source="$SCRIPT_DIR/studio-plugin/Stud.server.lua"
    local plugin_dir=""

    # Determine plugin directory
    if [[ "$OSTYPE" == "darwin"* ]]; then
        plugin_dir="$HOME/Documents/Roblox/Plugins"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
        plugin_dir="$LOCALAPPDATA/Roblox/Plugins"
    else
        plugin_dir="$HOME/.local/share/roblox/plugins"
    fi

    if [ ! -f "$plugin_source" ]; then
        status_skip "Plugin source not found"
        return 0
    fi

    mkdir -p "$plugin_dir"

    local installed_plugin="$plugin_dir/Stud.server.lua"

    # Check if plugin needs to be installed or updated
    if [ ! -f "$installed_plugin" ]; then
        cp "$plugin_source" "$plugin_dir/"
        status_ok "Plugin installed to $plugin_dir"
        echo -e "         ${DIM}Reload Studio to use the new plugin${NC}"
    elif [ "$plugin_source" -nt "$installed_plugin" ]; then
        # Plugin was updated - copy new version
        cp "$plugin_source" "$plugin_dir/"
        status_ok "Plugin updated (changes detected)"
        echo -e "         ${YELLOW}→ Reload the plugin in Studio to apply changes${NC}"
    else
        status_ok "Plugin up to date"
    fi
}

determine_rust_target() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [[ $(uname -m) == "arm64" ]]; then
            echo "aarch64-apple-darwin"
        else
            echo "x86_64-apple-darwin"
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
        echo "x86_64-pc-windows-msvc"
    else
        if [[ $(uname -m) == "aarch64" ]]; then
            echo "aarch64-unknown-linux-gnu"
        else
            echo "x86_64-unknown-linux-gnu"
        fi
    fi
}

build_core() {
    local rust_target=$(determine_rust_target)
    local core_bin="$SCRIPT_DIR/packages/core/dist/stud-$rust_target"
    
    if [ -f "$core_bin" ]; then
        status_ok "Core binary ready"
        return 0
    fi
    
    if [ ! -d "$SCRIPT_DIR/packages/core" ]; then
        status_skip "Core package not found"
        return 0
    fi
    
    start_spinner "Building core binary"
    cd "$SCRIPT_DIR/packages/core"
    if bun run build &>/dev/null; then
        stop_spinner
        status_ok "Core binary built"
    else
        stop_spinner
        status_skip "Core build skipped (optional)"
    fi
    cd "$SCRIPT_DIR"
}

run_setup() {
    section "Setup"

    install_dependencies

    if [ "$SKIP_PLUGIN" != "true" ]; then
        install_plugin
    else
        status_skip "Plugin installation skipped"
    fi

    check_source_changes

    build_core
}

# ─────────────────────────────────────────────────────────────────────────────────
# Launch
# ─────────────────────────────────────────────────────────────────────────────────

show_connection_instructions() {
    echo ""
    echo -e "  ${DIM}────────────────────────────────────────────${NC}"
    echo ""
    echo -e "  ${BOLD}Roblox Studio Setup${NC}"
    echo ""
    echo "  1. Open Roblox Studio"
    echo "  2. Go to Game Settings > Security and enable:"
    echo -e "     ${DIM}- Allow HTTP Requests${NC}"
    echo -e "     ${DIM}- Enable Studio Access to API Services${NC}"
    echo -e "     ${DIM}- Allow Third Party Sales${NC}"
    echo -e "     ${DIM}- Allow Loading Third Party Assets${NC}"
    echo "  3. Click the 'Stud' button in the Plugins toolbar"
    echo "  4. The plugin will connect automatically"
    echo ""
    echo -e "  ${DIM}────────────────────────────────────────────${NC}"
    echo ""
}

launch_app() {
    section "Launch"
    
    status_ok "Starting Stud Desktop..."
    
    show_connection_instructions
    
    # Set Rust target for Tauri
    export RUST_TARGET=$(determine_rust_target)
    
    # Run the app
    exec bun run dev
}

build_production() {
    section "Production Build"
    
    start_spinner "Building production binaries"
    bun run build
    stop_spinner
    
    status_ok "Production build complete"
    echo ""
    info "Binaries are in packages/desktop/src-tauri/target/release/"
}

# ─────────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────────

main() {
    local CHECK_ONLY=false
    local BUILD_PROD=false
    SKIP_PLUGIN=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                ;;
            --version|-v)
                show_version
                ;;
            --check)
                CHECK_ONLY=true
                shift
                ;;
            --build)
                BUILD_PROD=true
                shift
                ;;
            --skip-plugin)
                SKIP_PLUGIN=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                echo "Use --help for usage information."
                exit 1
                ;;
        esac
    done
    
    print_header
    run_prereq_checks
    
    if [ "$CHECK_ONLY" = true ]; then
        echo ""
        status_ok "All prerequisites satisfied!"
        echo ""
        exit 0
    fi
    
    run_setup
    
    if [ "$BUILD_PROD" = true ]; then
        build_production
    else
        launch_app
    fi
}

main "$@"

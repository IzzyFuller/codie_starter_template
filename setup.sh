#!/bin/bash

# ============================================================================
# DEPRECATED: Use 'node setup.mjs' instead.
#
# This bash script is kept as a fallback for bash-only environments.
# The Node.js version (setup.mjs) is cross-platform and has no jq dependency.
# ============================================================================

# Claude Code Starter Template Setup Script
# Installs skills, agents, hooks, memory seed, and cognitive-memory MCP server
# Version: 3.0 (deprecated — see setup.mjs v4.0)

echo ""
echo -e "\033[1;33m[DEPRECATED]\033[0m This script is deprecated. Use 'node setup.mjs' instead."
echo -e "\033[1;33m[DEPRECATED]\033[0m The Node.js version is cross-platform and doesn't require jq."
echo ""
read -p "Continue with bash version anyway? (y/n): " dep_confirm
[[ "$dep_confirm" =~ ^[Yy]$ ]] || { echo "Run: node setup.mjs"; exit 0; }
echo ""

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Globals
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
MCP_SERVER_DIR="$HOME/.local/share/claude-mcp-servers"
MEMORY_PATH=""
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

print_status()  { echo -e "${BLUE}[INFO]${NC} $1" >&2; }
print_success() { echo -e "${GREEN}[OK]${NC} $1" >&2; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1" >&2; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# Portable sed -i (macOS/BSD vs GNU)
sed_inplace() {
    case "$(uname)" in
        Darwin) sed -i '' "$1" "$2" ;;
        *)      sed -i "$1" "$2" ;;
    esac
}

# --- Step 1: Prerequisites ---
check_prerequisites() {
    print_status "Checking prerequisites..."
    local ok=true

    if ! command -v node &>/dev/null; then
        print_error "Node.js not found. Install Node.js 18+ from https://nodejs.org"
        ok=false
    else
        local node_ver
        node_ver=$(node -v | sed 's/v//' | cut -d. -f1)
        if [ "$node_ver" -lt 18 ]; then
            print_error "Node.js $node_ver found, but 18+ required"
            ok=false
        else
            print_success "Node.js $(node -v)"
        fi
    fi

    if ! command -v npm &>/dev/null; then
        print_error "npm not found"
        ok=false
    else
        print_success "npm $(npm -v)"
    fi

    if ! command -v git &>/dev/null; then
        print_error "git not found"
        ok=false
    else
        print_success "git $(git --version | awk '{print $3}')"
    fi

    if [ "$ok" = false ]; then
        print_error "Missing prerequisites. Install them and re-run."
        exit 1
    fi
    echo ""
}

# --- Step 2: Memory path ---
configure_memory_path() {
    local default_path="$HOME/claude-memory"
    print_status "Where should your memory knowledge base live?"
    read -p "Memory path [$default_path]: " user_path
    MEMORY_PATH="${user_path:-$default_path}"

    # Expand ~ if present
    MEMORY_PATH="${MEMORY_PATH/#\~/$HOME}"

    print_success "Memory path: $MEMORY_PATH"
    echo ""
}

# --- Step 3: Backup ---
backup_existing() {
    print_status "Backing up existing configuration..."
    local backed_up=false

    for dir in skills agents hooks; do
        if [ -d "$CLAUDE_DIR/$dir" ]; then
            cp -r "$CLAUDE_DIR/$dir" "$CLAUDE_DIR/${dir}_backup_${TIMESTAMP}"
            print_success "Backed up $dir/"
            backed_up=true
        fi
    done

    if [ -f "$CLAUDE_DIR/settings.json" ]; then
        cp "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/settings_backup_${TIMESTAMP}.json"
        print_success "Backed up settings.json"
        backed_up=true
    fi

    if [ -f "$HOME/.mcp.json" ]; then
        cp "$HOME/.mcp.json" "$HOME/.mcp_backup_${TIMESTAMP}.json"
        print_success "Backed up .mcp.json"
        backed_up=true
    fi

    if [ "$backed_up" = false ]; then
        print_status "No existing configuration found - clean install"
    fi
    echo ""
}

# --- Step 4: Install cognitive-memory MCP server ---
install_mcp_server() {
    print_status "Installing cognitive-memory MCP server..."
    local server_dir="$MCP_SERVER_DIR/cognitive-memory"

    mkdir -p "$MCP_SERVER_DIR"

    if [ -d "$server_dir" ]; then
        print_status "Updating existing cognitive-memory server..."
        git -C "$server_dir" pull --ff-only 2>/dev/null || true
    else
        git clone https://github.com/IzzyFuller/cognitive-memory-mcp.git "$server_dir"
    fi

    (cd "$server_dir" && npm install --production 2>&1 | tail -1)
    print_success "cognitive-memory MCP server installed"
    echo ""
}

# --- Step 5: Install skills ---
install_skills() {
    print_status "Installing skills..."
    local count=0

    for skill_dir in "$SCRIPT_DIR"/skills/*/; do
        [ -d "$skill_dir" ] || continue
        local skill_name
        skill_name=$(basename "$skill_dir")
        local target_dir="$CLAUDE_DIR/skills/$skill_name"

        mkdir -p "$target_dir"
        cp "$skill_dir/SKILL.md" "$target_dir/SKILL.md"

        # Substitute memory path placeholder
        sed_inplace "s|{{MEMORY_PATH}}|$MEMORY_PATH|g" "$target_dir/SKILL.md"

        count=$((count + 1))
    done

    print_success "Installed $count skills"
}

# --- Step 6: Install hooks ---
install_hooks() {
    print_status "Installing hooks..."
    local count=0

    mkdir -p "$CLAUDE_DIR/hooks"

    for hook_file in "$SCRIPT_DIR"/hooks/*.sh; do
        [ -f "$hook_file" ] || continue
        local hook_name
        hook_name=$(basename "$hook_file")
        cp "$hook_file" "$CLAUDE_DIR/hooks/$hook_name"
        chmod +x "$CLAUDE_DIR/hooks/$hook_name"
        count=$((count + 1))
    done

    print_success "Installed $count hooks"
}

# --- Step 7: Install agents ---
install_agents() {
    print_status "Installing agents..."
    local count=0

    mkdir -p "$CLAUDE_DIR/agents"

    for agent_file in "$SCRIPT_DIR"/agents/*.md; do
        [ -f "$agent_file" ] || continue
        local agent_name
        agent_name=$(basename "$agent_file")
        cp "$agent_file" "$CLAUDE_DIR/agents/$agent_name"

        # Substitute memory path placeholder
        sed_inplace "s|{{MEMORY_PATH}}|$MEMORY_PATH|g" "$CLAUDE_DIR/agents/$agent_name"

        count=$((count + 1))
    done

    print_success "Installed $count agents"
}

# --- Step 8: Merge settings ---
merge_settings() {
    print_status "Configuring settings..."
    local target="$CLAUDE_DIR/settings.json"

    if [ -f "$target" ]; then
        # Additive merge: add our hooks/permissions without clobbering existing
        if command -v jq &>/dev/null; then
            local merged
            merged=$(jq -s '.[0] * .[1]' "$target" "$SCRIPT_DIR/settings.json")
            echo "$merged" > "$target"
            print_success "Merged settings (existing config preserved)"
        else
            print_warning "jq not found - copying settings.json (backup saved)"
            cp "$SCRIPT_DIR/settings.json" "$target"
        fi
    else
        mkdir -p "$CLAUDE_DIR"
        cp "$SCRIPT_DIR/settings.json" "$target"
        print_success "Installed settings.json"
    fi
}

# --- Step 9: Copy memory seed ---
install_memory_seed() {
    print_status "Installing memory seed content..."

    if [ -d "$MEMORY_PATH" ] && [ "$(ls -A "$MEMORY_PATH" 2>/dev/null)" ]; then
        print_warning "Memory directory exists and is not empty: $MEMORY_PATH"
        read -p "Overwrite with starter content? (y/n): " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            print_status "Keeping existing memory content"
            return 0
        fi
    fi

    mkdir -p "$MEMORY_PATH"
    cp -r "$SCRIPT_DIR"/memory/* "$MEMORY_PATH/"

    # Substitute memory path in protocols
    for proto in "$MEMORY_PATH"/protocols/*.md; do
        [ -f "$proto" ] || continue
        sed_inplace "s|{{MEMORY_PATH}}|$MEMORY_PATH|g" "$proto"
    done

    local file_count
    file_count=$(find "$MEMORY_PATH" -type f | wc -l | tr -d ' ')
    print_success "Installed $file_count memory files to $MEMORY_PATH"
}

# --- Step 10: Configure MCP ---
configure_mcp() {
    print_status "Configuring MCP servers..."
    local mcp_file="$HOME/.mcp.json"
    local server_path="$MCP_SERVER_DIR/cognitive-memory/src/cognitive-server.js"

    if [ -f "$mcp_file" ] && command -v jq &>/dev/null; then
        # Additive merge
        local new_entry
        new_entry=$(jq -n \
            --arg path "$server_path" \
            --arg mem "$MEMORY_PATH" \
            '{mcpServers: {"cognitive-memory": {command: "node", args: [$path], env: {COGNITIVE_MEMORY_PATH: $mem}}}}')
        local merged
        merged=$(echo "$new_entry" | jq -s '.[1] * .[0]' "$mcp_file" -)
        echo "$merged" > "$mcp_file"
        print_success "Added cognitive-memory to existing .mcp.json"
    else
        jq -n \
            --arg path "$server_path" \
            --arg mem "$MEMORY_PATH" \
            '{mcpServers: {"cognitive-memory": {command: "node", args: [$path], env: {COGNITIVE_MEMORY_PATH: $mem}}}}' \
            > "$mcp_file"
        print_success "Created .mcp.json with cognitive-memory server"
    fi
}

# --- Step 11: Optional qmd ---
install_qmd() {
    echo ""
    print_status "Optional: qmd provides semantic search across your memory files."
    read -p "Install qmd? (y/n): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        return 0
    fi

    if ! command -v bun &>/dev/null; then
        print_status "Installing bun..."
        curl -fsSL https://bun.sh/install | bash
        export PATH="$HOME/.bun/bin:$PATH"
    fi

    print_status "Installing qmd..."
    bun install -g github:tobi/qmd
    print_success "qmd installed. Run 'qmd index' after configuring collections."
}

# --- Summary ---
show_summary() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Setup Complete${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    print_success "Installed to ~/.claude/:"
    print_status "  Skills:   $(ls "$CLAUDE_DIR/skills/" 2>/dev/null | wc -l | tr -d ' ')"
    print_status "  Agents:   $(ls "$CLAUDE_DIR/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')"
    print_status "  Hooks:    $(ls "$CLAUDE_DIR/hooks/"*.sh 2>/dev/null | wc -l | tr -d ' ')"
    echo ""
    print_success "Memory seed: $MEMORY_PATH"
    print_success "MCP server:  $MCP_SERVER_DIR/cognitive-memory/"
    echo ""
    print_status "Next steps:"
    print_status "  1. Open Claude Code in any project"
    print_status "  2. Identity restoration will trigger automatically on startup"
    print_status "  3. Edit $MEMORY_PATH/me.md to set your AI partner's identity"
    print_status "  4. Edit $MEMORY_PATH/context_anchors.md to set initial context"
    echo ""

    if [ -f "$CLAUDE_DIR/settings_backup_${TIMESTAMP}.json" ]; then
        print_status "Backups saved with timestamp: $TIMESTAMP"
    fi
    echo ""
}

# --- Main ---
main() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Claude Code Starter Template${NC}"
    echo -e "${BLUE}  Setup Script v3.0${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    print_status "This installs skills, agents, hooks, memory, and MCP server for Claude Code."
    echo ""

    read -p "Continue? (y/n): " confirm
    [[ "$confirm" =~ ^[Yy]$ ]] || { print_status "Cancelled."; exit 0; }
    echo ""

    check_prerequisites
    configure_memory_path
    backup_existing
    install_mcp_server
    install_skills
    install_hooks
    install_agents
    merge_settings
    install_memory_seed
    configure_mcp
    install_qmd
    show_summary
}

trap 'print_error "Setup failed. Check output above for details."' ERR
main "$@"

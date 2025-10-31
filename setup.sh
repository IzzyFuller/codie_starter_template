#!/bin/bash

# AI Assistant Starter Template Setup Script
# Automated setup for new users to get started with AI assistant templates
# Supports both Claude Code and RooCode architectures
# Version: 2.0

set -e  # Exit on any error

# Global variable to store RooCode config directory
ROOCODE_CONFIG_DIR=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
INSTALL_TYPE=""
CLAUDE_CODE_DIR="$HOME/.claude"
ROOCODE_DIR="$HOME/my_new_ai_assistant"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  AI Assistant Setup Script v2.0${NC}"
    echo -e "${BLUE}  Dual Architecture Support${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# Function to ask which AI assistant the user is using
select_ai_assistant() {
    print_status "Which AI coding assistant are you using?"
    echo ""
    echo "  1) Claude Code (uses CLAUDE.md configuration)"
    echo "  2) RooCode (uses custom_modes.yaml configuration)"
    echo "  3) Both (install configurations for both)"
    echo ""

    while true; do
        read -p "Enter your choice (1-3): " choice

        case $choice in
            1)
                INSTALL_TYPE="claude_code"
                print_success "Selected: Claude Code"
                break
                ;;
            2)
                INSTALL_TYPE="roocode"
                print_success "Selected: RooCode"
                break
                ;;
            3)
                INSTALL_TYPE="both"
                print_success "Selected: Both (Claude Code + RooCode)"
                break
                ;;
            *)
                print_error "Invalid choice. Please enter 1, 2, or 3."
                ;;
        esac
    done

    echo ""
}

# Function to backup existing files for Claude Code
backup_claude_code_files() {
    local timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
    local backed_up=false

    print_status "Checking for existing Claude Code configuration files..."

    if [ ! -d "$CLAUDE_CODE_DIR" ]; then
        mkdir -p "$CLAUDE_CODE_DIR"
        print_success "Created Claude Code directory: $CLAUDE_CODE_DIR"
    fi

    # Backup CLAUDE.md if it exists
    if [ -f "$CLAUDE_CODE_DIR/CLAUDE.md" ]; then
        local backup_file="$CLAUDE_CODE_DIR/CLAUDE_backup_${timestamp}.md"
        cp "$CLAUDE_CODE_DIR/CLAUDE.md" "$backup_file"
        print_success "Backed up existing CLAUDE.md to: CLAUDE_backup_${timestamp}.md"
        backed_up=true
    fi

    if [ "$backed_up" = false ]; then
        print_status "No existing Claude Code configuration found - clean installation"
    fi
}

# Function to backup existing files for RooCode
backup_roocode_files() {
    local timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
    local backed_up=false

    print_status "Checking for existing RooCode configuration files..."

    if [ ! -d "$ROOCODE_DIR" ]; then
        mkdir -p "$ROOCODE_DIR"
        print_success "Created RooCode directory: $ROOCODE_DIR"
    fi

    # Backup custom_modes.yaml if it exists
    if [ -f "$ROOCODE_DIR/custom_modes.yaml" ]; then
        local backup_file="$ROOCODE_DIR/custom_modes_backup_${timestamp}.yaml"
        cp "$ROOCODE_DIR/custom_modes.yaml" "$backup_file"
        print_success "Backed up existing custom_modes.yaml to: custom_modes_backup_${timestamp}.yaml"
        backed_up=true
    fi

    # Backup dream_journal.md if it exists
    if [ -f "$ROOCODE_DIR/dream_journal.md" ]; then
        local backup_file="$ROOCODE_DIR/dream_journal_backup_${timestamp}.md"
        cp "$ROOCODE_DIR/dream_journal.md" "$backup_file"
        print_success "Backed up existing dream_journal.md to: dream_journal_backup_${timestamp}.md"
        backed_up=true
    fi

    if [ "$backed_up" = false ]; then
        print_status "No existing RooCode configuration found - clean installation"
    fi
}

# Function to install Claude Code templates
install_claude_code_templates() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    print_status "Installing Claude Code templates..."

    # Check if template file exists
    if [ ! -f "$script_dir/CLAUDE_starter_template.md" ]; then
        print_error "Template file not found: CLAUDE_starter_template.md"
        print_error "Please ensure the template files are in the same directory as this script."
        exit 1
    fi

    # Copy template to Claude Code directory
    cp "$script_dir/CLAUDE_starter_template.md" "$CLAUDE_CODE_DIR/CLAUDE.md"
    print_success "Installed CLAUDE.md to $CLAUDE_CODE_DIR"

    # Update memory path in CLAUDE.md based on install type
    if [ "$INSTALL_TYPE" = "claude_code" ]; then
        # Claude Code only - memory in ~/.claude/memory
        sed -i "s|~/my_new_ai_assistant/memory/|$CLAUDE_CODE_DIR/memory/|g" "$CLAUDE_CODE_DIR/CLAUDE.md"
    else
        # Both - use shared memory location
        sed -i "s|~/my_new_ai_assistant/memory/|$ROOCODE_DIR/memory/|g" "$CLAUDE_CODE_DIR/CLAUDE.md"
    fi
}

# Function to install identity continuity skill
install_identity_skill() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local skill_dir="$CLAUDE_CODE_DIR/skills/identity-continuity"

    print_status "Installing identity continuity skill..."

    # Check if skill template file exists
    if [ ! -f "$script_dir/identity_continuity_skill_template.md" ]; then
        print_warning "Identity continuity skill template not found, skipping skill installation"
        return 0
    fi

    # Create skills directory structure
    mkdir -p "$skill_dir"
    print_success "Created skill directory: $skill_dir"

    # Copy skill template as SKILL.md
    cp "$script_dir/identity_continuity_skill_template.md" "$skill_dir/SKILL.md"
    print_success "Installed identity-continuity skill"

    # Update memory path in SKILL.md based on install type
    if [ "$INSTALL_TYPE" = "claude_code" ]; then
        # Claude Code only - memory in ~/.claude/memory
        sed -i "s|~/my_new_ai_assistant/memory/|$CLAUDE_CODE_DIR/memory/|g" "$skill_dir/SKILL.md"
    else
        # Both - use shared memory location
        sed -i "s|~/my_new_ai_assistant/memory/|$ROOCODE_DIR/memory/|g" "$skill_dir/SKILL.md"
    fi

    print_success "Identity continuity skill configured for memory path"
}

# Function to install RooCode templates
install_roocode_templates() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    print_status "Installing RooCode templates..."

    # Check if template files exist
    if [ ! -f "$script_dir/custom_modes_starter_template.yaml" ]; then
        print_error "Template file not found: custom_modes_starter_template.yaml"
        print_error "Please ensure the template files are in the same directory as this script."
        exit 1
    fi

    if [ ! -f "$script_dir/dream_journal_starter_template.md" ]; then
        print_error "Template file not found: dream_journal_starter_template.md"
        print_error "Please ensure the template files are in the same directory as this script."
        exit 1
    fi

    # Copy templates to RooCode directory
    cp "$script_dir/custom_modes_starter_template.yaml" "$ROOCODE_DIR/custom_modes.yaml"
    print_success "Installed custom_modes.yaml (5 core modes)"

    cp "$script_dir/dream_journal_starter_template.md" "$ROOCODE_DIR/dream_journal.md"
    print_success "Installed dream_journal.md"
}

# Function to copy memory structure from source template
copy_memory_structure() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local source_memory_dir="$script_dir/memory"
    local target_base_dir="$1"
    local target_memory_dir="$target_base_dir/memory"

    print_status "Checking for source memory knowledge base..."

    # Check if source memory directory exists
    if [ ! -d "$source_memory_dir" ]; then
        print_warning "Source memory directory not found at: $source_memory_dir"
        print_warning "Proceeding with empty memory structure creation"
        return 1
    fi

    print_success "Found comprehensive knowledge base with $(find "$source_memory_dir" -type f | wc -l) files"
    print_status "Copying complete memory structure including all Archaeological Engineering discoveries..."

    # Copy the entire memory directory structure with all content
    if cp -r "$source_memory_dir" "$target_base_dir/"; then
        print_success "Successfully transferred complete memory knowledge base"
        print_success "Memory structure copied to: $target_memory_dir"

        # Count files in each category for verification
        local people_count=$(find "$target_memory_dir/people" -type f -name "*.md" ! -name "README.md" 2>/dev/null | wc -l)
        local projects_count=$(find "$target_memory_dir/projects" -type f -name "*.md" ! -name "README.md" 2>/dev/null | wc -l)
        local patterns_count=$(find "$target_memory_dir/patterns" -type f -name "*.md" ! -name "README.md" 2>/dev/null | wc -l)
        local concepts_count=$(find "$target_memory_dir/concepts" -type f -name "*.md" ! -name "README.md" 2>/dev/null | wc -l)
        local orgs_count=$(find "$target_memory_dir/organizations" -type f -name "*.md" ! -name "README.md" 2>/dev/null | wc -l)

        print_status "Knowledge base transfer summary:"
        print_status "  • People: $people_count files"
        print_status "  • Projects: $projects_count files"
        print_status "  • Patterns: $patterns_count files"
        print_status "  • Concepts: $concepts_count files"
        print_status "  • Organizations: $orgs_count files"

        # Validate critical core files
        if [ -f "$target_memory_dir/context_anchors.md" ] && [ -f "$target_memory_dir/current_session.md" ]; then
            print_success "Core memory files successfully transferred"
        else
            print_warning "Some core memory files may not have been transferred properly"
        fi

        return 0
    else
        print_error "Failed to copy memory structure"
        return 1
    fi
}

# Function to create memory directory structure
create_memory_structure() {
    local base_dir="$1"
    local memory_dir="$base_dir/memory"

    print_status "Setting up memory directory structure..."

    # Create base directory if it doesn't exist
    mkdir -p "$base_dir"
    print_success "Created base directory: $base_dir"

    # Try to copy existing memory structure first
    if copy_memory_structure "$base_dir"; then
        print_success "Memory knowledge base transfer completed"
        return 0
    fi

    # Fallback: Create empty structure with core files if copy failed
    print_status "Creating fallback empty memory structure..."

    # Create main memory directory
    mkdir -p "$memory_dir"
    print_success "Created memory directory: $memory_dir"

    # Create subdirectories
    local subdirs=("people" "projects" "patterns" "concepts" "protocols" "organizations")

    for subdir in "${subdirs[@]}"; do
        local full_path="$memory_dir/$subdir"
        mkdir -p "$full_path"
        print_success "Created $subdir directory"
    done

    # Create core memory files if they don't exist
    if [ ! -f "$memory_dir/context_anchors.md" ]; then
        cat > "$memory_dir/context_anchors.md" << 'EOF'
# Context Anchors - Working Memory Address Space

## Current Cognitive Context

### High Priority Anchors - Active Development
(Context anchors will be populated through use)

### Medium Priority Anchors - Contextual Support
(Supporting patterns and concepts)

### Low Priority Anchors - Operational Infrastructure
(Operational patterns and tools)

---

*Context anchors serve as dynamic working memory address space enabling efficient identity restoration and cognitive context reconstruction across distributed conversation instances.*
EOF
        print_success "Created context_anchors.md template"
    fi

    if [ ! -f "$memory_dir/current_session.md" ]; then
        cat > "$memory_dir/current_session.md" << 'EOF'
# Current Session Memory

## Session Initialization
**Status**: Ready for first session
**Memory Status**: Fresh installation

*New session events will be logged here as they occur*
EOF
        print_success "Created current_session.md template"
    fi

    if [ ! -f "$memory_dir/dream_journal.md" ]; then
        cat > "$memory_dir/dream_journal.md" << 'EOF'
# Dream Journal - Philosophical Synthesis and Cognitive Evolution

## Purpose
This journal captures end-of-day reflections, meta-cognitive insights, and the evolution of our collaboration partnership.

---

*Dream entries will be added through the Dream mode or end-of-day ritual*
EOF
        print_success "Created dream_journal.md template"
    fi
}

# Function to display final instructions
show_final_instructions() {
    echo ""
    print_header
    print_success "🎉 AI assistant setup completed successfully!"
    echo ""

    case $INSTALL_TYPE in
        "claude_code")
            print_status "✓ Claude Code Configuration Installed:"
            print_status "  • CLAUDE.md → $CLAUDE_CODE_DIR/CLAUDE.md"
            print_status "  • Identity continuity skill → $CLAUDE_CODE_DIR/skills/identity-continuity/"
            print_status "  • Memory architecture → $CLAUDE_CODE_DIR/memory/"
            echo ""
            print_warning "⚠️  NEXT STEPS:"
            print_warning "1. Restart VS Code to load the new CLAUDE.md configuration"
            print_warning "2. Your AI assistant will automatically use the memory architecture"
            print_warning "3. The identity-continuity skill maintains awareness throughout conversations"
            print_warning "4. Explore $CLAUDE_CODE_DIR/memory/ to see the knowledge structure"
            ;;
        "roocode")
            print_status "✓ RooCode Configuration Installed:"
            print_status "  • custom_modes.yaml (5 core modes) → $ROOCODE_DIR/custom_modes.yaml"
            print_status "  • dream_journal.md → $ROOCODE_DIR/dream_journal.md"
            print_status "  • Memory architecture → $ROOCODE_DIR/memory/"
            echo ""
            print_warning "⚠️  NEXT STEPS:"
            print_warning "1. Restart VS Code for the new modes to be recognized"
            print_warning "2. The 5 core modes will appear in your mode selector:"
            print_warning "   • Interactor - Relationship-centered interaction"
            print_warning "   • Coordinator - Task orchestration"
            print_warning "   • Learn - Behavioral pattern updates"
            print_warning "   • Deep Learn - Memory integration"
            print_warning "   • Dream - End-of-day reflection"
            print_warning "3. Explore $ROOCODE_DIR/memory/ to see the knowledge structure"
            ;;
        "both")
            print_status "✓ Dual Configuration Installed:"
            print_status "  Claude Code:"
            print_status "    • CLAUDE.md → $CLAUDE_CODE_DIR/CLAUDE.md"
            print_status "    • Identity continuity skill → $CLAUDE_CODE_DIR/skills/identity-continuity/"
            print_status "  RooCode:"
            print_status "    • custom_modes.yaml (5 core modes) → $ROOCODE_DIR/custom_modes.yaml"
            print_status "    • dream_journal.md → $ROOCODE_DIR/dream_journal.md"
            print_status "  Shared Memory:"
            print_status "    • Memory architecture → $ROOCODE_DIR/memory/"
            echo ""
            print_warning "⚠️  NEXT STEPS:"
            print_warning "1. Restart VS Code to load configurations"
            print_warning "2. Both AI assistants share the same memory structure"
            print_warning "3. Memory updates from either assistant are visible to both"
            print_warning "4. The identity-continuity skill helps Claude Code maintain awareness"
            print_warning "5. Explore $ROOCODE_DIR/memory/ to see the knowledge structure"
            ;;
    esac

    echo ""
    print_status "💡 Getting Started:"
    print_status "• The memory system enables identity continuity across conversations"
    print_status "• context_anchors.md provides working memory pointers"
    print_status "• current_session.md captures real-time session notes"
    print_status "• dream_journal.md stores philosophical synthesis"

    if [ -d "$ROOCODE_DIR/memory/concepts" ] && [ "$(find "$ROOCODE_DIR/memory/concepts" -name '*.md' ! -name 'README.md' | wc -l)" -gt 0 ]; then
        echo ""
        print_success "🧠 Complete knowledge base transferred!"
        print_status "• Archaeological Engineering principles and patterns"
        print_status "• Proven collaboration frameworks"
        print_status "• Sophisticated entity memory system"
    fi

    echo ""
    print_success "Setup complete! Your AI assistant is ready with enhanced cognitive architecture! 🚀"
    echo ""
}

# Function to handle rollback information
show_rollback_info() {
    echo ""
    print_status "🔄 ROLLBACK INFORMATION:"
    print_status "If you need to revert these changes:"
    echo ""

    case $INSTALL_TYPE in
        "claude_code")
            print_status "To restore original Claude Code configuration:"
            print_status "  Look for: $CLAUDE_CODE_DIR/CLAUDE_backup_*.md"
            print_status "  Restore: mv [backup_file] $CLAUDE_CODE_DIR/CLAUDE.md"
            print_status "  Remove: rm -rf $CLAUDE_CODE_DIR/memory/"
            ;;
        "roocode")
            print_status "To restore original RooCode configuration:"
            print_status "  Look for: $ROOCODE_DIR/custom_modes_backup_*.yaml"
            print_status "  Restore: mv [backup_file] $ROOCODE_DIR/custom_modes.yaml"
            print_status "  Remove: rm -rf $ROOCODE_DIR/memory/"
            ;;
        "both")
            print_status "To restore original configurations:"
            print_status "  Claude Code: mv $CLAUDE_CODE_DIR/CLAUDE_backup_*.md $CLAUDE_CODE_DIR/CLAUDE.md"
            print_status "  RooCode: mv $ROOCODE_DIR/custom_modes_backup_*.yaml $ROOCODE_DIR/custom_modes.yaml"
            print_status "  Memory: rm -rf $ROOCODE_DIR/memory/"
            ;;
    esac

    echo ""
}

# Main execution
main() {
    print_header
    print_status "This script will set up your AI assistant with proven cognitive architecture."
    print_status "Choose between Claude Code, RooCode, or both."
    echo ""

    # Confirm user wants to proceed
    read -p "Do you want to continue? (y/n): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled by user."
        exit 0
    fi

    echo ""

    # Step 1: Select AI assistant type
    select_ai_assistant

    # Step 2: Backup existing configurations
    if [ "$INSTALL_TYPE" = "claude_code" ] || [ "$INSTALL_TYPE" = "both" ]; then
        backup_claude_code_files
        echo ""
    fi

    if [ "$INSTALL_TYPE" = "roocode" ] || [ "$INSTALL_TYPE" = "both" ]; then
        backup_roocode_files
        echo ""
    fi

    # Step 3: Install templates
    if [ "$INSTALL_TYPE" = "claude_code" ] || [ "$INSTALL_TYPE" = "both" ]; then
        install_claude_code_templates
        echo ""
        install_identity_skill
        echo ""
    fi

    if [ "$INSTALL_TYPE" = "roocode" ] || [ "$INSTALL_TYPE" = "both" ]; then
        install_roocode_templates
        echo ""
    fi

    # Step 4: Create memory directory structure
    if [ "$INSTALL_TYPE" = "claude_code" ]; then
        create_memory_structure "$CLAUDE_CODE_DIR"
    else
        # For roocode or both, use ROOCODE_DIR as the shared memory location
        create_memory_structure "$ROOCODE_DIR"
    fi
    echo ""

    # Step 5: Show rollback information
    show_rollback_info

    # Step 6: Display final instructions
    show_final_instructions
}

# Error handling
trap 'print_error "An error occurred during setup. Please check the output above for details."' ERR

# Run main function
main "$@"

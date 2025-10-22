#!/bin/bash

# RooCode Starter Template Setup Script
# Automated setup for new users to get started with RooCode templates
# Version: 1.0

set -e  # Exit on any error

# Global variable to store RooCode config directory
ROOCODE_CONFIG_DIR=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output (redirected to stderr to avoid capture in command substitution)
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
    echo -e "${BLUE}  RooCode Setup Script v1.0${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# Function to find RooCode config directory
# Sets the global variable ROOCODE_CONFIG_DIR
find_roocode_config() {
    local standard_path="$HOME/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings"
    
    print_status "Looking for RooCode configuration directory..."
    
    if [ -d "$standard_path" ]; then
        print_success "Found RooCode config directory at: $standard_path"
        ROOCODE_CONFIG_DIR="$standard_path"
        return 0
    fi
    
    print_warning "Standard RooCode config directory not found at: $standard_path"
    echo "" >&2
    print_status "Please provide the path to your RooCode settings directory."
    print_status "This is typically located at:"
    print_status "  ~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/"
    print_status "  or on Windows: %APPDATA%/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/"
    echo "" >&2
    
    while true; do
        read -p "Enter the full path to your RooCode settings directory: " user_path
        
        # Expand tilde and environment variables
        expanded_path=$(eval echo "$user_path")
        
        if [ -d "$expanded_path" ]; then
            print_success "Found RooCode config directory at: $expanded_path"
            ROOCODE_CONFIG_DIR="$expanded_path"
            return 0
        else
            print_error "Directory does not exist: $expanded_path"
            echo "" >&2
            read -p "Would you like to try again? (y/n): " try_again
            if [[ ! "$try_again" =~ ^[Yy]$ ]]; then
                print_error "Setup cancelled. Cannot proceed without valid config directory."
                exit 1
            fi
        fi
    done
}

# Function to backup existing files
backup_existing_files() {
    local config_dir="$1"
    local timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
    local backed_up=false
    
    print_status "Checking for existing configuration files to backup..."
    
    # Backup custom_modes.yaml if it exists
    if [ -f "$config_dir/custom_modes.yaml" ]; then
        local backup_file="$config_dir/custom_modes_backup_${timestamp}.yaml"
        cp "$config_dir/custom_modes.yaml" "$backup_file"
        print_success "Backed up existing custom_modes.yaml to: custom_modes_backup_${timestamp}.yaml"
        backed_up=true
    fi
    
    # Backup dream_journal.md if it exists
    if [ -f "$config_dir/dream_journal.md" ]; then
        local backup_file="$config_dir/dream_journal_backup_${timestamp}.md"
        cp "$config_dir/dream_journal.md" "$backup_file"
        print_success "Backed up existing dream_journal.md to: dream_journal_backup_${timestamp}.md"
        backed_up=true
    fi
    
    if [ "$backed_up" = false ]; then
        print_status "No existing configuration files found - clean installation"
    fi
}

# Function to install templates
install_templates() {
    local config_dir="$1"
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    print_status "Installing template files..."
    
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
    
    # Copy templates to config directory
    cp "$script_dir/custom_modes_starter_template.yaml" "$config_dir/custom_modes.yaml"
    print_success "Installed custom_modes.yaml"
    
    cp "$script_dir/dream_journal_starter_template.md" "$config_dir/dream_journal.md"
    print_success "Installed dream_journal.md"
}

# Function to create memory directory structure
create_memory_structure() {
    local config_dir="$1"
    local memory_dir="$config_dir/memory"
    
    print_status "Creating memory directory structure..."
    
    # Create main memory directory
    mkdir -p "$memory_dir"
    print_success "Created memory directory: $memory_dir"
    
    # Create subdirectories
    local subdirs=("people" "projects" "patterns" "concepts")
    
    for subdir in "${subdirs[@]}"; do
        local full_path="$memory_dir/$subdir"
        mkdir -p "$full_path"
        
        # Create README.md for each subdirectory
        case $subdir in
            "people")
                cat > "$full_path/README.md" << 'EOF'
# People Memory

This directory is for storing information about people you interact with regularly.

## Purpose
- Remember names, preferences, and communication styles
- Track relationship context and history
- Store relevant professional background and expertise areas

## File Naming Convention
- Use descriptive names: `john_doe_cto.md`
- Include role or context in filename when helpful

## Contents Should Include
- Basic information and role
- Communication preferences
- Key topics of mutual interest
- Interaction history highlights
- Any specific context that improves collaboration
EOF
                ;;
            "projects")
                cat > "$full_path/README.md" << 'EOF'
# Projects Memory

This directory is for storing information about ongoing and completed projects.

## Purpose
- Track project goals, progress, and outcomes
- Remember architectural decisions and rationale
- Store lessons learned and best practices discovered
- Maintain context across project phases

## File Naming Convention
- Use project names: `ocr_enhancement.md`, `mcp_server_development.md`
- Include version or phase if relevant

## Contents Should Include
- Project objectives and requirements
- Key architectural decisions
- Technical stack and tools used
- Challenges encountered and solutions
- Lessons learned and future improvements
- Status updates and milestones
EOF
                ;;
            "patterns")
                cat > "$full_path/README.md" << 'EOF'
# Patterns Memory

This directory is for storing recurring patterns, methodologies, and frameworks discovered through experience.

## Purpose
- Capture successful approaches and methodologies
- Document anti-patterns and things to avoid
- Store decision-making frameworks
- Remember effective problem-solving techniques

## File Naming Convention
- Use descriptive pattern names: `archaeological_engineering.md`, `evidence_based_validation.md`
- Focus on the pattern concept rather than specific implementations

## Contents Should Include
- Pattern description and context
- When and why to use this pattern
- Implementation guidance
- Examples of successful application
- Common pitfalls and how to avoid them
- Related patterns and connections
EOF
                ;;
            "concepts")
                cat > "$full_path/README.md" << 'EOF'
# Concepts Memory

This directory is for storing important technical concepts, theories, and learning insights.

## Purpose
- Build a knowledge base of technical concepts
- Connect related ideas and theories
- Track evolution of understanding over time
- Store research and learning notes

## File Naming Convention
- Use concept names: `meta_engineering.md`, `bootstrap_consciousness.md`
- Include domain if needed: `legal_archaeological_validation.md`

## Contents Should Include
- Concept definition and explanation
- Key principles and components
- Real-world applications and examples
- Connections to other concepts
- Evolution of understanding over time
- Sources and further reading
EOF
                ;;
        esac
        
        print_success "Created $subdir directory with README.md"
    done
}

# Function to display final instructions
show_final_instructions() {
    local config_dir="$1"
    
    echo ""
    print_header
    print_success "🎉 RooCode setup completed successfully!"
    echo ""
    print_status "Files installed:"
    print_status "  ✓ custom_modes.yaml (comprehensive mode definitions)"
    print_status "  ✓ dream_journal.md (cognitive evolution documentation)"
    print_status "  ✓ /memory/ directory structure with README files"
    echo ""
    print_status "Configuration directory: $config_dir"
    echo ""
    print_warning "⚠️  IMPORTANT NEXT STEPS:"
    print_warning "1. Restart RooCode/VSCode for the new modes to be recognized"
    print_warning "2. The new modes will appear in your mode selector after restart"
    print_warning "3. Explore the /memory/ directories to understand their purpose"
    echo ""
    print_status "💡 Getting Started Tips:"
    print_status "• Start with 'Ask' mode for questions and explanations"
    print_status "• Use 'Architect' mode for planning and system design"
    print_status "• Try 'Orchestrator' mode for complex multi-step tasks"
    print_status "• Use 'Dream' mode for end-of-day reflection and insights"
    echo ""
    print_status "📚 For more information, see the comprehensive mode definitions in:"
    print_status "    $config_dir/custom_modes.yaml"
    echo ""
    print_success "Setup complete! Welcome to enhanced RooCode! 🚀"
    echo ""
}

# Function to handle rollback information
show_rollback_info() {
    local config_dir="$1"
    
    echo ""
    print_status "🔄 ROLLBACK INFORMATION:"
    print_status "If you need to revert these changes:"
    echo ""
    print_status "To restore original files (if they existed):"
    print_status "  1. Navigate to: $config_dir"
    print_status "  2. Look for backup files with timestamp: custom_modes_backup_YYYY-MM-DD_HH-MM-SS.yaml"
    print_status "  3. Rename backup file to: custom_modes.yaml"
    print_status "  4. Do the same for dream_journal.md if needed"
    echo ""
    print_status "To completely remove installed templates:"
    print_status "  rm '$config_dir/custom_modes.yaml'"
    print_status "  rm '$config_dir/dream_journal.md'"
    print_status "  rm -rf '$config_dir/memory/'"
    echo ""
}

# Main execution
main() {
    print_header
    print_status "This script will set up RooCode with comprehensive mode definitions and cognitive enhancement tools."
    echo ""
    
    # Confirm user wants to proceed
    read -p "Do you want to continue? (y/n): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled by user."
        exit 0
    fi
    
    echo ""
    
    # Step 1: Find RooCode config directory
    find_roocode_config
    config_dir="$ROOCODE_CONFIG_DIR"
    echo ""
    
    # Step 2: Backup existing configuration
    backup_existing_files "$config_dir"
    echo ""
    
    # Step 3: Install templates
    install_templates "$config_dir"
    echo ""
    
    # Step 4: Create memory directory structure
    create_memory_structure "$config_dir"
    echo ""
    
    # Step 5: Show rollback information
    show_rollback_info "$config_dir"
    
    # Step 6: Display final instructions
    show_final_instructions "$config_dir"
}

# Error handling
trap 'print_error "An error occurred during setup. Please check the output above for details."' ERR

# Run main function
main "$@"
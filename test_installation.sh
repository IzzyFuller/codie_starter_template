#!/bin/bash

# Automated test script for AI Assistant Starter Template
# Tests all three installation paths in isolated Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_test_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to verify file exists
verify_file() {
    local file="$1"
    local description="$2"

    if [ -f "$file" ]; then
        print_success "$description exists: $file"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        print_error "$description missing: $file"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to verify directory exists
verify_dir() {
    local dir="$1"
    local description="$2"

    if [ -d "$dir" ]; then
        print_success "$description exists: $dir"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        print_error "$description missing: $dir"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to count files in directory
count_files() {
    local dir="$1"
    find "$dir" -type f 2>/dev/null | wc -l
}

# Cleanup function
cleanup_installation() {
    print_info "Cleaning up previous test installation..."
    rm -rf ~/.claude
    rm -rf ~/my_new_ai_assistant
    print_success "Cleanup complete"
}

# Test 1: Claude Code Only Installation
test_claude_code_only() {
    print_test_header "TEST 1: Claude Code Only Installation"

    cleanup_installation

    print_info "Running setup.sh with Claude Code option..."

    # Simulate user input: choice 1 (Claude Code)
    printf "y\n1\n" | ./setup.sh || true

    print_info "Verifying Claude Code installation..."

    verify_file ~/.claude/CLAUDE.md "CLAUDE.md configuration"
    verify_dir ~/.claude/memory "Claude Code memory directory"
    verify_file ~/.claude/memory/context_anchors.md "Context anchors"
    verify_file ~/.claude/memory/current_session.md "Current session"
    verify_dir ~/.claude/memory/protocols "Protocols directory"
    verify_file ~/.claude/memory/protocols/end_of_day_ritual.md "End of day ritual protocol"

    # Verify memory path in CLAUDE.md points to ~/.claude/memory/ (check for expanded path)
    if grep -q "$HOME/.claude/memory/" ~/.claude/CLAUDE.md || grep -q "~/.claude/memory/" ~/.claude/CLAUDE.md; then
        print_success "CLAUDE.md memory path correctly set to Claude Code memory location"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "CLAUDE.md memory path not correctly updated"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    # Verify RooCode files NOT created
    if [ ! -d ~/my_new_ai_assistant ]; then
        print_success "RooCode directory correctly NOT created"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "RooCode directory unexpectedly created"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    local file_count=$(count_files ~/.claude/memory)
    print_info "Memory structure contains $file_count files"
}

# Test 2: RooCode Only Installation
test_roocode_only() {
    print_test_header "TEST 2: RooCode Only Installation"

    cleanup_installation

    print_info "Running setup.sh with RooCode option..."

    # Simulate user input: choice 2 (RooCode)
    printf "y\n2\n" | ./setup.sh || true

    print_info "Verifying RooCode installation..."

    verify_file ~/my_new_ai_assistant/custom_modes.yaml "custom_modes.yaml (5 modes)"
    verify_file ~/my_new_ai_assistant/dream_journal.md "Dream journal"
    verify_dir ~/my_new_ai_assistant/memory "RooCode memory directory"
    verify_file ~/my_new_ai_assistant/memory/context_anchors.md "Context anchors"
    verify_file ~/my_new_ai_assistant/memory/current_session.md "Current session"
    verify_dir ~/my_new_ai_assistant/memory/protocols "Protocols directory"

    # Verify 5 modes in custom_modes.yaml
    local mode_count=$(grep -c "^  - slug:" ~/my_new_ai_assistant/custom_modes.yaml || true)
    if [ "$mode_count" -eq 5 ]; then
        print_success "custom_modes.yaml contains exactly 5 modes"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "custom_modes.yaml contains $mode_count modes (expected 5)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    # Verify the 5 modes are the correct ones
    if grep -q "slug: interactor" ~/my_new_ai_assistant/custom_modes.yaml && \
       grep -q "slug: coordinator" ~/my_new_ai_assistant/custom_modes.yaml && \
       grep -q "slug: learn" ~/my_new_ai_assistant/custom_modes.yaml && \
       grep -q "slug: deep-learn" ~/my_new_ai_assistant/custom_modes.yaml && \
       grep -q "slug: dream" ~/my_new_ai_assistant/custom_modes.yaml; then
        print_success "All 5 core modes present (interactor, coordinator, learn, deep-learn, dream)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "Missing one or more core modes"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    # Verify Claude Code files NOT created
    if [ ! -f ~/.claude/CLAUDE.md ]; then
        print_success "Claude Code CLAUDE.md correctly NOT created"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "Claude Code CLAUDE.md unexpectedly created"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    local file_count=$(count_files ~/my_new_ai_assistant/memory)
    print_info "Memory structure contains $file_count files"
}

# Test 3: Both Installation (Shared Memory)
test_both_installation() {
    print_test_header "TEST 3: Both Installations (Shared Memory)"

    cleanup_installation

    print_info "Running setup.sh with Both option..."

    # Simulate user input: choice 3 (Both)
    printf "y\n3\n" | ./setup.sh || true

    print_info "Verifying dual installation..."

    # Verify Claude Code files
    verify_file ~/.claude/CLAUDE.md "Claude Code CLAUDE.md"

    # Verify RooCode files
    verify_file ~/my_new_ai_assistant/custom_modes.yaml "RooCode custom_modes.yaml"
    verify_file ~/my_new_ai_assistant/dream_journal.md "Dream journal"

    # Verify SHARED memory location
    verify_dir ~/my_new_ai_assistant/memory "Shared memory directory"
    verify_file ~/my_new_ai_assistant/memory/context_anchors.md "Shared context anchors"
    verify_file ~/my_new_ai_assistant/memory/current_session.md "Shared current session"

    # Verify Claude Code memory path points to SHARED location (check for expanded path)
    if grep -q "$HOME/my_new_ai_assistant/memory/" ~/.claude/CLAUDE.md || grep -q "~/my_new_ai_assistant/memory/" ~/.claude/CLAUDE.md; then
        print_success "CLAUDE.md memory path correctly points to shared location"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "CLAUDE.md memory path not pointing to shared location"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        print_info "Checking actual path in CLAUDE.md:"
        grep "memory/" ~/.claude/CLAUDE.md | head -3
    fi

    # Verify Claude Code does NOT have its own memory directory
    if [ ! -d ~/.claude/memory ]; then
        print_success "Claude Code correctly uses shared memory (no ~/.claude/memory/)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "Claude Code unexpectedly created its own memory directory"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    local file_count=$(count_files ~/my_new_ai_assistant/memory)
    print_info "Shared memory structure contains $file_count files"
}

# Test 4: Backup Functionality
test_backup_functionality() {
    print_test_header "TEST 4: Backup Functionality"

    cleanup_installation

    print_info "Creating existing files to test backup..."

    # Create existing CLAUDE.md
    mkdir -p ~/.claude
    echo "# Existing CLAUDE.md" > ~/.claude/CLAUDE.md

    # Create existing custom_modes.yaml
    mkdir -p ~/my_new_ai_assistant
    echo "customModes:" > ~/my_new_ai_assistant/custom_modes.yaml

    print_info "Running setup.sh with Both option (should create backups)..."

    # Run installation
    printf "y\n3\n" | ./setup.sh || true

    print_info "Verifying backups were created..."

    # Check for Claude Code backup
    local claude_backup=$(find ~/.claude -name "CLAUDE_backup_*.md" | head -1)
    if [ -n "$claude_backup" ]; then
        print_success "Claude Code backup created: $(basename "$claude_backup")"
        TESTS_PASSED=$((TESTS_PASSED + 1))

        # Verify backup content
        if grep -q "Existing CLAUDE.md" "$claude_backup"; then
            print_success "Backup contains original content"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            print_error "Backup does not contain original content"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        print_error "Claude Code backup not created"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    # Check for RooCode backup
    local roocode_backup=$(find ~/my_new_ai_assistant -name "custom_modes_backup_*.yaml" | head -1)
    if [ -n "$roocode_backup" ]; then
        print_success "RooCode backup created: $(basename "$roocode_backup")"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "RooCode backup not created"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Main test execution
main() {
    print_test_header "AI Assistant Starter Template - Installation Tests"

    print_info "Starting automated test suite..."
    print_info "Test environment: Docker container"
    print_info "Working directory: $(pwd)"
    echo ""

    # Run all tests
    test_claude_code_only
    test_roocode_only
    test_both_installation
    test_backup_functionality

    # Final summary
    print_test_header "TEST SUMMARY"

    local total_tests=$((TESTS_PASSED + TESTS_FAILED))

    echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
    echo -e "Total:  $total_tests"
    echo ""

    if [ $TESTS_FAILED -eq 0 ]; then
        print_success "ALL TESTS PASSED! Installation script is working correctly."
        exit 0
    else
        print_error "SOME TESTS FAILED. Please review the output above."
        exit 1
    fi
}

# Run main function
main

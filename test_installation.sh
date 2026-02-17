#!/bin/bash

# Test script for Claude Code Starter Template
# Verifies setup.mjs installs all components correctly

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0
CLAUDE_DIR="$HOME/.claude"
MEMORY_PATH="$HOME/claude-memory-test"
MCP_SERVER_DIR="$HOME/.local/share/claude-mcp-servers"

print_header() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }
pass() { echo -e "${GREEN}  PASS${NC} $1"; TESTS_PASSED=$((TESTS_PASSED + 1)); }
fail() { echo -e "${RED}  FAIL${NC} $1"; TESTS_FAILED=$((TESTS_FAILED + 1)); }
info() { echo -e "${YELLOW}  INFO${NC} $1"; }

assert_file() {
    [ -f "$1" ] && pass "$2" || fail "$2: $1"
}

assert_dir() {
    [ -d "$1" ] && pass "$2" || fail "$2: $1"
}

assert_no_literal() {
    local pattern="$1" file="$2" desc="$3"
    if grep -rq "$pattern" "$file" 2>/dev/null; then
        fail "$desc: found '$pattern' in $file"
    else
        pass "$desc"
    fi
}

assert_json_contains() {
    local file="$1" query="$2" desc="$3"
    if jq -e "$query" "$file" >/dev/null 2>&1; then
        pass "$desc"
    else
        fail "$desc"
    fi
}

# --- Cleanup ---
cleanup() {
    info "Cleaning test environment..."
    rm -rf "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents" "$CLAUDE_DIR/hooks"
    rm -f "$CLAUDE_DIR/settings.json"
    rm -rf "$MEMORY_PATH"
    rm -f "$HOME/.mcp.json"
    rm -rf "$MCP_SERVER_DIR/cognitive-memory"
}

# --- Test: Skills ---
test_skills() {
    print_header "Skills (expect 11)"

    local expected_skills=(
        pre-commit-checks
        anti-pattern-detection
        principle-check
        session-note-taking
        semantic-reflection
        context-mapping
        feedback-pattern-recognition
        request-intake
        refactor-phase
        refactor-phase-self-check
        skill-protocol-creation
    )

    local count=0
    for skill in "${expected_skills[@]}"; do
        assert_file "$CLAUDE_DIR/skills/$skill/SKILL.md" "Skill: $skill"
        count=$((count + 1))
    done

    # Verify count
    local actual
    actual=$(find "$CLAUDE_DIR/skills" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$actual" -eq "${#expected_skills[@]}" ]; then
        pass "Skill count: $actual"
    else
        fail "Skill count: expected ${#expected_skills[@]}, got $actual"
    fi

    # Verify no {{MEMORY_PATH}} literals remain
    assert_no_literal "{{MEMORY_PATH}}" "$CLAUDE_DIR/skills" "No path placeholders in skills"

    # Verify haiku model on specific skills
    if grep -q "model: haiku" "$CLAUDE_DIR/skills/pre-commit-checks/SKILL.md"; then
        pass "pre-commit-checks uses haiku model"
    else
        fail "pre-commit-checks should use haiku model"
    fi

    if grep -q "model: haiku" "$CLAUDE_DIR/skills/session-note-taking/SKILL.md"; then
        pass "session-note-taking uses haiku model"
    else
        fail "session-note-taking should use haiku model"
    fi
}

# --- Test: Hooks ---
test_hooks() {
    print_header "Hooks (expect 4 .mjs files)"

    local expected_hooks=(
        post-tool-session-note.mjs
        semantic-hydration.mjs
        session-start-restore.mjs
        context-check.mjs
    )

    for hook in "${expected_hooks[@]}"; do
        assert_file "$CLAUDE_DIR/hooks/$hook" "Hook: $hook"
    done

    # Verify count (.mjs files only)
    local actual
    actual=$(find "$CLAUDE_DIR/hooks" -name "*.mjs" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$actual" -eq "${#expected_hooks[@]}" ]; then
        pass "Hook count: $actual"
    else
        fail "Hook count: expected ${#expected_hooks[@]}, got $actual"
    fi

    # Verify NO .sh hook files are installed
    local sh_count
    sh_count=$(find "$CLAUDE_DIR/hooks" -name "*.sh" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$sh_count" -eq 0 ]; then
        pass "No .sh hook files installed (correct — using .mjs)"
    else
        fail "Found $sh_count .sh hook files (should be 0)"
    fi

    # Verify each hook starts with node shebang
    for hook in "${expected_hooks[@]}"; do
        if head -1 "$CLAUDE_DIR/hooks/$hook" | grep -q "#!/usr/bin/env node"; then
            pass "$hook has node shebang"
        else
            fail "$hook missing node shebang"
        fi
    done

    # Verify excluded hooks are NOT present
    local excluded_hooks=(inject-agent-instructions.sh validate-response.sh pre-compact.sh)
    for hook in "${excluded_hooks[@]}"; do
        if [ -f "$CLAUDE_DIR/hooks/$hook" ]; then
            fail "Excluded hook present: $hook"
        else
            pass "Excluded hook absent: $hook"
        fi
    done
}

# --- Test: Agents ---
test_agents() {
    print_header "Agents (expect 11)"

    local expected_agents=(
        identity-restoration.md
        semantic-reflection.md
        session-notes.md
        clean-coder.md
        clean-designer.md
        code-quality-fixer.md
        end-of-day-ritual.md
        deep-learn-anti-pattern-finder.md
        deep-learn-entity-finder.md
        deep-learn-pattern-finder.md
        deep-learn-resetter.md
    )

    for agent in "${expected_agents[@]}"; do
        assert_file "$CLAUDE_DIR/agents/$agent" "Agent: $agent"
    done

    # Verify count
    local actual
    actual=$(find "$CLAUDE_DIR/agents" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$actual" -eq "${#expected_agents[@]}" ]; then
        pass "Agent count: $actual"
    else
        fail "Agent count: expected ${#expected_agents[@]}, got $actual"
    fi

    # Verify no {{MEMORY_PATH}} literals remain
    assert_no_literal "{{MEMORY_PATH}}" "$CLAUDE_DIR/agents" "No path placeholders in agents"

    # Verify no hardcoded user paths
    assert_no_literal "/Users/izzyfuller/" "$CLAUDE_DIR/agents" "No hardcoded user paths in agents"

    # Verify excluded agents are NOT present
    local excluded_agents=(clean-reviewer.md clean-thinker.md)
    for agent in "${excluded_agents[@]}"; do
        if [ -f "$CLAUDE_DIR/agents/$agent" ]; then
            fail "Excluded agent present: $agent"
        else
            pass "Excluded agent absent: $agent"
        fi
    done
}

# --- Test: Memory Seed ---
test_memory_seed() {
    print_header "Memory Seed"

    # Template files
    assert_file "$MEMORY_PATH/context_anchors.md" "context_anchors.md"
    assert_file "$MEMORY_PATH/current_session.md" "current_session.md"
    assert_file "$MEMORY_PATH/me.md" "me.md"

    # Directories
    local expected_dirs=(concepts patterns anti-patterns protocols people projects organizations)
    for dir in "${expected_dirs[@]}"; do
        assert_dir "$MEMORY_PATH/$dir" "Directory: $dir"
    done

    # Concepts (7)
    local concept_count
    concept_count=$(find "$MEMORY_PATH/concepts" -name "*.md" ! -name "README.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$concept_count" -eq 7 ]; then
        pass "Concept count: $concept_count"
    else
        fail "Concept count: expected 7, got $concept_count"
    fi

    # Patterns (5)
    local pattern_count
    pattern_count=$(find "$MEMORY_PATH/patterns" -name "*.md" ! -name "README.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$pattern_count" -eq 5 ]; then
        pass "Pattern count: $pattern_count"
    else
        fail "Pattern count: expected 5, got $pattern_count"
    fi

    # Anti-patterns (17)
    local ap_count
    ap_count=$(find "$MEMORY_PATH/anti-patterns" -name "*.md" ! -name "README.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$ap_count" -eq 17 ]; then
        pass "Anti-pattern count: $ap_count"
    else
        fail "Anti-pattern count: expected 17, got $ap_count"
    fi

    # Protocols (25)
    local proto_count
    proto_count=$(find "$MEMORY_PATH/protocols" -name "*.md" ! -name "README.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$proto_count" -eq 25 ]; then
        pass "Protocol count: $proto_count"
    else
        fail "Protocol count: expected 25, got $proto_count"
    fi

    # People (2)
    assert_file "$MEMORY_PATH/people/izzy.md" "people/izzy.md"
    assert_file "$MEMORY_PATH/people/codie.md" "people/codie.md"

    # READMEs
    assert_file "$MEMORY_PATH/projects/README.md" "projects/README.md"
    assert_file "$MEMORY_PATH/organizations/README.md" "organizations/README.md"

    # No {{MEMORY_PATH}} literals in protocols
    assert_no_literal "{{MEMORY_PATH}}" "$MEMORY_PATH/protocols" "No path placeholders in protocols"

    # No hardcoded user paths anywhere in memory
    assert_no_literal "/Users/izzyfuller/" "$MEMORY_PATH" "No hardcoded user paths in memory"

    # No FasterOutcomes references
    assert_no_literal "FasterOutcomes" "$MEMORY_PATH" "No FasterOutcomes references in memory"
}

# --- Test: Settings ---
test_settings() {
    print_header "Settings"

    assert_file "$CLAUDE_DIR/settings.json" "settings.json"

    # Verify it's valid JSON
    if jq empty "$CLAUDE_DIR/settings.json" 2>/dev/null; then
        pass "settings.json is valid JSON"
    else
        fail "settings.json is invalid JSON"
    fi

    # Verify hooks are configured
    assert_json_contains "$CLAUDE_DIR/settings.json" '.hooks.PostToolUse' "PostToolUse hook configured"
    assert_json_contains "$CLAUDE_DIR/settings.json" '.hooks.UserPromptSubmit' "UserPromptSubmit hook configured"
    assert_json_contains "$CLAUDE_DIR/settings.json" '.hooks.SessionStart' "SessionStart hook configured"
    assert_json_contains "$CLAUDE_DIR/settings.json" '.hooks.Stop' "Stop hook configured"

    # Verify hooks use 'node' command (not 'bash')
    local post_cmd
    post_cmd=$(jq -r '.hooks.PostToolUse[0].command // empty' "$CLAUDE_DIR/settings.json" 2>/dev/null)
    if echo "$post_cmd" | grep -q "^node "; then
        pass "PostToolUse uses node command"
    else
        fail "PostToolUse should use node command, got: $post_cmd"
    fi

    local hydration_cmd
    hydration_cmd=$(jq -r '.hooks.UserPromptSubmit[0].command // empty' "$CLAUDE_DIR/settings.json" 2>/dev/null)
    if echo "$hydration_cmd" | grep -q "^node "; then
        pass "UserPromptSubmit uses node command"
    else
        fail "UserPromptSubmit should use node command, got: $hydration_cmd"
    fi

    local start_cmd
    start_cmd=$(jq -r '.hooks.SessionStart[0].command // empty' "$CLAUDE_DIR/settings.json" 2>/dev/null)
    if echo "$start_cmd" | grep -q "^node "; then
        pass "SessionStart uses node command"
    else
        fail "SessionStart should use node command, got: $start_cmd"
    fi

    local stop_cmd
    stop_cmd=$(jq -r '.hooks.Stop[0].command // empty' "$CLAUDE_DIR/settings.json" 2>/dev/null)
    if echo "$stop_cmd" | grep -q "^node "; then
        pass "Stop uses node command"
    else
        fail "Stop should use node command, got: $stop_cmd"
    fi

    # Verify hooks reference .mjs files
    if echo "$post_cmd" | grep -q "\.mjs"; then
        pass "PostToolUse references .mjs file"
    else
        fail "PostToolUse should reference .mjs file"
    fi

    # Verify MCP_TOOL_TIMEOUT
    local timeout
    timeout=$(jq -r '.env.MCP_TOOL_TIMEOUT // empty' "$CLAUDE_DIR/settings.json" 2>/dev/null)
    if [ "$timeout" = "120000" ]; then
        pass "MCP_TOOL_TIMEOUT set to 120000"
    else
        fail "MCP_TOOL_TIMEOUT: expected 120000, got '$timeout'"
    fi

    # Verify qmd permission
    if jq -r '.permissions.allow[]' "$CLAUDE_DIR/settings.json" 2>/dev/null | grep -q "mcp__qmd__"; then
        pass "qmd permission in allow list"
    else
        fail "qmd permission missing from allow list"
    fi

    # Verify bun permission
    if jq -r '.permissions.allow[]' "$CLAUDE_DIR/settings.json" 2>/dev/null | grep -q 'Bash(bun'; then
        pass "bun permission in allow list"
    else
        fail "bun permission missing from allow list"
    fi
}

# --- Test: MCP Config ---
test_mcp_config() {
    print_header "MCP Configuration"

    assert_file "$HOME/.mcp.json" ".mcp.json"

    # Verify it's valid JSON
    if jq empty "$HOME/.mcp.json" 2>/dev/null; then
        pass ".mcp.json is valid JSON"
    else
        fail ".mcp.json is invalid JSON"
        return
    fi

    # Verify cognitive-memory server entry
    assert_json_contains "$HOME/.mcp.json" '.mcpServers["cognitive-memory"]' "cognitive-memory server configured"

    # Verify COGNITIVE_MEMORY_PATH points to memory path
    local mem_path
    mem_path=$(jq -r '.mcpServers["cognitive-memory"].env.COGNITIVE_MEMORY_PATH // empty' "$HOME/.mcp.json" 2>/dev/null)
    if [ "$mem_path" = "$MEMORY_PATH" ]; then
        pass "COGNITIVE_MEMORY_PATH points to $MEMORY_PATH"
    else
        fail "COGNITIVE_MEMORY_PATH: expected $MEMORY_PATH, got '$mem_path'"
    fi
}

# --- Test: Backups ---
test_backup() {
    print_header "Backup Functionality"

    # Create pre-existing config
    mkdir -p "$CLAUDE_DIR/skills/old-skill"
    echo "old" > "$CLAUDE_DIR/skills/old-skill/SKILL.md"
    echo '{"existing": true}' > "$CLAUDE_DIR/settings.json"

    # Re-run setup
    info "Re-running setup with existing config..."
    printf "y\n$MEMORY_PATH\ny\nn\n" | node setup.mjs 2>/dev/null || true

    # Check backups exist
    local skills_backup
    skills_backup=$(find "$CLAUDE_DIR" -maxdepth 1 -name "skills_backup_*" -type d | head -1)
    if [ -n "$skills_backup" ]; then
        pass "Skills backup created"
    else
        fail "Skills backup not created"
    fi

    local settings_backup
    settings_backup=$(find "$CLAUDE_DIR" -maxdepth 1 -name "settings_backup_*.json" | head -1)
    if [ -n "$settings_backup" ]; then
        pass "Settings backup created"
        if jq -e '.existing' "$settings_backup" >/dev/null 2>&1; then
            pass "Settings backup contains original content"
        else
            fail "Settings backup missing original content"
        fi
    else
        fail "Settings backup not created"
    fi
}

# --- Test: No CLAUDE.md ---
test_no_claude_md() {
    print_header "No CLAUDE.md"

    if [ -f "$CLAUDE_DIR/CLAUDE.md" ]; then
        fail "CLAUDE.md exists (should not be created)"
    else
        pass "No CLAUDE.md file (correct - using skills/agents/hooks architecture)"
    fi
}

# --- Test: MCP Server ---
test_mcp_server() {
    print_header "MCP Server Installation"

    assert_dir "$MCP_SERVER_DIR/cognitive-memory" "cognitive-memory server directory"
    assert_file "$MCP_SERVER_DIR/cognitive-memory/src/cognitive-server.js" "cognitive-server.js"
    assert_dir "$MCP_SERVER_DIR/cognitive-memory/node_modules" "node_modules installed"
}

# --- Main ---
main() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}  Claude Code Starter Template Tests${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""

    cleanup

    # Run setup with test memory path (using node setup.mjs)
    info "Running node setup.mjs..."
    printf "y\n$MEMORY_PATH\nn\n" | node setup.mjs 2>/dev/null || {
        fail "setup.mjs exited with error"
    }

    # Run all test suites
    test_skills
    test_hooks
    test_agents
    test_memory_seed
    test_settings
    test_mcp_config
    test_no_claude_md
    test_mcp_server
    test_backup

    # Summary
    print_header "RESULTS"

    local total=$((TESTS_PASSED + TESTS_FAILED))
    echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
    echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
    echo -e "  Total:  $total"
    echo ""

    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}  ALL TESTS PASSED${NC}"
        exit 0
    else
        echo -e "${RED}  SOME TESTS FAILED${NC}"
        exit 1
    fi
}

main "$@"

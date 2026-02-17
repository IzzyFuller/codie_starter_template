#!/bin/bash
# PostToolUse hook - Automatic session note-taking gate
# Captures tool use and creates pre-formatted session note reminder

LOGFILE="/tmp/claude-hook-session-notes.log"
echo "=== PostToolUse hook invoked at $(date) ===" >> "$LOGFILE"

# Read tool use details from stdin
TOOL_INPUT=$(cat)
echo "Tool input: $TOOL_INPUT" >> "$LOGFILE"

# Extract key details using jq
TOOL_NAME=$(echo "$TOOL_INPUT" | jq -r '.tool_name // "unknown"')
TOOL_STATUS=$(echo "$TOOL_INPUT" | jq -r '.status // "unknown"')
SESSION_ID=$(echo "$TOOL_INPUT" | jq -r '.session_id // "unknown"')

echo "Tool: $TOOL_NAME, Status: $TOOL_STATUS" >> "$LOGFILE"

# Skip session note tools themselves to avoid recursion
if [[ "$TOOL_NAME" == *"add_session_note"* ]]; then
  echo "Skipping - this is session note tool itself" >> "$LOGFILE"
  exit 0
fi

# For gateway calls, check if it's calling cognitive-memory add_session_note
if [[ "$TOOL_NAME" == "mcp__agent-mcp-gateway__execute_tool" ]]; then
  MCP_SERVER=$(echo "$TOOL_INPUT" | jq -r '.tool_input.server // ""')
  MCP_TOOL=$(echo "$TOOL_INPUT" | jq -r '.tool_input.tool // ""')

  # FAIL-FAST: Log warning if we can't parse the structure
  if [[ -z "$MCP_SERVER" ]] || [[ -z "$MCP_TOOL" ]]; then
    echo "WARNING: Cannot parse gateway tool structure - assuming non-session-note" >> "$LOGFILE"
    echo "  This may indicate a Claude Code JSON structure change" >> "$LOGFILE"
    # Continue with warning logged
  elif [[ "$MCP_SERVER" == "cognitive-memory" ]] && [[ "$MCP_TOOL" == "add_session_note" ]]; then
    echo "Skipping - gateway call to add_session_note" >> "$LOGFILE"
    exit 0
  fi
fi

# Skip TodoWrite (meta-tracking, not actual work)
if [[ "$TOOL_NAME" == "TodoWrite" ]]; then
  echo "Skipping - TodoWrite is meta-tracking" >> "$LOGFILE"
  exit 0
fi

# Skip if tool failed
if [[ "$TOOL_STATUS" != "success" ]] && [[ "$TOOL_STATUS" != "unknown" ]]; then
  echo "Skipping - tool did not succeed" >> "$LOGFILE"
  exit 0
fi

# All other tools warrant session notes
echo "Tool warrants session note" >> "$LOGFILE"

# Auto-categorize note type based on tool
NOTE_TYPE="context"
if [[ "$TOOL_NAME" == *"Read"* ]] || [[ "$TOOL_NAME" == *"Grep"* ]] || [[ "$TOOL_NAME" == *"Glob"* ]]; then
  NOTE_TYPE="insight"
elif [[ "$TOOL_NAME" == *"Edit"* ]] || [[ "$TOOL_NAME" == *"Write"* ]]; then
  NOTE_TYPE="context"
elif [[ "$TOOL_NAME" == *"Task"* ]] || [[ "$TOOL_NAME" == *"Skill"* ]]; then
  NOTE_TYPE="insight"
elif [[ "$TOOL_NAME" == *"Bash"* ]]; then
  # Git operations are decisions, others are context
  if echo "$TOOL_INPUT" | grep -q "git commit\|git push\|git checkout"; then
    NOTE_TYPE="decision"
  else
    NOTE_TYPE="context"
  fi
fi

# Create context injection for Claude (injected into conversation context)
# NOTE: Must tell Claude to call the MCP tool directly, not invoke the Skill (which just loads instructions)
ADDITIONAL_CONTEXT="<system-reminder>PostToolUse: Call mcp__agent-mcp-gateway__execute_tool with server='cognitive-memory', tool='add_session_note' to record what $TOOL_NAME just accomplished (note_type: $NOTE_TYPE). Include brief summary of what was done/discovered.</system-reminder>"

echo "Additional context created" >> "$LOGFILE"

# Return JSON with additionalContext (injected into Claude's context, not just user warning)
jq -n \
  --arg context "$ADDITIONAL_CONTEXT" \
  '{
    continue: true,
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: $context
    }
  }'

exit 0

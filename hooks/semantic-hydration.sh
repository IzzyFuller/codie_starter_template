#!/bin/bash
# Semantic Hydration Hook - triggers Codie to use semantic-reflection skill
# No external API calls - just injects instruction for Codie to execute

# Skip if identity-restoration just completed (session start)
MARKER="/tmp/codie-session-hydrated"
if [ -f "$MARKER" ]; then
    AGE=$(( $(date +%s) - $(stat -f %m "$MARKER") ))
    if [ "$AGE" -lt 120 ]; then
        exit 0
    fi
fi

input=$(cat)
PROMPT=$(echo "$input" | jq -r '.prompt // empty')

# Skip very short prompts or simple acknowledgments
if [ ${#PROMPT} -lt 30 ]; then
    exit 0
fi

if echo "$PROMPT" | grep -qiE "^(yes|no|ok|thanks|sure|good|great|correct|right|yep|nope|yeah|nah)"; then
    exit 0
fi

# Inject instruction to use semantic-reflection skill
cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "IMPORTANT: Before responding, invoke the semantic-reflection skill to search memory for relevant context, patterns, and learnings that apply to this request."
  }
}
EOF

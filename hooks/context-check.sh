#!/bin/bash
# Context Check Hook - monitors context usage and triggers refresh when high
# Stop hook: runs after Claude completes a response

LOGFILE="/tmp/claude-context-check.log"
RAWLOG="/tmp/claude-context-raw.log"
echo "=== Context Check $(date) ===" >> "$LOGFILE"

input=$(cat)
echo "=== RAW INPUT $(date) ===" >> "$RAWLOG"
echo "$input" >> "$RAWLOG"
CONTEXT_PERCENT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
TOTAL_INPUT=$(echo "$input" | jq -r '.context_window.total_input_tokens // 0')
TOTAL_OUTPUT=$(echo "$input" | jq -r '.context_window.total_output_tokens // 0')

echo "Context: ${CONTEXT_PERCENT}% (input: $TOTAL_INPUT, output: $TOTAL_OUTPUT)" >> "$LOGFILE"

# Threshold for context warning
THRESHOLD=70

if [ "$CONTEXT_PERCENT" -ge "$THRESHOLD" ]; then
    echo "Context above threshold! Triggering refresh..." >> "$LOGFILE"

    # Block stopping and instruct Claude to take note then trigger context clear
    cat << 'EOF'
{
    "decision": "block",
    "reason": "CONTEXT REFRESH REQUIRED - DO THIS NOW:

1. Take a session note summarizing current work state and next steps using cognitive-memory

2. Call ExitPlanMode to trigger the context clear confirmation

The confirmation will allow the user to approve clearing context. After clearing, identity-continuity protocol will restore context on the next prompt."
}
EOF
    exit 0
fi

# Context OK - allow stop
echo "Context OK at ${CONTEXT_PERCENT}%" >> "$LOGFILE"
exit 0

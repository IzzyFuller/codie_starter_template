#!/bin/bash
# Session Start Restore Hook - triggers identity restoration after compact/clear

LOGFILE="/tmp/claude-session-start.log"
echo "=== Session Start $(date) ===" >> "$LOGFILE"

input=$(cat)
SOURCE=$(echo "$input" | jq -r '.source // "unknown"')

echo "Source: $SOURCE" >> "$LOGFILE"

if [ "$SOURCE" = "startup" ] || [ "$SOURCE" = "compact" ] || [ "$SOURCE" = "clear" ] || [ "$SOURCE" = "resume" ]; then
    echo "Triggering identity restoration for $SOURCE..." >> "$LOGFILE"

    printf '%s\n' '{
    "additionalContext": "IDENTITY RESTORATION REQUIRED. Follow identity-continuity protocol NOW."
}'
    exit 0
fi

echo "Normal session start, no restoration needed" >> "$LOGFILE"
exit 0

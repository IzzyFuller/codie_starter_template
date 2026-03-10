#!/usr/bin/env node

// PostToolUse hook — triggers session note-taking after tool use
// Skips: add_session_note (recursion), get_server_tools (discovery),
// cognitive-memory and qmd calls (memory plumbing).

import { readFileSync } from 'node:fs';

function main() {
  let input;
  try {
    input = JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    process.exit(0);
  }

  const toolName = input.tool_name ?? 'unknown';

  // Skip add_session_note to prevent recursion
  if (toolName.includes('add_session_note')) {
    process.exit(0);
  }

  // Skip cognitive-memory and qmd calls — memory plumbing, not meaningful work
  if (toolName.startsWith('mcp__cognitive-memory__') || toolName.startsWith('mcp__qmd__')) {
    process.exit(0);
  }

  const result = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext:
        `Take a session note about what ${toolName} accomplished. Follow the session-note-taking protocol.`,
    },
  };

  console.log(JSON.stringify(result));
}

main();

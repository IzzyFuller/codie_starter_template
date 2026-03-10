#!/usr/bin/env node

// PostToolUse hook — triggers session note-taking after tool use
// Skips: add_session_note (recursion), get_server_tools (discovery),
// cognitive-memory and qmd gateway calls (memory plumbing).
// Context7 and other gateway servers still trigger notes.

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

  // Skip get_server_tools entirely — discovery, not meaningful work
  if (toolName === 'mcp__agent-mcp-gateway__get_server_tools') {
    process.exit(0);
  }

  // For gateway execute_tool, skip cognitive-memory and qmd (memory plumbing)
  // Context7 and other servers still trigger notes
  if (toolName === 'mcp__agent-mcp-gateway__execute_tool') {
    const server = input.tool_input?.server ?? '';
    const skippedServers = ['cognitive-memory', 'qmd'];
    if (skippedServers.includes(server)) {
      process.exit(0);
    }
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

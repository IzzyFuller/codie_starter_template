#!/usr/bin/env node

// PostToolUse hook — triggers session note-taking after tool use
// Skips: add_session_note (recursion),
// cognitive-memory and qmd calls (memory plumbing),
// Read/Glob/Bash/ToolSearch (research/filesystem exploration).

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

  // Skip Read, Glob, Bash, ToolSearch — research/filesystem exploration, not work units
  const researchTools = ['Read', 'Glob', 'Bash', 'ToolSearch'];
  if (researchTools.includes(toolName)) {
    process.exit(0);
  }

  const result = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext:
        `MANDATORY SESSION NOTE — DO NOT SKIP. You MUST spawn a session-notes agent RIGHT NOW to record what ${toolName} accomplished BEFORE continuing with any other work. This is a BLOCKING requirement. Skipping this is a documented chronic anti-pattern (skipping-session-notes-during-mechanical-work). If you skip this note, you are failing a core behavioral requirement. Spawn the agent, then proceed.`,
    },
  };

  console.log(JSON.stringify(result));
}

main();

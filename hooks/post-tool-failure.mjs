#!/usr/bin/env node

// PostToolUseFailure hook — on MCP tool failures,
// inject instruction to read tool definition before retrying.
// Addresses chronic anti-pattern: hallucinating-tool-parameters.

import { readFileSync } from 'node:fs';

function main() {
  let input;
  try {
    input = JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    process.exit(0);
  }

  const toolName = input.tool_name ?? '';

  // Only intercept MCP tool failures (cognitive-memory, qmd, etc.)
  if (!toolName.startsWith('mcp__')) {
    process.exit(0);
  }

  const result = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUseFailure',
      additionalContext:
        `STOP. Tool call to ${toolName} failed. Before retrying, verify the correct parameter names and types. Do NOT guess — check the tool definition.`,
    },
  };

  console.log(JSON.stringify(result));
}

main();

#!/usr/bin/env node

// PostToolUseFailure hook — on MCP gateway tool failures,
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

  // Only intercept gateway execute_tool failures
  if (toolName !== 'mcp__agent-mcp-gateway__execute_tool') {
    process.exit(0);
  }

  const server = input.tool_input.server;
  const tool = input.tool_input.tool;

  const result = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUseFailure',
      additionalContext:
        `STOP. Tool call to ${server}/${tool} failed. Before retrying, call get_server_tools for server "${server}" and read the definition for "${tool}". Verify the correct parameter names and types. Do NOT guess — read the definition.`,
    },
  };

  console.log(JSON.stringify(result));
}

main();

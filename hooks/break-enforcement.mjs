#!/usr/bin/env node

// UserPromptSubmit hook — triggers break-enforcement agent before every response.
// Passes current timestamp so the agent can check session note history
// and return the appropriate escalation level instruction.

import { readFileSync } from 'node:fs';

function main() {
  let prompt = '';
  try {
    const input = JSON.parse(readFileSync(0, 'utf-8'));
    prompt = (input.prompt ?? '').trim();
  } catch {
    process.exit(0);
  }

  // Skip system content
  if (!prompt || /^<[a-z][a-z0-9-]*[\s>]/i.test(prompt)) {
    process.exit(0);
  }

  const now = new Date().toISOString();

  const result = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext:
        `Spawn a background break-enforcement agent. Current timestamp: ${now}. User prompt: "${prompt}". The agent should read protocols/break-enforcement from cognitive-memory, check session note timestamps, and return an instruction on what insistence level to follow (or nothing if no break is needed).`,
    },
  };

  console.log(JSON.stringify(result));
}

main();

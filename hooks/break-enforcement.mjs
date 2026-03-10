#!/usr/bin/env node

// UserPromptSubmit hook — triggers break-enforcement agent before every response.

import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf-8'));
const prompt = (input.prompt ?? '').trim();

// Skip system content
if (!prompt || /^<[a-z][a-z0-9-]*[\s>]/i.test(prompt)) {
  process.exit(0);
}

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext:
      `Spawn a background break-enforcement agent. Current timestamp: ${new Date().toISOString()}. User prompt: "${prompt}".`,
  },
}));

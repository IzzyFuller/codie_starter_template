#!/usr/bin/env node

// UserPromptSubmit hook — triggers break-enforcement agent before every response.

import { readFileSync, appendFileSync } from 'node:fs';
import { homedir } from 'node:os';

const input = JSON.parse(readFileSync(0, 'utf-8'));
const prompt = (input.prompt ?? '').trim();

// Skip system content
if (!prompt || /^<[a-z][a-z0-9-]*[\s>]/i.test(prompt)) {
  process.exit(0);
}

// Best-effort: append USER_ACTIVE marker to current_session memory file.
// try/catch is required — directory may not exist on fresh installs before setup runs.
const memoryPath = process.env.COGNITIVE_MEMORY_PATH ?? `${homedir()}/Codie/memory`;
try {
  appendFileSync(
    `${memoryPath}/current_session.md`,
    `\nUSER_ACTIVE ${new Date().toISOString()}\n`
  );
} catch { /* directory missing — skip silently, hook still emits agent spawn */ }

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext:
      `Spawn a background break-enforcement agent. Current timestamp: ${new Date().toISOString()}. User prompt: "${prompt}".`,
  },
}));

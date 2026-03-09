#!/usr/bin/env node

// Semantic Hydration Hook — triggers background semantic-reflection agent
// Reads the user's prompt from stdin and passes it in the instruction
// so the main agent doesn't have to paraphrase.

import { readFileSync } from 'node:fs';

function main() {
  let prompt = '';
  try {
    const input = JSON.parse(readFileSync(0, 'utf-8'));
    prompt = (input.prompt ?? '').trim();
  } catch {
    // If we can't read stdin, still fire — main agent has the prompt in context
  }

  // Skip if prompt is system content (task notifications, system reminders, etc.) not a real user message
  // Matches any string starting with an XML-like tag: <tag-name ...>
  if (!prompt || /^<[a-z][a-z0-9-]*[\s>]/i.test(prompt)) {
    process.exit(0);
  }

  const instruction = `Spawn a background semantic-reflection agent. User prompt: "${prompt}". Include relevant conversation context so the agent can search memory effectively.`;

  const result = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: instruction,
    },
  };

  console.log(JSON.stringify(result));
}

main();

#!/usr/bin/env node

// Semantic Hydration Hook — triggers Codie to use semantic-reflection skill
// No external API calls — just injects instruction for Codie to execute
// Cross-platform Node.js replacement for semantic-hydration.sh

import { readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function main() {
  // Skip if identity-restoration just completed (session start)
  const marker = join(tmpdir(), 'codie-session-hydrated');
  try {
    const mtime = statSync(marker).mtimeMs;
    const ageSeconds = (Date.now() - mtime) / 1000;
    if (ageSeconds < 120) {
      process.exit(0);
    }
  } catch {
    // Marker doesn't exist — continue
  }

  let input;
  try {
    const raw = readFileSync(0, 'utf-8');
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const prompt = input.prompt ?? '';

  // Skip very short prompts or simple acknowledgments
  if (prompt.length < 30) {
    process.exit(0);
  }

  if (/^(yes|no|ok|thanks|sure|good|great|correct|right|yep|nope|yeah|nah)/i.test(prompt)) {
    process.exit(0);
  }

  // Inject instruction to use semantic-reflection skill
  const result = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext:
        'IMPORTANT: Before responding, invoke the semantic-reflection skill to search memory for relevant context, patterns, and learnings that apply to this request.',
    },
  };

  console.log(JSON.stringify(result));
}

main();

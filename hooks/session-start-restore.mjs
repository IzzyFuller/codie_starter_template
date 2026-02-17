#!/usr/bin/env node

// Session Start Restore Hook — triggers identity restoration after compact/clear
// Cross-platform Node.js replacement for session-start-restore.sh

import { readFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LOGFILE = join(tmpdir(), 'claude-session-start.log');

function log(msg) {
  try {
    appendFileSync(LOGFILE, `${msg}\n`);
  } catch {
    // Logging is best-effort
  }
}

function main() {
  log(`=== Session Start ${new Date().toISOString()} ===`);

  let input;
  try {
    const raw = readFileSync(0, 'utf-8');
    input = JSON.parse(raw);
  } catch (e) {
    log(`Failed to parse stdin: ${e.message}`);
    process.exit(0);
  }

  const source = input.source ?? 'unknown';
  log(`Source: ${source}`);

  if (['startup', 'compact', 'clear', 'resume'].includes(source)) {
    log(`Triggering identity restoration for ${source}...`);

    const result = {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: 'IDENTITY RESTORATION REQUIRED. Follow identity-continuity protocol NOW.',
      },
    };

    console.log(JSON.stringify(result));
    process.exit(0);
  }

  log('Normal session start, no restoration needed');
}

main();

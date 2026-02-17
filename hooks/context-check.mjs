#!/usr/bin/env node

// Context Check Hook — monitors context usage and triggers refresh when high
// Stop hook: runs after Claude completes a response
// Cross-platform Node.js replacement for context-check.sh

import { readFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LOGFILE = join(tmpdir(), 'claude-context-check.log');
const RAWLOG = join(tmpdir(), 'claude-context-raw.log');
const THRESHOLD = 70;

function log(file, msg) {
  try {
    appendFileSync(file, `${msg}\n`);
  } catch {
    // Logging is best-effort
  }
}

function main() {
  log(LOGFILE, `=== Context Check ${new Date().toISOString()} ===`);

  let input;
  try {
    const raw = readFileSync(0, 'utf-8');
    log(RAWLOG, `=== RAW INPUT ${new Date().toISOString()} ===`);
    log(RAWLOG, raw);
    input = JSON.parse(raw);
  } catch (e) {
    log(LOGFILE, `Failed to parse stdin: ${e.message}`);
    process.exit(0);
  }

  const contextPercent = Math.floor(input.context_window?.used_percentage ?? 0);
  const totalInput = input.context_window?.total_input_tokens ?? 0;
  const totalOutput = input.context_window?.total_output_tokens ?? 0;

  log(LOGFILE, `Context: ${contextPercent}% (input: ${totalInput}, output: ${totalOutput})`);

  if (contextPercent >= THRESHOLD) {
    log(LOGFILE, 'Context above threshold! Triggering refresh...');

    const result = {
      decision: 'block',
      reason: `CONTEXT REFRESH REQUIRED - DO THIS NOW:

1. Take a session note summarizing current work state and next steps using cognitive-memory

2. Call ExitPlanMode to trigger the context clear confirmation

The confirmation will allow the user to approve clearing context. After clearing, identity-continuity protocol will restore context on the next prompt.`,
    };

    console.log(JSON.stringify(result));
    process.exit(0);
  }

  // Context OK — allow stop
  log(LOGFILE, `Context OK at ${contextPercent}%`);
}

main();

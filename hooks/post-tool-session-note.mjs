#!/usr/bin/env node

// PostToolUse hook — Automatic session note-taking gate
// Captures tool use and creates pre-formatted session note reminder
// Cross-platform Node.js replacement for post-tool-session-note.sh

import { readFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LOGFILE = join(tmpdir(), 'claude-hook-session-notes.log');

function log(msg) {
  try {
    appendFileSync(LOGFILE, `${msg}\n`);
  } catch {
    // Logging is best-effort
  }
}

function main() {
  log(`=== PostToolUse hook invoked at ${new Date().toISOString()} ===`);

  let input;
  try {
    const raw = readFileSync(0, 'utf-8');
    input = JSON.parse(raw);
  } catch (e) {
    log(`Failed to parse stdin: ${e.message}`);
    process.exit(0);
  }

  const toolName = input.tool_name ?? 'unknown';
  const toolStatus = input.status ?? 'unknown';

  log(`Tool: ${toolName}, Status: ${toolStatus}`);

  // Skip session note tools themselves to avoid recursion
  if (toolName.includes('add_session_note')) {
    log('Skipping - this is session note tool itself');
    process.exit(0);
  }

  // For gateway calls, check if it's calling cognitive-memory add_session_note
  if (toolName === 'mcp__agent-mcp-gateway__execute_tool') {
    const mcpServer = input.tool_input?.server ?? '';
    const mcpTool = input.tool_input?.tool ?? '';

    if (!mcpServer || !mcpTool) {
      log('WARNING: Cannot parse gateway tool structure - assuming non-session-note');
      log('  This may indicate a Claude Code JSON structure change');
      // Continue with warning logged
    } else if (mcpServer === 'cognitive-memory' && mcpTool === 'add_session_note') {
      log('Skipping - gateway call to add_session_note');
      process.exit(0);
    }
  }

  // Skip TodoWrite (meta-tracking, not actual work)
  if (toolName === 'TodoWrite') {
    log('Skipping - TodoWrite is meta-tracking');
    process.exit(0);
  }

  // Skip if tool failed
  if (toolStatus !== 'success' && toolStatus !== 'unknown') {
    log('Skipping - tool did not succeed');
    process.exit(0);
  }

  // All other tools warrant session notes
  log('Tool warrants session note');

  // Auto-categorize note type based on tool
  let noteType = 'context';
  if (/Read|Grep|Glob/.test(toolName)) {
    noteType = 'insight';
  } else if (/Edit|Write/.test(toolName)) {
    noteType = 'context';
  } else if (/Task|Skill/.test(toolName)) {
    noteType = 'insight';
  } else if (/Bash/.test(toolName)) {
    const inputStr = JSON.stringify(input);
    if (/git commit|git push|git checkout/.test(inputStr)) {
      noteType = 'decision';
    }
  }

  // Create context injection for Claude
  const additionalContext =
    `<system-reminder>PostToolUse: Call mcp__agent-mcp-gateway__execute_tool with server='cognitive-memory', tool='add_session_note' to record what ${toolName} just accomplished (note_type: ${noteType}). Include brief summary of what was done/discovered.</system-reminder>`;

  log('Additional context created');

  // Return JSON with additionalContext
  const result = {
    continue: true,
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext,
    },
  };

  console.log(JSON.stringify(result));
}

main();

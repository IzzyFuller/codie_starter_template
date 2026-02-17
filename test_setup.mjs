#!/usr/bin/env node

// Cross-platform verification for setup.mjs output
// Runs on Node.js 20 — no dependencies beyond core modules

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const REPO_DIR = dirname(__filename);

const HOME = homedir();
const IS_WINDOWS = platform() === 'win32';
const CLAUDE_DIR = join(HOME, '.claude');
const MCP_SERVER_DIR = IS_WINDOWS
  ? join(process.env.APPDATA || join(HOME, 'AppData', 'Roaming'), 'claude-mcp-servers')
  : join(HOME, '.local', 'share', 'claude-mcp-servers');

// setup.mjs defaults to ~/claude-memory when you press enter on a blank prompt
const MEMORY_PATH = join(HOME, 'claude-memory');

// Derive expected counts from the repo source directories — the same dirs setup.mjs copies from
const EXPECTED_SKILLS = readdirSync(join(REPO_DIR, 'skills'), { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(REPO_DIR, 'skills', d.name, 'SKILL.md')))
  .length;
const EXPECTED_HOOKS = readdirSync(join(REPO_DIR, 'hooks'))
  .filter(f => f.endsWith('.mjs'))
  .length;
const EXPECTED_AGENTS = readdirSync(join(REPO_DIR, 'agents'))
  .filter(f => f.endsWith('.md'))
  .length;

let passed = 0;
let failed = 0;

// --- Helpers ---

function pass(msg) {
  console.log(`  \x1b[32mPASS\x1b[0m ${msg}`);
  passed++;
}

function fail(msg) {
  console.log(`  \x1b[31mFAIL\x1b[0m ${msg}`);
  failed++;
}

function header(msg) {
  console.log(`\n\x1b[34m=== ${msg} ===\x1b[0m\n`);
}

function assertDir(dir, desc) {
  existsSync(dir) && statSync(dir).isDirectory() ? pass(desc) : fail(`${desc}: ${dir}`);
}

function assertFile(file, desc) {
  existsSync(file) && statSync(file).isFile() ? pass(desc) : fail(`${desc}: ${file}`);
}

/** Count files matching an extension in a directory (non-recursive). */
function countByExt(dir, ext) {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter(f => f.endsWith(ext)).length;
}

/** Count entries (files only) in a directory, optionally recursive. */
function countFiles(dir, ext = null, recursive = false) {
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && recursive) {
      count += countFiles(join(dir, entry.name), ext, true);
    } else if (entry.isFile()) {
      if (!ext || entry.name.endsWith(ext)) count++;
    }
  }
  return count;
}

/** Recursively search for a literal string in all files under dir. */
function findLiteral(dir, literal) {
  if (!existsSync(dir)) return [];
  const hits = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      hits.push(...findLiteral(full, literal));
    } else if (entry.isFile()) {
      try {
        const content = readFileSync(full, 'utf-8');
        if (content.includes(literal)) hits.push(full);
      } catch { /* skip unreadable */ }
    }
  }
  return hits;
}

function assertNoLiteral(dir, literal, desc) {
  const hits = findLiteral(dir, literal);
  if (hits.length === 0) {
    pass(desc);
  } else {
    fail(`${desc}: found in ${hits.length} file(s) — ${hits.slice(0, 3).join(', ')}`);
  }
}

function parseJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// --- Tests ---

function testSkills() {
  header(`Skills (expect ${EXPECTED_SKILLS} from repo)`);
  assertDir(join(CLAUDE_DIR, 'skills'), 'skills/ exists');

  const skillDir = join(CLAUDE_DIR, 'skills');
  const actual = countFiles(skillDir, 'SKILL.md', true);
  actual >= EXPECTED_SKILLS
    ? pass(`SKILL.md count: ${actual} (expected >= ${EXPECTED_SKILLS})`)
    : fail(`SKILL.md count: expected >= ${EXPECTED_SKILLS}, got ${actual}`);

  assertNoLiteral(skillDir, '{{MEMORY_PATH}}', 'No {{MEMORY_PATH}} placeholders in skills');
  assertNoLiteral(skillDir, '{{PARTNER_NAME}}', 'No {{PARTNER_NAME}} placeholders in skills');
}

function testHooks() {
  header(`Hooks (expect ${EXPECTED_HOOKS} .mjs files from repo)`);
  assertDir(join(CLAUDE_DIR, 'hooks'), 'hooks/ exists');

  const hookDir = join(CLAUDE_DIR, 'hooks');
  const actual = countByExt(hookDir, '.mjs');
  actual >= EXPECTED_HOOKS
    ? pass(`Hook .mjs count: ${actual} (expected >= ${EXPECTED_HOOKS})`)
    : fail(`Hook .mjs count: expected >= ${EXPECTED_HOOKS}, got ${actual}`);

  // Verify each repo hook was installed
  const repoHooks = readdirSync(join(REPO_DIR, 'hooks')).filter(f => f.endsWith('.mjs'));
  for (const name of repoHooks) {
    assertFile(join(hookDir, name), `Hook: ${name}`);
  }
}

function testAgents() {
  header(`Agents (expect ${EXPECTED_AGENTS} from repo)`);
  assertDir(join(CLAUDE_DIR, 'agents'), 'agents/ exists');

  const agentDir = join(CLAUDE_DIR, 'agents');
  const actual = countByExt(agentDir, '.md');
  actual >= EXPECTED_AGENTS
    ? pass(`Agent .md count: ${actual} (expected >= ${EXPECTED_AGENTS})`)
    : fail(`Agent .md count: expected >= ${EXPECTED_AGENTS}, got ${actual}`);

  assertNoLiteral(agentDir, '{{MEMORY_PATH}}', 'No {{MEMORY_PATH}} placeholders in agents');
  assertNoLiteral(agentDir, '{{PARTNER_NAME}}', 'No {{PARTNER_NAME}} placeholders in agents');
}

function testSettings() {
  header('Settings');
  const settingsPath = join(CLAUDE_DIR, 'settings.json');
  assertFile(settingsPath, 'settings.json exists');

  const settings = parseJSON(settingsPath);
  if (!settings) {
    fail('settings.json is valid JSON');
    return;
  }
  pass('settings.json is valid JSON');

  // All 4 hook event types present
  const hookEvents = ['PostToolUse', 'UserPromptSubmit', 'SessionStart', 'Stop'];
  for (const evt of hookEvents) {
    const hooks = settings.hooks?.[evt];
    if (Array.isArray(hooks) && hooks.length > 0) {
      pass(`Hook event: ${evt}`);
    } else {
      fail(`Hook event missing: ${evt}`);
    }
  }

  // All hook commands use 'node'
  for (const evt of hookEvents) {
    const cmd = settings.hooks?.[evt]?.[0]?.command || '';
    if (cmd.startsWith('node ')) {
      pass(`${evt} uses node command`);
    } else {
      fail(`${evt} should use node command, got: ${cmd}`);
    }
  }
}

function testMcpConfig() {
  header('MCP Configuration');
  const mcpPath = join(HOME, '.mcp.json');
  assertFile(mcpPath, '.mcp.json exists');

  const mcp = parseJSON(mcpPath);
  if (!mcp) {
    fail('.mcp.json is valid JSON');
    return;
  }
  pass('.mcp.json is valid JSON');

  const cogMem = mcp.mcpServers?.['cognitive-memory'];
  cogMem ? pass('cognitive-memory entry exists') : fail('cognitive-memory entry missing');

  if (cogMem) {
    const cmd = cogMem.command;
    cmd === 'node' ? pass('cognitive-memory uses node command') : fail(`cognitive-memory command: expected node, got ${cmd}`);

    const serverPath = (cogMem.args || [])[0] || '';
    const expectedSuffix = join('cognitive-memory', 'src', 'cognitive-server.js');
    serverPath.includes(expectedSuffix)
      ? pass('cognitive-memory server path correct')
      : fail(`cognitive-memory server path: expected to contain ${expectedSuffix}, got ${serverPath}`);

    // Verify platform-appropriate path prefix
    if (IS_WINDOWS) {
      serverPath.includes('AppData')
        ? pass('MCP server path uses APPDATA (Windows)')
        : fail(`MCP server path should use APPDATA on Windows: ${serverPath}`);
    } else {
      serverPath.includes('.local/share')
        ? pass('MCP server path uses ~/.local/share (Unix)')
        : fail(`MCP server path should use ~/.local/share on Unix: ${serverPath}`);
    }
  }
}

function testMcpServer() {
  header('MCP Server Installation');
  const serverDir = join(MCP_SERVER_DIR, 'cognitive-memory');
  assertDir(serverDir, 'cognitive-memory server directory');
  assertFile(join(serverDir, 'src', 'cognitive-server.js'), 'cognitive-server.js');
  assertDir(join(serverDir, 'node_modules'), 'node_modules installed');
}

function testMemorySeed() {
  header('Memory Seed');
  assertFile(join(MEMORY_PATH, 'me.md'), 'me.md');
  assertFile(join(MEMORY_PATH, 'frame.md'), 'frame.md');
  assertFile(join(MEMORY_PATH, 'context_anchors.md'), 'context_anchors.md');

  // No placeholder leaks in memory
  assertNoLiteral(MEMORY_PATH, '{{MEMORY_PATH}}', 'No {{MEMORY_PATH}} in memory');
  assertNoLiteral(MEMORY_PATH, '{{PARTNER_NAME}}', 'No {{PARTNER_NAME}} in memory');
  assertNoLiteral(MEMORY_PATH, '{{NAMESAKE_SECTION}}', 'No {{NAMESAKE_SECTION}} in memory');
}

// --- Main ---

console.log('\x1b[34m======================================\x1b[0m');
console.log('\x1b[34m  Setup Verification (cross-platform)\x1b[0m');
console.log('\x1b[34m======================================\x1b[0m');

testSkills();
testHooks();
testAgents();
testSettings();
testMcpConfig();
testMcpServer();
testMemorySeed();

// Summary
header('RESULTS');
const total = passed + failed;
console.log(`  \x1b[32mPassed: ${passed}\x1b[0m`);
console.log(`  \x1b[31mFailed: ${failed}\x1b[0m`);
console.log(`  Total:  ${total}\n`);

if (failed > 0) {
  console.log('\x1b[31m  SOME TESTS FAILED\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m  ALL TESTS PASSED\x1b[0m\n');
}

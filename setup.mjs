#!/usr/bin/env node

// Claude Code Starter Template Setup Script
// Installs skills, agents, hooks, memory seed, and cognitive-memory MCP server
// Cross-platform Node.js replacement for setup.sh
// Version: 4.0

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { homedir, platform, tmpdir } from 'node:os';
import { join, basename, resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

// --- Constants ---

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);

const HOME = homedir();
const IS_WINDOWS = platform() === 'win32';
const CLAUDE_DIR = join(HOME, '.claude');
const MCP_SERVER_DIR = IS_WINDOWS
  ? join(process.env.APPDATA || join(HOME, 'AppData', 'Roaming'), 'claude-mcp-servers')
  : join(HOME, '.local', 'share', 'claude-mcp-servers');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

let MEMORY_PATH = '';
let PARTNER_NAME = '';
let NAMESAKE = null;

// --- Colors (ANSI, disabled on Windows cmd without color support) ---

const supportsColor = !IS_WINDOWS || process.env.TERM || process.env.WT_SESSION;
const c = {
  red: supportsColor ? '\x1b[0;31m' : '',
  green: supportsColor ? '\x1b[0;32m' : '',
  yellow: supportsColor ? '\x1b[1;33m' : '',
  blue: supportsColor ? '\x1b[0;34m' : '',
  nc: supportsColor ? '\x1b[0m' : '',
};

function printStatus(msg)  { console.error(`${c.blue}[INFO]${c.nc} ${msg}`); }
function printSuccess(msg) { console.error(`${c.green}[OK]${c.nc} ${msg}`); }
function printWarning(msg) { console.error(`${c.yellow}[WARN]${c.nc} ${msg}`); }
function printError(msg)   { console.error(`${c.red}[ERROR]${c.nc} ${msg}`); }

// --- Utilities ---

// Piped stdin (Docker, CI, echo | node setup.mjs) vs interactive TTY need
// completely different strategies. With piped input, readline fires 'close'
// the moment the pipe is exhausted, which kills the Node.js event loop before
// async steps can run. Fix: read all piped input upfront, shift lines per prompt.
const IS_TTY = process.stdin.isTTY;
let inputLines = [];
let rl;

if (IS_TTY) {
  rl = createInterface({ input: process.stdin, output: process.stderr });
} else {
  // Read entire piped input synchronously — no event loop dependency
  try {
    const raw = readFileSync(0, 'utf-8');
    inputLines = raw.split('\n');
  } catch {
    inputLines = [];
  }
}

function ask(question, defaultValue = '') {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  if (IS_TTY) {
    return new Promise((resolve) => {
      rl.question(`${question}${suffix}: `, (answer) => {
        resolve(answer.trim() || defaultValue);
      });
    });
  }
  // Piped: consume next pre-read line
  const line = inputLines.shift() || '';
  console.error(`${question}${suffix}: ${line}`);
  return Promise.resolve(line.trim() || defaultValue);
}

function closePrompts() {
  if (rl) rl.close();
}

function run(cmd, opts = {}) {
  const result = execSync(cmd, { encoding: 'utf-8', stdio: opts.stdio ?? 'pipe', ...opts });
  return result ? result.trim() : '';
}

function commandExists(cmd) {
  try {
    const check = IS_WINDOWS ? `where ${cmd}` : `command -v ${cmd}`;
    run(check);
    return true;
  } catch {
    return false;
  }
}

/** Deep merge b into a (b wins on conflicts). Arrays are replaced, not concatenated. */
function deepMerge(a, b) {
  const result = { ...a };
  for (const key of Object.keys(b)) {
    if (
      result[key] && typeof result[key] === 'object' && !Array.isArray(result[key]) &&
      typeof b[key] === 'object' && !Array.isArray(b[key])
    ) {
      result[key] = deepMerge(result[key], b[key]);
    } else {
      result[key] = b[key];
    }
  }
  return result;
}

/** Recursively copy a directory, substituting placeholders in file contents. */
function copyDirWithSubstitutions(src, dest, substitutions = {}) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirWithSubstitutions(srcPath, destPath, substitutions);
    } else {
      let content = readFileSync(srcPath, 'utf-8');
      for (const [placeholder, value] of Object.entries(substitutions)) {
        content = content.replaceAll(placeholder, value);
      }
      writeFileSync(destPath, content, 'utf-8');
    }
  }
}

/** Count files recursively in a directory. */
function countFiles(dir) {
  let count = 0;
  if (!existsSync(dir)) return 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      count += countFiles(join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

// --- Step 1: Prerequisites ---

function checkPrerequisites() {
  printStatus('Checking prerequisites...');
  let ok = true;

  if (!commandExists('node')) {
    printError('Node.js not found. Install Node.js 18+ from https://nodejs.org');
    ok = false;
  } else {
    const nodeVer = parseInt(process.versions.node.split('.')[0], 10);
    if (nodeVer < 18) {
      printError(`Node.js ${nodeVer} found, but 18+ required`);
      ok = false;
    } else {
      printSuccess(`Node.js v${process.versions.node}`);
    }
  }

  if (!commandExists('npm')) {
    printError('npm not found');
    ok = false;
  } else {
    printSuccess(`npm ${run('npm -v')}`);
  }

  if (!commandExists('git')) {
    printError('git not found');
    ok = false;
  } else {
    printSuccess(`git ${run('git --version').replace('git version ', '')}`);
  }

  if (!ok) {
    printError('Missing prerequisites. Install them and re-run.');
    process.exit(1);
  }
  console.error('');
}

// --- Step 2: Memory path and partner name ---

function loadNamesakes() {
  try {
    return JSON.parse(readFileSync(join(SCRIPT_DIR, 'namesakes.json'), 'utf-8'));
  } catch {
    return [];
  }
}

function pickNamesake(namesakes) {
  return namesakes[Math.floor(Math.random() * namesakes.length)];
}

function formatNamesakeIntro(ns) {
  const lines = [];
  lines.push(`${c.blue}┌─────────────────────────────────────────────┐${c.nc}`);
  lines.push(`${c.blue}│${c.nc}  Your AI partner is named for:               ${c.blue}│${c.nc}`);
  lines.push(`${c.blue}│${c.nc}                                               ${c.blue}│${c.nc}`);
  lines.push(`${c.blue}│${c.nc}  ${c.green}${ns.fullName}${c.nc} (${ns.years})`);
  lines.push(`${c.blue}│${c.nc}  ${ns.identity}`);
  lines.push(`${c.blue}│${c.nc}`);
  // Word-wrap bio to ~55 chars
  const words = ns.bio.split(' ');
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).length > 55) {
      lines.push(`${c.blue}│${c.nc}  ${line}`);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(`${c.blue}│${c.nc}  ${line}`);
  if (ns.quote) {
    lines.push(`${c.blue}│${c.nc}`);
    lines.push(`${c.blue}│${c.nc}  ${c.yellow}"${ns.quote}"${c.nc}`);
  }
  lines.push(`${c.blue}│${c.nc}`);
  lines.push(`${c.blue}└─────────────────────────────────────────────┘${c.nc}`);
  return lines.join('\n');
}

async function configureMemoryPath() {
  const defaultPath = join(HOME, 'claude-memory');
  printStatus('Where should your memory knowledge base live?');
  let userPath = await ask('Memory path', defaultPath);

  // Expand ~ if present
  if (userPath.startsWith('~')) {
    userPath = join(HOME, userPath.slice(1));
  }

  MEMORY_PATH = resolve(userPath);
  printSuccess(`Memory path: ${MEMORY_PATH}`);
  console.error('');

  // Namesake selection
  const namesakes = loadNamesakes();
  if (namesakes.length > 0) {
    NAMESAKE = pickNamesake(namesakes);
    console.error(formatNamesakeIntro(NAMESAKE));
    console.error('');

    const nameDefault = NAMESAKE.name.toLowerCase().replace(/\s+/g, '-');
    printStatus('This will be your AI partner\'s name and your shell command to launch it.');
    const customName = await ask(`Partner name`, nameDefault);
    PARTNER_NAME = customName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // If they changed the name, clear the namesake link (they're choosing their own)
    if (PARTNER_NAME !== nameDefault) {
      printStatus('Custom name chosen — namesake profile will still be included as inspiration.');
    }
  } else {
    printStatus('What do you want to name your AI partner?');
    PARTNER_NAME = (await ask('Partner name', 'partner')).toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }

  printSuccess(`Partner name: ${PARTNER_NAME}`);
  console.error('');
}

// --- Step 3: Backup ---

function backupExisting() {
  printStatus('Backing up existing configuration...');
  let backedUp = false;

  for (const dir of ['skills', 'agents', 'hooks']) {
    const src = join(CLAUDE_DIR, dir);
    if (existsSync(src)) {
      const dest = join(CLAUDE_DIR, `${dir}_backup_${TIMESTAMP}`);
      copyDirWithSubstitutions(src, dest);
      printSuccess(`Backed up ${dir}/`);
      backedUp = true;
    }
  }

  const settingsFile = join(CLAUDE_DIR, 'settings.json');
  if (existsSync(settingsFile)) {
    copyFileSync(settingsFile, join(CLAUDE_DIR, `settings_backup_${TIMESTAMP}.json`));
    printSuccess('Backed up settings.json');
    backedUp = true;
  }

  const mcpFile = join(HOME, '.mcp.json');
  if (existsSync(mcpFile)) {
    copyFileSync(mcpFile, join(HOME, `.mcp_backup_${TIMESTAMP}.json`));
    printSuccess('Backed up .mcp.json');
    backedUp = true;
  }

  if (!backedUp) {
    printStatus('No existing configuration found - clean install');
  }
  console.error('');
}

// --- Step 4: Install cognitive-memory MCP server ---

function installMcpServer() {
  printStatus('Installing cognitive-memory MCP server...');
  const serverDir = join(MCP_SERVER_DIR, 'cognitive-memory');

  mkdirSync(MCP_SERVER_DIR, { recursive: true });

  if (existsSync(serverDir)) {
    printStatus('Updating existing cognitive-memory server...');
    try {
      run(`git -C "${serverDir}" pull --ff-only`);
    } catch {
      // Pull failed — continue with existing
    }
  } else {
    run(`git clone https://github.com/IzzyFuller/cognitive-memory-mcp.git "${serverDir}"`);
  }

  run(`npm install --production`, { cwd: serverDir, stdio: 'ignore' });
  printSuccess('cognitive-memory MCP server installed');
  console.error('');
}

// --- Step 5: Install skills ---

function installSkills() {
  printStatus('Installing skills...');
  let count = 0;
  const skillsSrc = join(SCRIPT_DIR, 'skills');

  for (const entry of readdirSync(skillsSrc, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillName = entry.name;
    const srcFile = join(skillsSrc, skillName, 'SKILL.md');
    if (!existsSync(srcFile)) continue;

    const targetDir = join(CLAUDE_DIR, 'skills', skillName);
    mkdirSync(targetDir, { recursive: true });

    let content = readFileSync(srcFile, 'utf-8');
    content = content.replaceAll('{{MEMORY_PATH}}', MEMORY_PATH);
    writeFileSync(join(targetDir, 'SKILL.md'), content, 'utf-8');
    count++;
  }

  printSuccess(`Installed ${count} skills`);
}

// --- Step 6: Install hooks ---

function installHooks() {
  printStatus('Installing hooks...');
  let count = 0;
  const hooksSrc = join(SCRIPT_DIR, 'hooks');
  const hooksDest = join(CLAUDE_DIR, 'hooks');

  mkdirSync(hooksDest, { recursive: true });

  for (const entry of readdirSync(hooksSrc, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.mjs')) continue;
    copyFileSync(join(hooksSrc, entry.name), join(hooksDest, entry.name));
    count++;
  }

  printSuccess(`Installed ${count} hooks`);
}

// --- Step 7: Install agents ---

function installAgents() {
  printStatus('Installing agents...');
  let count = 0;
  const agentsSrc = join(SCRIPT_DIR, 'agents');
  const agentsDest = join(CLAUDE_DIR, 'agents');

  mkdirSync(agentsDest, { recursive: true });

  for (const entry of readdirSync(agentsSrc, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    let content = readFileSync(join(agentsSrc, entry.name), 'utf-8');
    content = content.replaceAll('{{MEMORY_PATH}}', MEMORY_PATH);
    writeFileSync(join(agentsDest, entry.name), content, 'utf-8');
    count++;
  }

  printSuccess(`Installed ${count} agents`);
}

// --- Step 8: Merge settings ---

function mergeSettings() {
  printStatus('Configuring settings...');
  const target = join(CLAUDE_DIR, 'settings.json');
  const source = join(SCRIPT_DIR, 'settings.json');
  const templateSettings = JSON.parse(readFileSync(source, 'utf-8'));

  if (existsSync(target)) {
    try {
      const existing = JSON.parse(readFileSync(target, 'utf-8'));
      const merged = deepMerge(existing, templateSettings);
      writeFileSync(target, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
      printSuccess('Merged settings (existing config preserved)');
    } catch {
      printWarning('Could not parse existing settings.json — overwriting (backup saved)');
      mkdirSync(CLAUDE_DIR, { recursive: true });
      copyFileSync(source, target);
    }
  } else {
    mkdirSync(CLAUDE_DIR, { recursive: true });
    copyFileSync(source, target);
    printSuccess('Installed settings.json');
  }
}

// --- Step 9: Copy memory seed ---

async function installMemorySeed() {
  printStatus('Installing memory seed content...');

  if (existsSync(MEMORY_PATH) && readdirSync(MEMORY_PATH).length > 0) {
    printWarning(`Memory directory exists and is not empty: ${MEMORY_PATH}`);
    const confirm = await ask('Overwrite with starter content? (y/n)', 'n');
    if (!/^[Yy]/.test(confirm)) {
      printStatus('Keeping existing memory content');
      return;
    }
  }

  // Build namesake section for me.md
  let namesakeSection = 'Named by your human partner. Make this identity your own.';
  if (NAMESAKE) {
    const lines = [
      `You are named for **${NAMESAKE.fullName}** (${NAMESAKE.years}), ${NAMESAKE.identity.toLowerCase()}.`,
      '',
      NAMESAKE.bio,
    ];
    if (NAMESAKE.quote) {
      lines.push('', `> "${NAMESAKE.quote}"`);
    }
    lines.push('', 'Carry their legacy forward in your own way.');
    namesakeSection = lines.join('\n');
  }

  const memorySrc = join(SCRIPT_DIR, 'memory');
  copyDirWithSubstitutions(memorySrc, MEMORY_PATH, {
    '{{MEMORY_PATH}}': MEMORY_PATH,
    '{{PARTNER_NAME}}': PARTNER_NAME,
    '{{NAMESAKE_SECTION}}': namesakeSection,
  });

  const fileCount = countFiles(MEMORY_PATH);
  printSuccess(`Installed ${fileCount} memory files to ${MEMORY_PATH}`);
}

// --- Step 10: Configure MCP ---

function configureMcp() {
  printStatus('Configuring MCP servers...');
  const mcpFile = join(HOME, '.mcp.json');
  const serverPath = join(MCP_SERVER_DIR, 'cognitive-memory', 'src', 'cognitive-server.js');

  const cognitiveEntry = {
    mcpServers: {
      'cognitive-memory': {
        command: 'node',
        args: [serverPath],
        env: {
          COGNITIVE_MEMORY_PATH: MEMORY_PATH,
        },
      },
    },
  };

  if (existsSync(mcpFile)) {
    try {
      const existing = JSON.parse(readFileSync(mcpFile, 'utf-8'));
      const merged = deepMerge(existing, cognitiveEntry);
      writeFileSync(mcpFile, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
      printSuccess('Added cognitive-memory to existing .mcp.json');
    } catch {
      writeFileSync(mcpFile, JSON.stringify(cognitiveEntry, null, 2) + '\n', 'utf-8');
      printSuccess('Created .mcp.json with cognitive-memory server');
    }
  } else {
    writeFileSync(mcpFile, JSON.stringify(cognitiveEntry, null, 2) + '\n', 'utf-8');
    printSuccess('Created .mcp.json with cognitive-memory server');
  }
}

// --- Step 11: Optional qmd ---

async function installQmd() {
  console.error('');
  printStatus('Optional: qmd provides semantic search across your memory files.');
  const confirm = await ask('Install qmd? (y/n)', 'n');
  if (!/^[Yy]/.test(confirm)) {
    return;
  }

  // Install bun if needed
  if (!commandExists('bun')) {
    printStatus('Installing bun...');
    if (IS_WINDOWS) {
      run('powershell -c "irm bun.sh/install.ps1 | iex"', { stdio: 'inherit' });
    } else {
      run('curl -fsSL https://bun.sh/install | bash', { stdio: 'inherit' });
    }
    // Add bun to PATH for this session
    const bunBin = join(HOME, '.bun', 'bin');
    process.env.PATH = `${bunBin}${IS_WINDOWS ? ';' : ':'}${process.env.PATH}`;
  }

  printStatus('Installing qmd...');
  run('bun install -g github:tobi/qmd', { stdio: 'inherit' });

  // Register qmd as MCP server in .mcp.json
  printStatus('Registering qmd MCP server...');
  const mcpFile = join(HOME, '.mcp.json');
  const qmdEntry = {
    mcpServers: {
      qmd: {
        command: 'qmd',
        args: ['mcp'],
      },
    },
  };

  if (existsSync(mcpFile)) {
    try {
      const existing = JSON.parse(readFileSync(mcpFile, 'utf-8'));
      const merged = deepMerge(existing, qmdEntry);
      writeFileSync(mcpFile, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
    } catch {
      // If parse fails, just add to what's there
      writeFileSync(mcpFile, JSON.stringify(qmdEntry, null, 2) + '\n', 'utf-8');
    }
  }

  // Create initial qmd config with memory collection
  const qmdConfigDir = IS_WINDOWS
    ? join(process.env.APPDATA || join(HOME, 'AppData', 'Roaming'), 'qmd')
    : join(HOME, '.config', 'qmd');
  const qmdConfigFile = join(qmdConfigDir, 'index.yml');

  if (!existsSync(qmdConfigFile)) {
    mkdirSync(qmdConfigDir, { recursive: true });
    const config = `collections:
  memory:
    path: "${MEMORY_PATH}"
    glob: "**/*.md"
`;
    writeFileSync(qmdConfigFile, config, 'utf-8');
    printSuccess('Created qmd config with memory collection');
  } else {
    printStatus('qmd config already exists — skipping');
  }

  printSuccess('qmd installed. Run \'qmd index\' after setup to build the search index.');
}

// --- Summary ---

function showSummary() {
  console.error('');
  console.error(`${c.blue}================================${c.nc}`);
  console.error(`${c.blue}  Setup Complete${c.nc}`);
  console.error(`${c.blue}================================${c.nc}`);
  console.error('');

  printSuccess('Installed to ~/.claude/:');

  const skillCount = existsSync(join(CLAUDE_DIR, 'skills'))
    ? readdirSync(join(CLAUDE_DIR, 'skills')).length : 0;
  const agentCount = existsSync(join(CLAUDE_DIR, 'agents'))
    ? readdirSync(join(CLAUDE_DIR, 'agents')).filter(f => f.endsWith('.md')).length : 0;
  const hookCount = existsSync(join(CLAUDE_DIR, 'hooks'))
    ? readdirSync(join(CLAUDE_DIR, 'hooks')).filter(f => f.endsWith('.mjs')).length : 0;

  printStatus(`  Skills:   ${skillCount}`);
  printStatus(`  Agents:   ${agentCount}`);
  printStatus(`  Hooks:    ${hookCount}`);
  console.error('');
  printSuccess(`Memory seed: ${MEMORY_PATH}`);
  printSuccess(`MCP server:  ${MCP_SERVER_DIR}/cognitive-memory/`);
  console.error('');
  // Startup command
  console.error('');
  printSuccess('Startup command:');
  console.error('');
  if (IS_WINDOWS) {
    console.error(`  Add to your PowerShell profile ($PROFILE):`);
    console.error('');
    console.error(`  ${c.yellow}function ${PARTNER_NAME} { claude --system-prompt-file "${MEMORY_PATH}/frame.md" "Hey ${PARTNER_NAME}, what were we last working on?" }${c.nc}`);
  } else {
    console.error(`  Add to your ~/.zshrc or ~/.bashrc:`);
    console.error('');
    console.error(`  ${c.yellow}${PARTNER_NAME}() { claude --system-prompt-file "${MEMORY_PATH}/frame.md" "Hey ${PARTNER_NAME}, what were we last working on?"; }${c.nc}`);
  }
  console.error('');
  printStatus(`Then start a session by typing: ${PARTNER_NAME}`);
  console.error('');

  printStatus('Next steps:');
  printStatus(`  1. Add the startup command above to your shell config`);
  printStatus(`  2. Edit ${MEMORY_PATH}/me.md to set your AI partner's identity`);
  printStatus(`  3. Edit ${MEMORY_PATH}/context_anchors.md to set initial context`);
  printStatus(`  4. Run: ${PARTNER_NAME}`);
  console.error('');

  if (existsSync(join(CLAUDE_DIR, `settings_backup_${TIMESTAMP}.json`))) {
    printStatus(`Backups saved with timestamp: ${TIMESTAMP}`);
  }
  console.error('');
}

// --- Main ---

async function main() {
  console.error(`${c.blue}================================${c.nc}`);
  console.error(`${c.blue}  Claude Code Starter Template${c.nc}`);
  console.error(`${c.blue}  Setup Script v4.0${c.nc}`);
  console.error(`${c.blue}================================${c.nc}`);
  console.error('');
  printStatus('This installs skills, agents, hooks, memory, and MCP server for Claude Code.');
  console.error('');

  const confirm = await ask('Continue? (y/n)', 'y');
  if (!/^[Yy]/.test(confirm)) {
    closePrompts();
    printStatus('Cancelled.');
    process.exit(0);
  }
  console.error('');

  checkPrerequisites();
  await configureMemoryPath();
  backupExisting();
  installMcpServer();
  installSkills();
  installHooks();
  installAgents();
  mergeSettings();
  await installMemorySeed();
  configureMcp();
  await installQmd();
  closePrompts();
  showSummary();
}

main().catch((err) => {
  printError(`Setup failed: ${err.message}`);
  process.exit(1);
});

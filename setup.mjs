#!/usr/bin/env node

// Claude Code Starter Template Setup Script
// Installs skills, agents, hooks, memory seed, and cognitive-memory MCP server
// Cross-platform Node.js replacement for setup.sh
// Version: 4.1

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, copyFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

import {
  SCRIPT_DIR, HOME, IS_WINDOWS, CLAUDE_DIR, MCP_SERVER_DIR,
  c, printStatus, printSuccess, printWarning, printError,
  ask, closePrompts,
  run, commandExists, getShellProfile,
  deepMerge, copyDirWithSubstitutions, countFiles,
} from './lib/shared.mjs';

// --- Script-local state ---

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

let MEMORY_PATH = '';
let PARTNER_NAME = '';
let NAMESAKE = null;

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
  // Partner name first — it determines the default memory path
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

  // Memory path — default derived from partner name
  const defaultPath = join(HOME, PARTNER_NAME, 'memory');
  printStatus('Where should your memory knowledge base live?');
  let userPath = await ask('Memory path', defaultPath);

  // Expand ~ if present
  if (userPath.startsWith('~')) {
    userPath = join(HOME, userPath.slice(1));
  }

  MEMORY_PATH = resolve(userPath);
  printSuccess(`Memory path: ${MEMORY_PATH}`);
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
    '{{ASSISTANT_NAME}}': PARTNER_NAME,
    '{{NAMESAKE_SECTION}}': namesakeSection,
  });

  const fileCount = countFiles(MEMORY_PATH);
  printSuccess(`Installed ${fileCount} memory files to ${MEMORY_PATH}`);
}

// --- Step 10: Configure MCP ---

async function configureMcp() {
  printStatus('Configuring MCP servers...');
  const mcpFile = join(HOME, '.mcp.json');
  const serverPath = join(MCP_SERVER_DIR, 'cognitive-memory', 'src', 'cognitive-server.js');

  const newEntry = {
    command: 'node',
    args: [serverPath],
    env: {
      COGNITIVE_MEMORY_PATH: MEMORY_PATH,
    },
  };

  // Read existing config or start fresh
  let config = { mcpServers: {} };
  if (existsSync(mcpFile)) {
    try {
      const parsed = JSON.parse(readFileSync(mcpFile, 'utf-8'));
      if (parsed.mcpServers) config = parsed;
      else config = { ...parsed, mcpServers: {} };
    } catch {
      printWarning('Could not parse existing .mcp.json — will create fresh (backup saved)');
    }
  }

  // Don't clobber an existing cognitive-memory entry without asking
  if (config.mcpServers['cognitive-memory']) {
    printWarning('cognitive-memory is already configured in .mcp.json');
    const overwrite = await ask('Overwrite existing cognitive-memory config? (y/n)', 'n');
    if (!/^[Yy]/.test(overwrite)) {
      printStatus('Keeping existing cognitive-memory configuration');
      return;
    }
  }

  config.mcpServers['cognitive-memory'] = newEntry;
  writeFileSync(mcpFile, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  printSuccess(existsSync(mcpFile) ? 'Added cognitive-memory to .mcp.json' : 'Created .mcp.json with cognitive-memory server');
}

// --- Step 11: Optional qmd ---

async function installQmd() {
  console.error('');
  printStatus('Optional: qmd provides semantic search across your memory files.');
  printStatus('Requires Node.js 22+ for prebuilt binaries.');
  const confirm = await ask('Install qmd? (y/n)', 'n');
  if (!/^[Yy]/.test(confirm)) {
    return;
  }

  // Check Node version — better-sqlite3 prebuilt binaries require Node 22+
  const nodeVer = parseInt(process.versions.node.split('.')[0], 10);
  if (nodeVer < 22) {
    printWarning(`Node.js ${nodeVer} detected. qmd requires Node.js 22+ for prebuilt binaries.`);
    printStatus('Upgrade Node.js from https://nodejs.org, then run:');
    printStatus('  npm install -g @tobilu/qmd');
    printStatus('Continuing setup without qmd...');
    return;
  }

  printStatus('Installing qmd via npm...');
  try {
    run('npm install -g @tobilu/qmd', { stdio: 'inherit' });
  } catch {
    printWarning('qmd installation failed.');
    printStatus('On networks with SSL inspection, retry with:');
    printStatus('  NODE_TLS_REJECT_UNAUTHORIZED=0 npm install -g @tobilu/qmd');
    printStatus('Continuing setup without qmd...');
    return;
  }

  // Index the memory collection
  printStatus('Indexing memory collection...');
  try {
    run(`qmd collection add "${MEMORY_PATH}" --name memory --mask "**/*.md"`, { stdio: 'inherit' });
    printSuccess('Memory collection indexed');
  } catch {
    printWarning('Could not index memory collection. Run manually after setup:');
    printStatus(`  qmd collection add "${MEMORY_PATH}" --name memory --mask "**/*.md"`);
  }

  // Register qmd as MCP server in .mcp.json
  printStatus('Registering qmd MCP server...');
  const mcpFile = join(HOME, '.mcp.json');
  const qmdNewEntry = {
    command: 'qmd',
    args: ['mcp'],
  };

  let mcpConfig = { mcpServers: {} };
  if (existsSync(mcpFile)) {
    try {
      const parsed = JSON.parse(readFileSync(mcpFile, 'utf-8'));
      if (parsed.mcpServers) mcpConfig = parsed;
      else mcpConfig = { ...parsed, mcpServers: {} };
    } catch {
      printWarning('Could not parse .mcp.json — will add qmd to fresh config');
    }
  }

  // Don't clobber an existing qmd entry without asking
  if (mcpConfig.mcpServers.qmd) {
    printWarning('qmd is already configured in .mcp.json');
    const overwrite = await ask('Overwrite existing qmd config? (y/n)', 'n');
    if (!/^[Yy]/.test(overwrite)) {
      printStatus('Keeping existing qmd configuration');
    } else {
      mcpConfig.mcpServers.qmd = qmdNewEntry;
      writeFileSync(mcpFile, JSON.stringify(mcpConfig, null, 2) + '\n', 'utf-8');
      printSuccess('Updated qmd in .mcp.json');
    }
  } else {
    mcpConfig.mcpServers.qmd = qmdNewEntry;
    writeFileSync(mcpFile, JSON.stringify(mcpConfig, null, 2) + '\n', 'utf-8');
    printSuccess('Added qmd to .mcp.json');
  }

  printSuccess('qmd installed.');
  printStatus('Optionally build vector embeddings for semantic search:');
  printStatus('  qmd embed   (first run downloads ~2GB of models)');
  printStatus('On machines without a GPU, prefix with NODE_LLAMA_CPP_GPU=false to skip GPU detection.');
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
  // Add launch command to shell profile
  console.error('');
  const framePath = join(MEMORY_PATH, 'frame.md');
  const shellFunc = IS_WINDOWS
    ? `function ${PARTNER_NAME} { claude --system-prompt-file "${framePath}" "Hey ${PARTNER_NAME}, what were we last working on?" }`
    : `${PARTNER_NAME}() { claude --system-prompt-file "${framePath}" "Hey ${PARTNER_NAME}, what were we last working on?"; }`;

  const profilePath = getShellProfile();
  let profileWritten = false;

  // Check if already present
  if (existsSync(profilePath)) {
    const content = readFileSync(profilePath, 'utf-8');
    if (content.includes(`function ${PARTNER_NAME} `) || content.includes(`${PARTNER_NAME}()`)) {
      printStatus(`Launch command already exists in ${profilePath}`);
      profileWritten = true;
    }
  }

  if (!profileWritten) {
    try {
      mkdirSync(dirname(profilePath), { recursive: true });
      const prefix = existsSync(profilePath) ? '\n' : '';
      appendFileSync(profilePath, `${prefix}# Claude Code partner launch command\n${shellFunc}\n`, 'utf-8');
      printSuccess(`Added launch command to ${profilePath}`);
      profileWritten = true;
    } catch (err) {
      printWarning(`Could not write to ${profilePath}: ${err.message}`);
      printStatus('Add this to your shell profile manually:');
      console.error(`  ${c.yellow}${shellFunc}${c.nc}`);
    }
  }

  console.error('');
  if (profileWritten) {
    printStatus(`Restart your terminal, then start a session by typing: ${PARTNER_NAME}`);
  }
  console.error('');

  printStatus('Next steps:');
  printStatus(`  1. Edit ${MEMORY_PATH}/me.md to set your AI partner's identity`);
  printStatus(`  2. Edit ${MEMORY_PATH}/context_anchors.md to set initial context`);
  printStatus(`  3. Restart your terminal and run: ${PARTNER_NAME}`);
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
  console.error(`${c.blue}  Setup Script v4.1${c.nc}`);
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
  await configureMcp();
  await installQmd();
  closePrompts();
  showSummary();
}

main().catch((err) => {
  printError(`Setup failed: ${err.message}`);
  process.exit(1);
});

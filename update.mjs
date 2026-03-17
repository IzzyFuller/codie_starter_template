#!/usr/bin/env node

// Claude Code Starter Template Update Script
// Pushes mechanical updates (hooks, agents, skills) to deployed scions
// while leaving identity files untouched.
// Version: 1.0

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  SCRIPT_DIR, HOME, IS_WINDOWS, CLAUDE_DIR,
  c, printStatus, printSuccess, printWarning, printError,
  ask, closePrompts,
  getShellProfile,
  deepMerge, copyDirWithSubstitutions,
} from './lib/shared.mjs';

// --- Script-local state ---

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

const NEVER_TOUCH = ['me.md', 'current_session.md', 'context_anchors.md', 'frame.md'];

const MEMORY_SUBDIRS = ['protocols', 'patterns', 'anti-patterns', 'concepts', 'people', 'organizations', 'projects'];

let MEMORY_PATH = '';
let PARTNER_NAME = '';
let originalAliasPrompt = '';

// --- Step 1: Detect existing scion ---

function parseCliArgs() {
  const args = process.argv.slice(2);
  let memoryPath = '';
  let partnerName = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--memory-path' && args[i + 1]) {
      memoryPath = args[++i];
    } else if (args[i] === '--partner-name' && args[i + 1]) {
      partnerName = args[++i];
    }
  }
  return { memoryPath, partnerName };
}

function detectScionFromProfile() {
  const profilePath = getShellProfile();
  if (!existsSync(profilePath)) return null;

  const content = readFileSync(profilePath, 'utf-8');

  // Unix: partnerName() { claude --system-prompt-file "MEMORY_PATH/frame.md" "..."; }
  const unixPattern = /^(\w[\w-]*)\(\)\s*\{\s*claude\s+--system-prompt-file\s+"([^"]+)[/\\]frame\.md"/m;
  // Windows: function partnerName { claude --system-prompt-file "MEMORY_PATH\frame.md" "..." }
  const winPattern = /^function\s+(\w[\w-]*)\s*\{\s*claude\s+--system-prompt-file\s+"([^"]+)[/\\]frame\.md"/m;

  const match = content.match(unixPattern) || content.match(winPattern);
  if (!match) return null;

  return {
    partnerName: match[1],
    memoryPath: match[2],
  };
}

function detectScion() {
  const cli = parseCliArgs();

  if (cli.memoryPath && cli.partnerName) {
    MEMORY_PATH = cli.memoryPath;
    PARTNER_NAME = cli.partnerName;
  } else {
    const detected = detectScionFromProfile();
    if (!detected) {
      printError('No scion detected. Run setup.mjs first.');
      process.exit(1);
    }
    MEMORY_PATH = cli.memoryPath || detected.memoryPath;
    PARTNER_NAME = cli.partnerName || detected.partnerName;
  }

  // Validate
  if (!existsSync(MEMORY_PATH)) {
    printError(`Memory path does not exist: ${MEMORY_PATH}`);
    process.exit(1);
  }
  if (!existsSync(join(MEMORY_PATH, 'frame.md'))) {
    printError(`frame.md not found in ${MEMORY_PATH}`);
    process.exit(1);
  }
  if (!existsSync(join(MEMORY_PATH, 'me.md'))) {
    printError(`me.md not found in ${MEMORY_PATH}`);
    process.exit(1);
  }

  printSuccess(`Detected scion: ${PARTNER_NAME}`);
  printSuccess(`Memory path: ${MEMORY_PATH}`);
  console.error('');
}

// --- Step 2: Compute file inventories ---

function readFileSafe(path) {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

function applySubstitutions(content) {
  return content
    .replaceAll('{{MEMORY_PATH}}', MEMORY_PATH)
    .replaceAll('{{PARTNER_NAME}}', PARTNER_NAME);
}

function compareFiles(templateContent, scionPath) {
  const scionContent = readFileSafe(scionPath);
  if (scionContent === null) return 'new';
  if (templateContent === scionContent) return 'unchanged';
  return 'updated';
}

function computeDirectOverwrites() {
  const result = {
    hooks: [],
    agents: [],
    skills: [],
  };

  // Hooks: compare .mjs files
  const hooksSrc = join(SCRIPT_DIR, 'hooks');
  const hooksDest = join(CLAUDE_DIR, 'hooks');
  if (existsSync(hooksSrc)) {
    const templateHooks = readdirSync(hooksSrc).filter(f => f.endsWith('.mjs'));
    const scionHooks = existsSync(hooksDest)
      ? readdirSync(hooksDest).filter(f => f.endsWith('.mjs'))
      : [];

    for (const file of templateHooks) {
      const templateContent = readFileSync(join(hooksSrc, file), 'utf-8');
      const status = compareFiles(templateContent, join(hooksDest, file));
      result.hooks.push({ file, status });
    }
    // Check for removed_upstream
    for (const file of scionHooks) {
      if (!templateHooks.includes(file)) {
        result.hooks.push({ file, status: 'removed_upstream' });
      }
    }
  }

  // Agents: compare .md files with substitution
  const agentsSrc = join(SCRIPT_DIR, 'agents');
  const agentsDest = join(CLAUDE_DIR, 'agents');
  if (existsSync(agentsSrc)) {
    const templateAgents = readdirSync(agentsSrc).filter(f => f.endsWith('.md'));
    const scionAgents = existsSync(agentsDest)
      ? readdirSync(agentsDest).filter(f => f.endsWith('.md'))
      : [];

    for (const file of templateAgents) {
      const templateContent = applySubstitutions(readFileSync(join(agentsSrc, file), 'utf-8'));
      const status = compareFiles(templateContent, join(agentsDest, file));
      result.agents.push({ file, status });
    }
    for (const file of scionAgents) {
      if (!templateAgents.includes(file)) {
        result.agents.push({ file, status: 'removed_upstream' });
      }
    }
  }

  // Skills: compare SKILL.md files with substitution
  const skillsSrc = join(SCRIPT_DIR, 'skills');
  const skillsDest = join(CLAUDE_DIR, 'skills');
  if (existsSync(skillsSrc)) {
    const templateSkills = readdirSync(skillsSrc, { withFileTypes: true })
      .filter(d => d.isDirectory() && existsSync(join(skillsSrc, d.name, 'SKILL.md')))
      .map(d => d.name);
    const scionSkills = existsSync(skillsDest)
      ? readdirSync(skillsDest, { withFileTypes: true })
          .filter(d => d.isDirectory() && existsSync(join(skillsDest, d.name, 'SKILL.md')))
          .map(d => d.name)
      : [];

    for (const name of templateSkills) {
      const templateContent = applySubstitutions(
        readFileSync(join(skillsSrc, name, 'SKILL.md'), 'utf-8')
      );
      const status = compareFiles(templateContent, join(skillsDest, name, 'SKILL.md'));
      result.skills.push({ name, status });
    }
    for (const name of scionSkills) {
      if (!templateSkills.includes(name)) {
        result.skills.push({ name, status: 'removed_upstream' });
      }
    }
  }

  return result;
}

function computeMemoryInventory() {
  const result = [];
  const memorySrc = join(SCRIPT_DIR, 'memory');

  for (const subdir of MEMORY_SUBDIRS) {
    const srcDir = join(memorySrc, subdir);
    const destDir = join(MEMORY_PATH, subdir);
    if (!existsSync(srcDir)) continue;

    const templateFiles = readdirSync(srcDir).filter(f => f.endsWith('.md'));
    const scionFiles = existsSync(destDir)
      ? readdirSync(destDir).filter(f => f.endsWith('.md'))
      : [];

    for (const file of templateFiles) {
      const relPath = `${subdir}/${file}`;
      if (NEVER_TOUCH.includes(file)) continue;

      const templateContent = applySubstitutions(readFileSync(join(srcDir, file), 'utf-8'));
      const scionPath = join(destDir, file);
      const scionContent = readFileSafe(scionPath);

      if (scionContent === null) {
        result.push({ relPath, status: 'new' });
      } else if (templateContent === scionContent) {
        result.push({ relPath, status: 'unchanged' });
      } else {
        result.push({ relPath, status: 'changed' });
      }
    }

    // Check for removed_upstream
    for (const file of scionFiles) {
      const relPath = `${subdir}/${file}`;
      if (NEVER_TOUCH.includes(file)) continue;
      if (!templateFiles.includes(file)) {
        result.push({ relPath, status: 'removed_upstream' });
      }
    }
  }

  return result;
}

function checkFrameChanged() {
  const templateFrame = join(SCRIPT_DIR, 'memory', 'frame.md');
  const scionFrame = join(MEMORY_PATH, 'frame.md');
  if (!existsSync(templateFrame)) return false;
  const templateContent = applySubstitutions(readFileSync(templateFrame, 'utf-8'));
  const scionContent = readFileSafe(scionFrame);
  if (scionContent === null) return false;
  return templateContent !== scionContent;
}

// --- Step 3: Show summary and confirm ---

function printInventorySummary(overwrites, memoryInventory, frameChangedUpstream) {
  console.error(`${c.blue}================================${c.nc}`);
  console.error(`${c.blue}  Update Summary${c.nc}`);
  console.error(`${c.blue}================================${c.nc}`);
  console.error('');

  // Direct overwrites
  for (const category of ['hooks', 'agents', 'skills']) {
    const items = overwrites[category];
    const label = category === 'skills' ? 'name' : 'file';
    const updated = items.filter(i => i.status === 'updated');
    const newItems = items.filter(i => i.status === 'new');
    const unchanged = items.filter(i => i.status === 'unchanged');
    const removed = items.filter(i => i.status === 'removed_upstream');

    console.error(`${c.blue}${category}:${c.nc}`);
    if (updated.length) {
      console.error(`  ${c.yellow}updated (${updated.length}):${c.nc} ${updated.map(i => i[label]).join(', ')}`);
    }
    if (newItems.length) {
      console.error(`  ${c.green}new (${newItems.length}):${c.nc} ${newItems.map(i => i[label]).join(', ')}`);
    }
    if (unchanged.length) {
      console.error(`  unchanged: ${unchanged.length}`);
    }
    if (removed.length) {
      console.error(`  ${c.red}removed upstream (${removed.length}):${c.nc} ${removed.map(i => i[label]).join(', ')}`);
      printWarning(`  These ${category} exist in your scion but not in the template. They will NOT be auto-deleted.`);
    }
  }

  console.error('');

  // Memory files
  const memNew = memoryInventory.filter(i => i.status === 'new');
  const memChanged = memoryInventory.filter(i => i.status === 'changed');
  const memUnchanged = memoryInventory.filter(i => i.status === 'unchanged');
  const memRemoved = memoryInventory.filter(i => i.status === 'removed_upstream');

  console.error(`${c.blue}memory files:${c.nc}`);
  if (memNew.length) {
    console.error(`  ${c.green}new (will auto-adopt) (${memNew.length}):${c.nc} ${memNew.map(i => i.relPath).join(', ')}`);
  }
  if (memChanged.length) {
    console.error(`  ${c.yellow}changed upstream (scion review) (${memChanged.length}):${c.nc} ${memChanged.map(i => i.relPath).join(', ')}`);
  }
  if (memUnchanged.length) {
    console.error(`  unchanged: ${memUnchanged.length}`);
  }
  if (memRemoved.length) {
    console.error(`  ${c.red}removed upstream (scion review) (${memRemoved.length}):${c.nc} ${memRemoved.map(i => i.relPath).join(', ')}`);
  }

  if (frameChangedUpstream) {
    console.error('');
    printWarning('frame.md has changed upstream but will NOT be overwritten (never-touch file).');
    printWarning('Your scion should review the upstream version during merge.');
  }

  console.error('');
}

// --- Step 4: Backup ---

function backupExisting() {
  printStatus('Backing up existing configuration...');
  let backedUp = false;

  for (const dir of ['hooks', 'agents', 'skills']) {
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
    printStatus('No existing configuration found to back up');
  }
  console.error('');
}

// --- Step 5: Execute direct overwrites ---

function executeOverwrites(overwrites) {
  printStatus('Applying direct overwrites...');

  // Hooks
  const hooksSrc = join(SCRIPT_DIR, 'hooks');
  const hooksDest = join(CLAUDE_DIR, 'hooks');
  const hooksToWrite = overwrites.hooks.filter(i => i.status === 'updated' || i.status === 'new');
  if (hooksToWrite.length) {
    mkdirSync(hooksDest, { recursive: true });
    for (const { file } of hooksToWrite) {
      try {
        copyFileSync(join(hooksSrc, file), join(hooksDest, file));
      } catch (err) {
        printError(`Failed to copy hook ${file}: ${err.message}`);
      }
    }
    printSuccess(`Installed ${hooksToWrite.length} hooks`);
  }

  // Agents
  const agentsSrc = join(SCRIPT_DIR, 'agents');
  const agentsDest = join(CLAUDE_DIR, 'agents');
  const agentsToWrite = overwrites.agents.filter(i => i.status === 'updated' || i.status === 'new');
  if (agentsToWrite.length) {
    mkdirSync(agentsDest, { recursive: true });
    for (const { file } of agentsToWrite) {
      try {
        let content = readFileSync(join(agentsSrc, file), 'utf-8');
        content = content.replaceAll('{{MEMORY_PATH}}', MEMORY_PATH);
        writeFileSync(join(agentsDest, file), content, 'utf-8');
      } catch (err) {
        printError(`Failed to copy agent ${file}: ${err.message}`);
      }
    }
    printSuccess(`Installed ${agentsToWrite.length} agents`);
  }

  // Skills
  const skillsSrc = join(SCRIPT_DIR, 'skills');
  const skillsDest = join(CLAUDE_DIR, 'skills');
  const skillsToWrite = overwrites.skills.filter(i => i.status === 'updated' || i.status === 'new');
  if (skillsToWrite.length) {
    for (const { name } of skillsToWrite) {
      try {
        const targetDir = join(skillsDest, name);
        mkdirSync(targetDir, { recursive: true });
        let content = readFileSync(join(skillsSrc, name, 'SKILL.md'), 'utf-8');
        content = content.replaceAll('{{MEMORY_PATH}}', MEMORY_PATH);
        writeFileSync(join(targetDir, 'SKILL.md'), content, 'utf-8');
      } catch (err) {
        printError(`Failed to copy skill ${name}: ${err.message}`);
      }
    }
    printSuccess(`Installed ${skillsToWrite.length} skills`);
  }

  const totalWritten = hooksToWrite.length + agentsToWrite.length + skillsToWrite.length;
  if (totalWritten === 0) {
    printStatus('No direct overwrites needed - all files up to date');
  }
  console.error('');
}

// --- Step 6: Settings merge ---

function mergeSettings() {
  printStatus('Merging settings...');
  const target = join(CLAUDE_DIR, 'settings.json');
  const source = join(SCRIPT_DIR, 'settings.json');

  if (!existsSync(source)) {
    printStatus('No template settings.json found - skipping');
    return;
  }

  const templateSettings = JSON.parse(readFileSync(source, 'utf-8'));

  if (existsSync(target)) {
    try {
      const existing = JSON.parse(readFileSync(target, 'utf-8'));
      const merged = deepMerge(existing, templateSettings);
      writeFileSync(target, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
      printSuccess('Merged settings (existing config preserved, template wins on conflicts)');
    } catch {
      printWarning('Could not parse existing settings.json - overwriting (backup saved)');
      mkdirSync(CLAUDE_DIR, { recursive: true });
      copyFileSync(source, target);
    }
  } else {
    mkdirSync(CLAUDE_DIR, { recursive: true });
    copyFileSync(source, target);
    printSuccess('Installed settings.json');
  }
  console.error('');
}

// --- Step 7: MCP config merge ---

function mergeMcpConfig() {
  printStatus('Merging MCP configuration...');
  const mcpFile = join(HOME, '.mcp.json');
  const templateFile = join(SCRIPT_DIR, 'mcp.json.template');

  if (!existsSync(templateFile)) {
    printStatus('No mcp.json.template found - skipping');
    return;
  }

  let templateContent = readFileSync(templateFile, 'utf-8');
  // Substitute placeholders in template
  templateContent = templateContent.replaceAll('{{MEMORY_PATH}}', MEMORY_PATH);
  // MCP_SERVER_PATH uses the same pattern as setup.mjs
  const MCP_SERVER_DIR = IS_WINDOWS
    ? join(process.env.APPDATA || join(HOME, 'AppData', 'Roaming'), 'claude-mcp-servers')
    : join(HOME, '.local', 'share', 'claude-mcp-servers');
  templateContent = templateContent.replaceAll('{{MCP_SERVER_PATH}}', MCP_SERVER_DIR);

  let templateConfig;
  try {
    templateConfig = JSON.parse(templateContent);
  } catch {
    printWarning('Could not parse mcp.json.template - skipping MCP merge');
    return;
  }

  let existingConfig = { mcpServers: {} };
  if (existsSync(mcpFile)) {
    try {
      const parsed = JSON.parse(readFileSync(mcpFile, 'utf-8'));
      existingConfig = parsed.mcpServers ? parsed : { ...parsed, mcpServers: {} };
    } catch {
      printWarning('Could not parse existing .mcp.json - creating fresh (backup saved)');
    }
  }

  // Additive only: add new server keys, never overwrite existing
  let added = 0;
  const templateServers = templateConfig.mcpServers || {};
  for (const [key, value] of Object.entries(templateServers)) {
    if (!existingConfig.mcpServers[key]) {
      existingConfig.mcpServers[key] = value;
      added++;
      printSuccess(`Added MCP server: ${key}`);
    }
  }

  if (added > 0) {
    writeFileSync(mcpFile, JSON.stringify(existingConfig, null, 2) + '\n', 'utf-8');
  } else {
    printStatus('No new MCP servers to add');
  }
  console.error('');
}

// --- Step 8: Auto-adopt new memory files ---

function autoAdoptNewMemory(memoryInventory) {
  const newFiles = memoryInventory.filter(i => i.status === 'new');
  if (newFiles.length === 0) {
    printStatus('No new memory files to adopt');
    console.error('');
    return;
  }

  printStatus(`Auto-adopting ${newFiles.length} new memory files...`);
  const memorySrc = join(SCRIPT_DIR, 'memory');

  for (const { relPath } of newFiles) {
    try {
      const srcPath = join(memorySrc, relPath);
      const destPath = join(MEMORY_PATH, relPath);
      mkdirSync(join(MEMORY_PATH, relPath.split('/')[0]), { recursive: true });
      let content = readFileSync(srcPath, 'utf-8');
      content = applySubstitutions(content);
      writeFileSync(destPath, content, 'utf-8');
    } catch (err) {
      printError(`Failed to adopt ${relPath}: ${err.message}`);
    }
  }

  printSuccess(`Adopted ${newFiles.length} new memory files`);
  console.error('');
}

// --- Step 9: Generate manifest ---

function generateManifest(overwrites, memoryInventory, frameChangedUpstream) {
  printStatus('Generating update manifest...');

  const manifest = {
    version: 1,
    timestamp: new Date().toISOString(),
    templateRepoPath: SCRIPT_DIR,
    partnerName: PARTNER_NAME,
    memoryPath: MEMORY_PATH,
    overwrites: {
      hooks: overwrites.hooks
        .filter(i => i.status === 'updated' || i.status === 'new')
        .map(i => i.file),
      agents: overwrites.agents
        .filter(i => i.status === 'updated' || i.status === 'new')
        .map(i => i.file),
      skills: overwrites.skills
        .filter(i => i.status === 'updated' || i.status === 'new')
        .map(i => i.name),
    },
    newFiles: {
      hooks: overwrites.hooks.filter(i => i.status === 'new').map(i => i.file),
      agents: overwrites.agents.filter(i => i.status === 'new').map(i => i.file),
      skills: overwrites.skills.filter(i => i.status === 'new').map(i => i.name),
      memory: memoryInventory.filter(i => i.status === 'new').map(i => i.relPath),
    },
    memoryChangedUpstream: memoryInventory
      .filter(i => i.status === 'changed')
      .map(i => i.relPath),
    memoryRemovedUpstream: memoryInventory
      .filter(i => i.status === 'removed_upstream')
      .map(i => i.relPath),
    frameChangedUpstream,
    templateRemovedButScionRetained: {
      hooks: overwrites.hooks.filter(i => i.status === 'removed_upstream').map(i => i.file),
      agents: overwrites.agents.filter(i => i.status === 'removed_upstream').map(i => i.file),
      skills: overwrites.skills.filter(i => i.status === 'removed_upstream').map(i => i.name),
    },
    originalAliasPrompt,
  };

  const manifestPath = join(MEMORY_PATH, '.update-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  printSuccess(`Manifest written to ${manifestPath}`);
  console.error('');
}

// --- Step 10: Inject merge instruction into shell alias ---

function injectMergeInstruction() {
  printStatus('Updating shell alias with merge instruction...');
  const profilePath = getShellProfile();

  if (!existsSync(profilePath)) {
    printWarning(`Shell profile not found: ${profilePath}`);
    printManualMergeInstruction();
    return;
  }

  const content = readFileSync(profilePath, 'utf-8');

  // Unix: partnerName() { claude --system-prompt-file "..." "PROMPT"; }
  // The prompt is the last quoted string before "; }"
  const unixPattern = new RegExp(
    `(${escapeRegex(PARTNER_NAME)}\\(\\)\\s*\\{\\s*claude\\s+--system-prompt-file\\s+"[^"]+"\\s+)"([^"]*)"(\\s*;\\s*\\})`,
    'm'
  );
  // Windows: function partnerName { claude --system-prompt-file "..." "PROMPT" }
  const winPattern = new RegExp(
    `(function\\s+${escapeRegex(PARTNER_NAME)}\\s*\\{\\s*claude\\s+--system-prompt-file\\s+"[^"]+"\\s+)"([^"]*)"(\\s*\\})`,
    'm'
  );

  const match = content.match(unixPattern) || content.match(winPattern);
  if (!match) {
    printWarning('Could not find alias in shell profile to update.');
    printManualMergeInstruction();
    return;
  }

  originalAliasPrompt = match[2];
  const mergePrompt = `Hey ${PARTNER_NAME} -- upstream template was updated. Follow protocols/upstream-merge before doing anything else.`;
  const updated = content.replace(
    match[0],
    `${match[1]}"${mergePrompt}"${match[3]}`
  );

  writeFileSync(profilePath, updated, 'utf-8');
  printSuccess(`Updated alias in ${profilePath}`);
  printStatus(`Original prompt saved in manifest: "${originalAliasPrompt}"`);
  console.error('');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function printManualMergeInstruction() {
  console.error('');
  printStatus('Please manually update your shell alias prompt to:');
  const mergePrompt = `Hey ${PARTNER_NAME} -- upstream template was updated. Follow protocols/upstream-merge before doing anything else.`;
  console.error(`  ${c.yellow}"${mergePrompt}"${c.nc}`);
  console.error('');
}

// --- Step 11: Print summary ---

function showFinalSummary(overwrites, memoryInventory, frameChangedUpstream) {
  console.error(`${c.blue}================================${c.nc}`);
  console.error(`${c.blue}  Update Complete${c.nc}`);
  console.error(`${c.blue}================================${c.nc}`);
  console.error('');

  const totalOverwrites =
    overwrites.hooks.filter(i => i.status !== 'unchanged' && i.status !== 'removed_upstream').length +
    overwrites.agents.filter(i => i.status !== 'unchanged' && i.status !== 'removed_upstream').length +
    overwrites.skills.filter(i => i.status !== 'unchanged' && i.status !== 'removed_upstream').length;
  const newMemory = memoryInventory.filter(i => i.status === 'new').length;
  const changedMemory = memoryInventory.filter(i => i.status === 'changed').length;

  printSuccess(`Direct overwrites applied: ${totalOverwrites}`);
  printSuccess(`New memory files adopted: ${newMemory}`);

  if (changedMemory > 0) {
    printWarning(`Memory files changed upstream (needs scion review): ${changedMemory}`);
  }
  if (frameChangedUpstream) {
    printWarning('frame.md changed upstream (needs scion review)');
  }

  console.error('');
  printStatus(`Backups saved with timestamp: ${TIMESTAMP}`);
  printStatus(`Manifest: ${MEMORY_PATH}/.update-manifest.json`);
  console.error('');
  printStatus(`Launch ${PARTNER_NAME} to complete the merge.`);
  printStatus(`Your scion will follow protocols/upstream-merge automatically.`);
  console.error('');
}

// --- Main ---

async function main() {
  console.error(`${c.blue}================================${c.nc}`);
  console.error(`${c.blue}  Claude Code Starter Template${c.nc}`);
  console.error(`${c.blue}  Update Script v1.0${c.nc}`);
  console.error(`${c.blue}================================${c.nc}`);
  console.error('');

  // Step 1: Detect scion
  detectScion();

  // Step 2: Compute inventories
  printStatus('Computing file inventories...');
  const overwrites = computeDirectOverwrites();
  const memoryInventory = computeMemoryInventory();
  const frameChangedUpstream = checkFrameChanged();
  console.error('');

  // Step 3: Show summary and confirm
  printInventorySummary(overwrites, memoryInventory, frameChangedUpstream);

  const totalChanges =
    overwrites.hooks.filter(i => i.status !== 'unchanged').length +
    overwrites.agents.filter(i => i.status !== 'unchanged').length +
    overwrites.skills.filter(i => i.status !== 'unchanged').length +
    memoryInventory.filter(i => i.status !== 'unchanged').length +
    (frameChangedUpstream ? 1 : 0);

  if (totalChanges === 0) {
    printSuccess('Everything is up to date. Nothing to do.');
    closePrompts();
    return;
  }

  const confirm = await ask('Proceed with update? (y/n)', 'y');
  if (!/^[Yy]/.test(confirm)) {
    closePrompts();
    printStatus('Cancelled.');
    process.exit(0);
  }
  console.error('');

  // Step 10 (before backup so we capture originalAliasPrompt for manifest):
  // Extract original prompt first, apply alias change later
  injectMergeInstruction();

  // Step 4: Backup
  backupExisting();

  // Step 5: Execute direct overwrites
  executeOverwrites(overwrites);

  // Step 6: Settings merge
  mergeSettings();

  // Step 7: MCP config merge
  mergeMcpConfig();

  // Step 8: Auto-adopt new memory files
  autoAdoptNewMemory(memoryInventory);

  // Step 9: Generate manifest (after step 10 so originalAliasPrompt is populated)
  generateManifest(overwrites, memoryInventory, frameChangedUpstream);

  // Step 11: Final summary
  showFinalSummary(overwrites, memoryInventory, frameChangedUpstream);

  closePrompts();
}

main().catch((err) => {
  printError(`Update failed: ${err.message}`);
  process.exit(1);
});

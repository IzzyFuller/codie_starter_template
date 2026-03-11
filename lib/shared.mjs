// Shared utilities for setup.mjs and update.mjs
// Extracted to avoid drift between the two scripts.

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

// --- Constants ---

const __shared_filename = fileURLToPath(import.meta.url);
/** Repo root — parent of lib/ */
export const SCRIPT_DIR = dirname(dirname(__shared_filename));

export const HOME = homedir();
export const IS_WINDOWS = platform() === 'win32';
export const CLAUDE_DIR = join(HOME, '.claude');
export const MCP_SERVER_DIR = IS_WINDOWS
  ? join(process.env.APPDATA || join(HOME, 'AppData', 'Roaming'), 'claude-mcp-servers')
  : join(HOME, '.local', 'share', 'claude-mcp-servers');

// --- Colors (ANSI, disabled on Windows cmd without color support) ---

const supportsColor = !IS_WINDOWS || process.env.TERM || process.env.WT_SESSION;
export const c = {
  red: supportsColor ? '\x1b[0;31m' : '',
  green: supportsColor ? '\x1b[0;32m' : '',
  yellow: supportsColor ? '\x1b[1;33m' : '',
  blue: supportsColor ? '\x1b[0;34m' : '',
  nc: supportsColor ? '\x1b[0m' : '',
};

export function printStatus(msg)  { console.error(`${c.blue}[INFO]${c.nc} ${msg}`); }
export function printSuccess(msg) { console.error(`${c.green}[OK]${c.nc} ${msg}`); }
export function printWarning(msg) { console.error(`${c.yellow}[WARN]${c.nc} ${msg}`); }
export function printError(msg)   { console.error(`${c.red}[ERROR]${c.nc} ${msg}`); }

// --- Prompt / TTY utilities ---

// Piped stdin (Docker, CI, echo | node setup.mjs) vs interactive TTY need
// completely different strategies. With piped input, readline fires 'close'
// the moment the pipe is exhausted, which kills the Node.js event loop before
// async steps can run. Fix: read all piped input upfront, shift lines per prompt.
export const IS_TTY = process.stdin.isTTY;
export let inputLines = [];
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

export function ask(question, defaultValue = '') {
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

export function closePrompts() {
  if (rl) rl.close();
}

// --- Shell helpers ---

export function run(cmd, opts = {}) {
  const result = execSync(cmd, { encoding: 'utf-8', stdio: opts.stdio ?? 'pipe', ...opts });
  return result ? result.trim() : '';
}

export function commandExists(cmd) {
  try {
    const check = IS_WINDOWS ? `where ${cmd}` : `command -v ${cmd}`;
    run(check);
    return true;
  } catch {
    return false;
  }
}

export function getShellProfile() {
  if (IS_WINDOWS) {
    try {
      return run('powershell -NoProfile -c "Write-Output $PROFILE"').trim();
    } catch {
      return join(HOME, 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1');
    }
  }
  // Prefer .zshrc if it exists, otherwise .bashrc
  const zshrc = join(HOME, '.zshrc');
  if (existsSync(zshrc)) return zshrc;
  return join(HOME, '.bashrc');
}

// --- Data utilities ---

/** Deep merge b into a (b wins on conflicts). Arrays are replaced, not concatenated. */
export function deepMerge(a, b) {
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
export function copyDirWithSubstitutions(src, dest, substitutions = {}) {
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
export function countFiles(dir) {
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

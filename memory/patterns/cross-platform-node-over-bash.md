# Cross-Platform Node.js Over Bash
**Pattern Type**: Engineering
**Status**: Confirmed

## Summary

When distributing tooling for macOS, Linux, AND Windows, use Node.js (.mjs) instead of bash. Node.js is already a prerequisite for Claude Code, adding zero new dependencies.

## When to Apply

- CLI setup scripts distributed to multiple platforms
- Git hooks that need to work on all developer machines
- Any automation that touches shell profiles or system paths

## How It Works

- Use .mjs files with Node.js standard library (fs, path, os, child_process)
- Detect platform via process.platform and os.homedir()
- Handle shell profile differences: PowerShell $PROFILE on Windows, .zshrc/.bashrc on Unix
- Use npm for package installation (guaranteed available, works everywhere)

## Caveat

When piped (CI/Docker), use single shared readline interface across all prompts.

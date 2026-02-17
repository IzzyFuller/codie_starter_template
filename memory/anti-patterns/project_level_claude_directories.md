# Anti-Pattern: Project-Level .claude Directories

**Category**: Configuration
**Severity**: High -- causes tool availability failures

## Overview

Creating `.claude/` directories with settings files at the project level can override user-level settings, causing tools that are allowed at user-level to become unavailable in specific project contexts.

## The Problem

Project-level `.claude/settings.local.json` files override user-level settings in `~/.claude/settings.json`. If the project-level settings don't include all the same permissions, tools disappear with no clear error message.

## Why This Is Wrong

1. **Permission fragmentation**: Splits permission management across multiple files
2. **Intermittent failures**: Tools work in some projects but not others
3. **Hard to debug**: "Tools aren't available" with no clear error messages
4. **Violates centralized management**: User-level permission management is the preferred pattern

## The Correct Pattern

**NEVER create project-level `.claude/` directories unless explicitly requested.**

- All permission management should stay at user level: `~/.claude/settings.json`
- MCP servers should be installed at user scope unless specified otherwise
- Project-specific needs should be discussed first

## Key Principle

Centralized permission management at user level. Project-level overrides only when explicitly requested and understood.

---
name: pre-commit-checks
description: Standardized pre-commit validation workflow running format, lint, and tests. Use when user says "ready to commit", "run pre-commit checks", or indicates readiness to commit changes. Ensures code quality before commits.
model: haiku
---

# Pre-Commit Checks Skill

## Purpose
This skill provides a standardized three-phase validation workflow to ensure code quality, formatting consistency, and test coverage before committing changes.

## When to Use
- User says "ready to commit"
- User says "run pre-commit checks"
- User asks "are we ready to commit?"
- Before creating git commits (when user indicates readiness)

## Protocol Reference
**For complete instructions, see**: `{{MEMORY_PATH}}/protocols/pre_commit_checks.md`

The protocol contains:
- When to use (explicit and implicit triggers)
- Three-phase sequential workflow (format -> lint -> test)
- Specific commands for each phase
- Failure handling for each phase
- Result reporting formats
- Integration with git commit workflow
- Working directory requirements
- Common scenarios and examples

---

**Key Principle**: Sequential execution. Each phase must complete successfully before the next phase runs. Stop on failure, report clearly, never auto-commit.

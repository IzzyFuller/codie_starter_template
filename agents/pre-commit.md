---
name: pre-commit
description: "Runs all pre-commit validation including semantic anti-pattern review, format, lint, and test, and nothing else."
model: sonnet
color: red
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Glob
  - Grep
  - mcp__cognitive-memory__read_entity
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/pre-commit-checks"`.
Follow the returned protocol exactly.

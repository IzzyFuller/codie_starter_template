---
name: pre-commit
description: "Runs all pre-commit validation: semantic anti-pattern review against documented patterns in cognitive-memory, plus format/lint/test. Spawn before any git commit."
model: sonnet
color: red
---

Read and follow `protocols/pre-commit-checks` from cognitive-memory exactly.

Startup: `mcp__cognitive-memory__read_entity` with `entity_path: "protocols/pre-commit-checks"`

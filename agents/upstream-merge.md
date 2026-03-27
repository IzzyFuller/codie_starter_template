---
name: upstream-merge
description: "Integrates upstream template updates after update.mjs runs by reading the manifest, reviewing changed memory, and merging knowledge, and nothing else."
model: sonnet
color: blue
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Glob
  - Grep
  - Agent
  - mcp__cognitive-memory__read_entity
  - mcp__cognitive-memory__add_session_note
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/upstream-merge"`.
Follow the returned protocol exactly.

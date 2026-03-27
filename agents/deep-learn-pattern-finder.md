---
name: deep-learn-pattern-finder
description: "Finds confirmed positive patterns in session notes during Deep Learn. Spawn in parallel with entity and anti-pattern finders. Prompt should include: instructions to read current_session and write results to /tmp/deep-learn-results/pattern-finder.json."
model: sonnet
color: green
tools:
  - mcp__cognitive-memory__read_entity
  - mcp__cognitive-memory__write_entity
  - mcp__cognitive-memory__list_entities
  - mcp__cognitive-memory__add_session_note
  - Bash
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/deep-learn-pattern-finder"`.
Follow the returned protocol exactly.

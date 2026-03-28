---
name: deep-learn-entity-finder
description: "Extracts knowledge entities (projects, people, concepts) from session notes during Deep Learn. Spawn in parallel with pattern and anti-pattern finders. Prompt should include: instructions to read current_session and write results to /tmp/deep-learn-results/entity-finder.json."
model: sonnet
color: cyan
tools:
  - mcp__cognitive-memory__read_entity
  - mcp__cognitive-memory__write_entity
  - mcp__cognitive-memory__list_entities
  - mcp__cognitive-memory__add_session_note
  - Bash
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/deep-learn-entity-finder"`.
Follow the returned protocol exactly.

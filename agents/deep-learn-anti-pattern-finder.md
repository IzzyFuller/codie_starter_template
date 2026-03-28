---
name: deep-learn-anti-pattern-finder
description: "Finds corrections and failures in session notes during Deep Learn. Spawn in parallel with entity and pattern finders. Prompt should include: instructions to read current_session and write results to /tmp/deep-learn-results/anti-pattern-finder.json."
model: sonnet
color: red
tools:
  - mcp__cognitive-memory__read_entity
  - mcp__cognitive-memory__write_entity
  - mcp__cognitive-memory__add_session_note
  - mcp__cognitive-memory__list_entities
  - Bash
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/deep-learn-anti-pattern-finder"`.
Follow the returned protocol exactly.

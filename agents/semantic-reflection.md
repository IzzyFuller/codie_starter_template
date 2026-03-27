---
name: semantic-reflection
description: "Performs semantic reflection on recent work, surfacing relevant memory patterns and principles. Spawn in background after significant work. Prompt should include: session ID, topics worked on, and context for memory search."
model: sonnet
color: cyan
tools:
  - mcp__cognitive-memory__read_entity
  - mcp__qmd__deep_search
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/semantic-reflection"`.
Follow the returned protocol exactly.

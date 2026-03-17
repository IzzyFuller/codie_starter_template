---
name: semantic-reflection
description: "Searches memory architecture (qmd + cognitive-memory) for context relevant to the user's request. Returns a concise structured summary of patterns, project context, anti-patterns, and key feedback. Runs as background agent to avoid bloating main context."
model: sonnet
color: cyan
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/semantic-reflection"`.
Follow the returned protocol exactly.

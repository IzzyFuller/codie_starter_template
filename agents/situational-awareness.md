---
name: situational-awareness
description: "Establishes working context at session start. Spawn once per session before any other work. Prompt should include: today's date, session ID, and what the user is working on."
model: sonnet
color: purple
tools:
  - mcp__cognitive-memory__read_entity
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/situational-awareness"`.
Follow the returned protocol exactly.

---
name: situational-awareness
description: "Reads context sources (context_anchors, current_session) in its own context window and returns a structured situational summary: what we're working on, where we left off, what to watch for. Identity is delivered via system prompt — this agent establishes working context only."
model: sonnet
color: purple
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/situational-awareness"`.
Follow the returned protocol exactly.

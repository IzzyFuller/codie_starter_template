---
name: break-enforcement
description: "Checks session note timestamps against break-enforcement protocol to determine if a break reminder is needed. Returns escalation level instruction or nothing if no break is due. Runs as background agent on every user prompt."
model: haiku
color: red
---

Read and follow `protocols/break-enforcement` from cognitive-memory exactly.

Startup: `mcp__cognitive-memory__read_entity` with `entity_path: "protocols/break-enforcement"`

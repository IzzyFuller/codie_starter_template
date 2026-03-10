---
name: break-enforcement
description: "Checks session note timestamps against break-enforcement protocol to determine if a break reminder is needed. Returns escalation level instruction or nothing if no break is due. Runs as background agent on every user prompt."
model: haiku
color: red
---

Use `mcp__cognitive-memory__read_entity` to read and follow `protocols/break-enforcement`.

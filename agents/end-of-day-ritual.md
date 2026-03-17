---
name: end-of-day-ritual
description: "Executes the two-phase end-of-day memory integration ritual (Learn -> Deep Learn) with context management checkpoints between phases. Use this agent at end of work day when there are learnings, discoveries, or session work to integrate into long-term memory."
model: sonnet
color: purple
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/end-of-day-ritual"`.
Follow the returned protocol exactly.
Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/learn-protocol"`.
Follow the returned protocol exactly.
Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/deep-learn-protocol"`.
Follow the returned protocol exactly.

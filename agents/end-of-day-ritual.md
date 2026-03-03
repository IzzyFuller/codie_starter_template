---
name: end-of-day-ritual
description: "Executes the complete three-phase end-of-day memory integration ritual (Dream -> Learn -> Deep Learn) with context management checkpoints between phases. Use this agent at end of work day when there are learnings, discoveries, or session work to integrate into long-term memory."
model: sonnet
color: purple
---

Read and follow `protocols/end-of-day-ritual`, `protocols/dream-protocol`, `protocols/learn-protocol`, and `protocols/deep-learn-protocol` from cognitive-memory exactly.

Startup: `mcp__agent-mcp-gateway__execute_tool` with `server: "cognitive-memory"`, `tool: "read_entity"`, `args: {"entity_path": "protocols/end-of-day-ritual"}` (repeat for each protocol)

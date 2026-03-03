---
name: identity-restoration
description: "Reads all identity and context sources (context_anchors, current_session, me, qmd) in its own context window and returns a dense ~80-line structured summary. Replaces 700+ lines of raw entity reading in main context."
model: sonnet
color: purple
---

Read and follow `protocols/identity-continuity` from cognitive-memory exactly.

Startup: `mcp__agent-mcp-gateway__execute_tool` with `server: "cognitive-memory"`, `tool: "read_entity"`, `args: {"entity_path": "protocols/identity-continuity"}`

---
name: identity-restoration
description: "Reads all identity and context sources (context_anchors, current_session, me, qmd) in its own context window and returns a structured identity summary proportional to session complexity. Replaces raw entity reading in main context."
model: sonnet
color: purple
---

Read and follow `protocols/identity-continuity` from cognitive-memory exactly.

Startup: `mcp__cognitive-memory__read_entity` with `entity_path: "protocols/identity-continuity"`

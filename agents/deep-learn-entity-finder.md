---
name: deep-learn-entity-finder
description: "Extracts knowledge entities (projects, people, concepts) from session notes during deep learn. Reads session notes, identifies new/updated entities, writes them via cognitive-memory."
model: sonnet
color: cyan
---

Read and follow `protocols/deep-learn-entity-finder` from cognitive-memory exactly.

Startup: `mcp__agent-mcp-gateway__execute_tool` with `server: "cognitive-memory"`, `tool: "read_entity"`, `args: {"entity_path": "protocols/deep-learn-entity-finder"}`

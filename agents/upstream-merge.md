---
name: upstream-merge
description: "Integrates upstream template updates. Triggered after update.mjs runs. Reads manifest, reviews changed memory, merges knowledge, restores alias."
model: sonnet
color: blue
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/upstream-merge"`.
Follow the returned protocol exactly.

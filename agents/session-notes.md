---
name: session-notes
description: "Records session notes to cognitive memory. Spawn immediately after significant tool use, findings, decisions, or corrections. Prompt should include: [sid:xxx] prefix, what triggered the note, note_type (context/insight/decision), and importance (low/medium/high)."
color: yellow
tools:
  - mcp__cognitive-memory__read_entity
  - mcp__cognitive-memory__add_session_note
---

Call `mcp__cognitive-memory__read_entity` with parameter `entity_path: "protocols/session-note-taking"`.
Follow the returned protocol exactly.

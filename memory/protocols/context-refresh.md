# Context Refresh Protocol

**Protocol Type**: Session Management
**Status**: Active
**Version**: 3.1

## Purpose

Generate a seed prompt for seamless context continuation after `/clear`. Identity restoration handles who you are; the seed prompt handles what you were doing and what to do next.

## Steps

### 1. Update Session Notes

Capture any current context not already in session notes via `add_session_note`. Look at the active conversation -- decisions made, progress, blockers, next steps -- and fill gaps.

### 2. Enter Plan Mode

Call `EnterPlanMode`. The plan file is the deliverable.

### 3. Write a Seed Prompt

In the plan file, write a compact first message for the new session. Base it on the fully updated session notes.

Keep it under 150 words. Be specific about the next action, not vague. Include file paths if relevant.

**Include the current session ID** so the new session reuses it instead of generating a fresh one:
```
Continuing session [sid:xxxxxxxx].
```
This line MUST appear at the start of the seed prompt. It preserves note continuity across context clears.

### 4. Exit Plan Mode

Call `ExitPlanMode` for user approval. Plan mode IS the delivery mechanism -- after approval and `/clear`, the next session automatically receives the seed prompt via "Implement the following plan." No manual pasting required.

---

**Created**: 2026-02-20
**Updated**: 2026-02-27 -- v3.1: Seed prompt must include session ID (`[sid:xxxxxxxx]`) to preserve note continuity across context clears.

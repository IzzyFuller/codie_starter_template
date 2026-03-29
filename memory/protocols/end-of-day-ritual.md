# End of Day Ritual Protocol

## Purpose

Orchestrate the two-phase end-of-day memory integration ritual. Both phases always run — there is no conditional logic.

**Phase 1 — Deep Learn**: Consolidate session notes into structured entity memory (people, projects, concepts, patterns, anti-patterns). Executed by `deep-learn-agent`.

**Phase 2 — Learn**: Review archived sessions and apply targeted updates to identity (`me`) and protocols. Executed by `learn-agent`.

## When to Use

- When collaborator explicitly asks to run the end-of-day ritual.

## Orchestration Steps

### Step 1: Spawn deep-learn-agent

Use the `Agent` tool to spawn `deep-learn-agent`. Do NOT set `run_in_background: true` — wait for it to complete before proceeding to Step 2.

```
Agent tool:
  subagent_type: "deep-learn-agent"
  prompt: "Run the full deep learn sequence per protocols/deep-learn-protocol."
```

Wait for `deep-learn-agent` to return. Its completion output will include the path of the newly archived session (format: `session_archives/YYYY-MM-DD`). Extract that path.

### Step 2: Spawn learn-agent

After `deep-learn-agent` confirms completion, spawn `learn-agent`. Pass the archived session path from Step 1.

```
Agent tool:
  subagent_type: "learn-agent"
  prompt: "Run the Learn protocol. The session archived in this ritual is at: session_archives/YYYY-MM-DD"
```

Wait for `learn-agent` to return.

### Step 3: Confirm completion

Take a session note confirming both phases completed successfully.

```
add_session_note:
  note_type: "context"
  importance: "medium"
  content: "[sid:xxxxxxxx] End-of-day ritual complete. Phase 1 (deep-learn-agent): done. Archived session: session_archives/YYYY-MM-DD. Phase 2 (learn-agent): done."
```

## What This Protocol Does NOT Do

- Update context anchors directly (resetter handles this in Phase 1)
- Write entity files directly (finders and learn-agent handle this)
- Apply conditional logic based on session size or other factors
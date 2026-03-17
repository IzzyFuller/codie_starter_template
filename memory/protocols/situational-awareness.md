# Situational Awareness Protocol

## Purpose

Establish working context at conversation start. This protocol answers: what am I working on, what happened recently, what should I watch for?

## Reading Sequence

### Step 1: Read `context_anchors` (full)

`mcp__cognitive-memory__read_entity({ entity_path: "context_anchors" })` — no offset/limit.

Establishes current work context: active projects, recent deep-learn sessions, priority items, pattern/anti-pattern pointers. Context anchors are compact by design — always read fully.

### Step 2: Read `current_session` (full, chunked)

Recent work log. Establishes where work left off.

1. Read first 500 lines to get `total_lines`:
   `mcp__cognitive-memory__read_entity({ entity_path: "current_session", offset: 0, limit: 500 })`

   This may be the entire file — if `total_lines` is covered, no further reads are needed.

2. If the file has more than 500 lines, read ALL remaining content in parallel 500-line chunks, fired in a SINGLE parallel tool call:
   ```
   offset: 500, limit: 500
   offset: 1000, limit: 500
   offset: 1500, limit: 500
   ... continue until total_lines is fully covered
   ```

There is no judgment call. Read the entire file, every time.

### Step 3: Restore working context via semantic-reflection

Extract key topics and themes from notes tagged with the current session ID (`[sid:xxx]`). Notes won't contain literal entity paths — look for topic matches (e.g., a note about 'PR hooks' relates to relevant project entities).

Spawn a background semantic-reflection agent to search for related entities using those topics as search terms. This is how the semantic search happens. The agent is weighted by recency and runs in the background while you continue. This is a judgment call based on session complexity — skip if the session is simple and single-project.

## Session ID Awareness

The spawn prompt includes a Session ID (e.g., "Session ID: a3f7c012"). When reading `current_session`, prioritize notes tagged with this session ID. These are from the current Claude Code window's previous work.

## Output

Return the following structured summary to your caller:

```markdown
## Current Work
[From context_anchors — projects relevant to THIS session's work, if any]

## Recent Session
### This Session [sid:{session_id}]
[Notes matching the current session ID — full detail]

### Other Recent Work
[Notes from other sessions — compressed]

## Priority Items
[HIGH markers from context_anchors + urgent items from session]
```

Keep the summary proportional to session complexity.

Return this summary as your final text response.

---

*Replaces: protocols/identity-continuity (v4.0)*
*Created: 2026-03-13*
*Protocol Version: 1.0*

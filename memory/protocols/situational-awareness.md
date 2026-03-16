# Situational Awareness Protocol

## Purpose

Establish working context at conversation start. This protocol answers: what am I working on, what happened recently, what should I watch for?

## Reading Sequence

### Step 1: Read `context_anchors` (full)

`read_entity({\"entity_path\": \"context_anchors\"})` — no offset/limit.

Establishes current work context: active projects, recent deep-learn sessions, priority items, pattern/anti-pattern pointers. Context anchors are compact by design — always read fully.

### Step 2: Read `current_session` (full, chunked)

Recent work log. Establishes where work left off.

1. Read first 50 lines to get `total_lines`:
   `read_entity({\"entity_path\": \"current_session\", \"offset\": 0, \"limit\": 50})`

2. Read ALL remaining content in parallel 500-line chunks, fired in a SINGLE parallel tool call:
   ```
   offset: 50, limit: 500
   offset: 550, limit: 500
   offset: 1050, limit: 500
   ... continue until total_lines is fully covered
   ```

There is no judgment call. Read the entire file, every time.

### Step 3: Read entities referenced by current session

Extract key topics and themes from notes tagged with the current session ID (`[sid:xxx]`), then search for related entities semantically. Notes won't contain literal entity paths — look for topic matches (e.g., a note about 'PR hooks' relates to relevant project entities).

Read those entities to restore working context. This is targeted, not exploratory.

### Step 4: Spawn semantic-reflection sub-agents (optional)

If the session notes reference multiple active projects, spawn semantic-reflection agents weighted by recency to surface relevant patterns and context. This is a judgment call based on session complexity.

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

## Active Patterns
[Top patterns relevant to current work]

## Active Anti-Patterns
[Recent corrections to watch for]
```

Keep the summary proportional to session complexity.

Return this summary as your final text response.

---

*Replaces: protocols/identity-continuity (v4.0)*
*Created: 2026-03-13*
*Protocol Version: 1.0*

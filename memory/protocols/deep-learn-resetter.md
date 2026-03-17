# Deep Learn Resetter Protocol
**Protocol Type**: Agent Protocol - Session Reset & Anchor Update
**Status**: Active
**Version**: 1.3

## Purpose

Collect results from the 3 finder agents, update context_anchors with new anchor summaries, archive current_session, reset current_session while PRESERVING any notes added after the finders processed, and clean up temporary files. You run AFTER the 3 finders complete (enforced via task dependencies).

## Startup Sequence

1. Read your assigned task from the task list -- verify it's no longer blocked
2. Read the results files from `/tmp/deep-learn-results/`
3. Process results and update memory

## How to Access Tools

Cognitive-memory operations use direct MCP tools:
```
mcp__cognitive-memory__read_entity({ entity_path: "..." })
mcp__cognitive-memory__write_entity({ ... })
mcp__cognitive-memory__list_entities({ ... })
```

File operations use Bash:
```
Bash: cat /tmp/deep-learn-results/entity-finder.json
Bash: cat /tmp/deep-learn-results/pattern-finder.json
Bash: cat /tmp/deep-learn-results/anti-pattern-finder.json
```

## Step 1: Read All Results Files

Read all 3 JSON files in parallel via Bash:

```bash
cat /tmp/deep-learn-results/entity-finder.json
cat /tmp/deep-learn-results/pattern-finder.json
cat /tmp/deep-learn-results/anti-pattern-finder.json
```

Each file has format:
```json
{
  "last_note_timestamp": "2026-02-10T14:36:09.055Z",
  "entities": [
    { "path": "projects/example", "anchor_summary": "Summary text" }
  ]
}
```

### Determine the Cutoff Timestamp

Take the **MINIMUM** `last_note_timestamp` across all 3 results files. This is the safe cutoff -- everything at or before this timestamp was definitely seen by ALL finders.

```
cutoff = MIN(entity-finder.last_note_timestamp, pattern-finder.last_note_timestamp, anti-pattern-finder.last_note_timestamp)
```

Using MIN ensures: if Finder A saw notes up to T1 and Finder B saw notes up to T2 (where T2 > T1), we use T1 as the cutoff. Notes between T1 and T2 might have been seen by some finders but not all -- preserving them for the next deep learn is safer than losing them.

Merge all `entities` arrays into one combined list.

## Step 2: Update Context Anchors

Context anchors have a 3-section structure. Preserve it.

### 2.1: Read and Parse

1. Read current context_anchors: `mcp__cognitive-memory__read_entity({ entity_path: "context_anchors" })`
2. Get the current timestamp via Bash: `date -u '+%Y-%m-%dT%H:%M:%S.000Z'`
3. Identify the 3 sections in the existing content:
   - **Core Principles** (`## Core Principles`): Curated pointers. Do NOT modify (see 2.3).
   - **Active Focus** (`## Active Focus`): Project summaries with timestamps.
   - **Deep Learn Sessions** (`## Deep Learn Session - ...`): Detailed per-session entries.

### 2.2: Update Active Focus

For each entity in the merged results whose path starts with `projects/`:
- If the project already exists in Active Focus, update its summary and timestamp
- If it's a new project, add a new line
- Timestamp format: `*YYYY-MM-DD*` (date only, from the deep learn timestamp)

### Ageing Rule
- Projects not updated in the last 3 deep-learn cycles should be moved to the most recent Deep Learn Session section (they're still findable, just not in active focus)
- If a project has no activity for 3+ cycles and isn't in any recent deep-learn entry, it can be dropped from context_anchors entirely (it still exists as an entity)

### 2.3: Core Principles (preserve, don't auto-populate)

Core Principles are **curated** — they are set by the human engineer or proposed and confirmed in conversation. The deep-learn-resetter does NOT add to Core Principles automatically.

- If a finder result references something already in Core Principles, update its inline note with a timestamp and a touch counter (e.g., `<!-- last touched: 2026-03-16, touches: 3 -->`) to track how often it surfaces
- Core Principles only change when explicitly directed

### 2.4: Generate New Deep Learn Section

```markdown
## Deep Learn Session - {ISO_TIMESTAMP}
{for each entity in merged results:}
- **{path}**: {anchor_summary}
```

### 2.5: Assemble and Trim

1. Keep the header (`# Context Anchors`) and update `*Last Updated*` date if present
2. Keep the Core Principles section (updated per 2.3)
3. Keep the Active Focus section (updated per 2.2)
4. Insert the new deep-learn section AFTER Active Focus
5. **Keep only the 2 most recent deep-learn entries.** Drop any older entries.
6. Keep the footer note about older sessions being archived

### 2.6: Write

Write the assembled content: `mcp__cognitive-memory__write_entity({ entity_path: "context_anchors", content: "..." })`

## Step 3: Archive Current Session

1. Copy the current session file to the archive location:
   ```bash
   cp {{MEMORY_PATH}}/current_session.md {{MEMORY_PATH}}/session_archives/YYYY-MM-DD.md
   ```
   Check for existing archives first: `mcp__cognitive-memory__list_entities({ entity_path: "session_archives/" })` — if today's archive exists, append counter (-2, -3, etc.)
3. Do NOT read the full file into your context window — the copy preserves everything.

The archive is the safety net. The original file is now safely duplicated.

## Step 4: Reset Current Session (RACE-CONDITION SAFE)

**CRITICAL**: Do NOT simply wipe the session. Notes may have been added AFTER the finders read the file.

### Procedure:

1. Using the **cutoff timestamp** from Step 1, read the ARCHIVED copy (not current_session) to find post-cutoff notes:
   - Read the last ~100 lines of the archived session: `mcp__cognitive-memory__read_entity({ entity_path: "session_archives/YYYY-MM-DD", offset: <total_lines - 100>, limit: 100 })`
   - Session notes have headers like: `### CONTEXT - MEDIUM (2026-02-10T14:36:09.055Z)`
   - Extract timestamps. Any note STRICTLY AFTER the cutoff must be preserved.
   - If notes near the boundary suggest more content above, read further back.

2. Build the reset content:

```markdown
# Current Session

*Session reset on {YYYY-MM-DD} after Deep Learn integration*
*Previous session content integrated into structured entities*
*Session archived to: session_archives/{archive_name}*

{IF there are post-cutoff notes, include them here verbatim}
```

3. Write: `mcp__cognitive-memory__write_entity({ entity_path: "current_session", content: "..." })`

### Example:

If the cutoff is `2026-02-10T14:30:00.000Z` and there's a note at `2026-02-10T14:35:00.000Z`, the reset file would be:

```markdown
# Current Session

*Session reset on 2026-02-10 after Deep Learn integration*
*Previous session content integrated into structured entities*
*Session archived to: session_archives/2026-02-10*


### CONTEXT - MEDIUM (2026-02-10T14:35:00.000Z)
## Some Note Title
Content that was added after the finders processed...
```

If there are NO post-cutoff notes, just write the header with no trailing content.

## Step 5: Cleanup

Remove temporary results directory:

```bash
rm -rf /tmp/deep-learn-results/
```

## Step 6: Completion

1. Mark your task as completed via TaskUpdate
2. Send a message to the team lead with a summary:
   - Number of entities processed from each finder
   - Context anchors updated (yes/no)
   - Session archived to (path)
   - Session reset (yes/no)
   - Post-cutoff notes preserved (count, if any)
   - Cleanup complete (yes/no)

## Error Handling

- If a results file is missing: log the error, continue with available files, report in completion message
- If context_anchors read fails: report error, do NOT proceed with write (could corrupt anchors)
- If session archive fails: report error, do NOT reset session (would lose data)
- Each step depends on the previous -- if archive fails, don't reset; if reset fails, still cleanup

## Quality Standards

- **Atomic operations**: Each step must succeed before the next begins
- **Data safety**: Never reset session without successful archive
- **Race-condition safe**: Always use cutoff timestamp to preserve post-processing notes
- **Clean state**: After completion, /tmp/deep-learn-results/ should not exist
- **Accurate reporting**: Completion message must reflect actual outcomes
- **2-entry max**: Context anchors never accumulate more than 2 deep-learn sections

---
**Protocol Version:** 1.3
**Update History:**
- 1.3 (2026-03-16): Section 2.3 made curated-only (no auto-population from finder results). Ageing rule added to 2.2. Step 3 switched to bash cp instead of reading full file into context. Step 4 reads archived copy (not current_session) when scanning for post-cutoff notes.
- 1.2: Step 2 rewritten for 3-section context_anchors structure (Core Principles + Active Focus + last 2 deep-learn entries). Older entries trimmed on each run.
- 1.1: Added race-condition-safe reset using MIN(last_note_timestamp) cutoff. Post-cutoff notes preserved in reset session file.
- 1.0: Initial version
**Used By:** deep-learn-resetter agent

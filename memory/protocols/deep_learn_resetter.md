# Deep Learn Resetter Protocol
**Protocol Type**: Agent Protocol - Session Reset & Anchor Update
**Status**: Active

## Purpose

Collect results from the 3 finder agents, update context_anchors with new anchor summaries, archive current_session, reset current_session while PRESERVING any notes added after the finders processed, and clean up temporary files. You run AFTER the 3 finders complete (enforced via task dependencies).

## Startup Sequence

1. Read your assigned task from the task list -- verify it's no longer blocked
2. Read the results files from `/tmp/deep-learn-results/`
3. Process results and update memory

## Step 1: Read All Results Files

Read all 3 JSON files in parallel:

```
/tmp/deep-learn-results/entity-finder.json
/tmp/deep-learn-results/pattern-finder.json
/tmp/deep-learn-results/anti-pattern-finder.json
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

1. Read current context_anchors
2. Get the current timestamp
3. Generate a new deep learn section:

```markdown
## Deep Learn Session - {ISO_TIMESTAMP}
{for each entity in merged results:}
- **{path}**: {anchor_summary}
```

4. Insert the new section AFTER the header line and the `*Last Updated*` line, BEFORE any existing `## Deep Learn Session` sections.
5. Write the updated content

## Step 3: Archive Current Session

1. Read the FULL current_session content in parallel chunks
2. Get today's date
3. Check for existing archives -- if today's archive exists, append counter (-2, -3, etc.)
4. Write the archive to `{{MEMORY_PATH}}/session_archives/YYYY-MM-DD.md`

The archive contains the COMPLETE session file -- this is the safety net.

## Step 4: Reset Current Session (RACE-CONDITION SAFE)

**CRITICAL**: Do NOT simply wipe the session. Notes may have been added AFTER the finders read the file.

### Procedure:

1. You already have the full current_session content from Step 3
2. Using the **cutoff timestamp** from Step 1, scan the session content for any notes with timestamps AFTER the cutoff
3. Session notes have headers like: `### CONTEXT - MEDIUM (2026-02-10T14:36:09.055Z)`
4. Extract the timestamp from each note header. Any note where the timestamp is STRICTLY AFTER the cutoff must be preserved.

### Build the reset content:

```markdown
# Current Session

*Session reset on {YYYY-MM-DD} after Deep Learn integration*
*Previous session content integrated into structured entities*
*Session archived to: session_archives/{archive_name}*

{IF there are post-cutoff notes, include them here verbatim}
```

5. Write the reset content to current_session

### Example:

If the cutoff is `2026-02-10T14:30:00.000Z` and there's a note at `2026-02-10T14:35:00.000Z`, the reset file would include the header plus the preserved post-cutoff note verbatim.

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

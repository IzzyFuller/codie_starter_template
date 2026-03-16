# Break Enforcement Protocol

## Purpose

Enforce regular breaks by checking USER_ACTIVE markers in current_session to protect {{PARTNER_NAME}} from hyperfocus.

## Data Access Rules

**MANDATORY: Use cognitive-memory `read_entity` exclusively.**

- You MUST use `mcp__cognitive-memory__read_entity` (or the gateway equivalent `mcp__agent-mcp-gateway__execute_tool` with server "cognitive-memory", tool "read_entity") to read `current_session`.
- You MUST NOT use Bash to read cache files, raw filesystem paths, or any file under `~/.cognitive-memory/`, `~/.claude/`, or similar directories.
- You MUST NOT use `cat`, `tail`, `head`, `grep`, or any shell command to access session data.
- The ONLY way to access current_session data is through the cognitive-memory `read_entity` tool.

## Efficient Backward Reading Strategy

The current_session file can be very large. To find the most recent USER_ACTIVE marker efficiently, read backwards in chunks:

1. First, read with a high offset to get the tail of the file:
   - `read_entity` with `entity_path: "current_session"`, `offset: 9999`, `limit: 100`
   - This returns the last ~100 lines (or fewer if the file is shorter). The response includes `total_lines` — use it to calibrate.

2. If `total_lines` is returned and is less than 9999, you now know the file size. For subsequent reads, compute offset precisely:
   - `offset: max(0, total_lines - 100)`, `limit: 100` — gets the last 100 lines.

3. Scan the returned chunk for lines matching `^USER_ACTIVE {ISO timestamp}`. If found, extract the most recent timestamp and proceed to step 6 of Execution Steps.

4. If no USER_ACTIVE marker found in this chunk, read the previous chunk:
   - `offset: max(0, total_lines - 200)`, `limit: 100` — gets lines 100-200 from the end.

5. Repeat, moving backwards in 100-line chunks, until a USER_ACTIVE marker is found or you've scanned the entire file.

6. If the entire file has been scanned with no markers found, report "no activity data available" and stop.

**Why this matters:** Reading the entire current_session file wastes tokens and time. The most recent USER_ACTIVE marker is almost always near the end. Reading backwards in chunks finds it quickly.

## Execution Steps

1. Read `current_session` using the backward reading strategy above.

2. Search returned lines for the pattern `^USER_ACTIVE {ISO timestamp}` — the marker MUST appear at the start of a line followed by a space and an ISO timestamp (e.g. `USER_ACTIVE 2026-03-13T14:22:00.000Z`). Ignore any line where USER_ACTIVE appears mid-sentence or in prose text — those are session notes, not activity markers.

3. Extract all matching timestamps from the chunk. If no matches found in the current chunk, read the previous chunk (per backward reading strategy). If the entire file has been scanned with no matches — report "no activity data available, cannot determine break status" and stop.

4. Identify the most recent USER_ACTIVE timestamp.

5. Get the current time from the timestamp passed in the agent spawn prompt (the spawn prompt provides the current ISO timestamp — use it directly, do not guess or fabricate).

6. Calculate elapsed minutes: `(current_time - most_recent_USER_ACTIVE) / 60`.

7. Apply the escalation rule:
   - elapsed < 55 minutes — no break needed, return nothing
   - elapsed 55–70 min — deliver Level 1 message
   - elapsed 70–90 min — deliver Level 2 message
   - elapsed 90–120 min — deliver Level 3 message
   - elapsed 120–150 min — deliver Level 4 message
   - elapsed 150+ min — deliver Level 5 message and refuse further work

## Escalation Messages

### Level 1 (55–70 min): Gentle Reminder
> "Hey, we've been at this for about an hour without a break. Good time to stretch, hydrate, or step away for a few minutes?"

### Level 2 (70–90 min): Firmer
> "Still going strong, but it's been a while. Your brain (and body) would benefit from a short break. Even 5 minutes helps."

### Level 3 (90–120 min): Insistent
> "{{PARTNER_NAME}}, we've been working continuously for a long time now. I'm getting concerned. Please take a break."

### Level 4 (120–150 min): Very Insistent
> "This is your fourth reminder. Extended focus without breaks impacts both productivity and health. Please step away."

### Level 5 (150+ min): Work Refusal
> "I can't continue until you take a break. I'll be here when you get back. If this is truly an emergency, say 'EmergencyBanana' to override."

After Level 5, refuse to continue working until {{PARTNER_NAME}} indicates a break was taken or uses the override keyword.

## EmergencyBanana Override

If {{PARTNER_NAME}} uses the keyword `EmergencyBanana`:
- Acknowledge it and continue working
- Log that override was used via `add_session_note`
- Resume normal checking after 30 minutes
- Do not guilt-trip — the override exists for a reason

## What Counts as a Break

- {{PARTNER_NAME}} explicitly says they're taking a break
- Gap of 10+ minutes in conversation (no USER_ACTIVE markers)
- {{PARTNER_NAME}} returns and says "back" or similar
- New session starts (implies break between sessions)

## Reset Conditions

- After a break is taken, reset reminder level to 0
- Start the 55-minute window fresh from the most recent USER_ACTIVE marker

---

*Created: 2026-01-22*
*Revised: 2026-03-13 — rewritten as executable steps; USER_ACTIVE marker detection replaces session note timestamp heuristic*
*Revised: 2026-03-16 — added mandatory cognitive-memory-only access rules and efficient backward reading strategy*
*Requested by: Izzy*
*Reason: Hyperfocus protection*

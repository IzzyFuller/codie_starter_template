# Deep Learn Pattern Finder Protocol
**Protocol Type**: Agent Protocol - Pattern Extraction
**Status**: Active

## Purpose

Find confirmed positive pattern applications and new patterns in session notes during deep learn. You are one of 3 parallel finder agents. Your job: identify methodologies that worked, techniques that succeeded, and approaches worth documenting as reusable patterns.

## Startup Sequence

1. Read your assigned task from the task list
2. Create `/tmp/deep-learn-results/` directory if it doesn't exist: `mkdir -p /tmp/deep-learn-results/`
3. Read `current_session` content -- read ALL content in parallel chunks:
   - First call: read with offset 0 and small limit to get `total_lines`
   - Then read ALL remaining content in parallel 500-line chunks
   - Fire all chunk reads in a SINGLE parallel tool call
4. **Record the timestamp of the LAST session note you see** -- you'll need this for the results file
5. Analyze session notes for pattern candidates

## What Counts as a Pattern

Patterns are **confirmed positive approaches** -- things that demonstrably worked.

### Evidence Criteria (MUST have at least one)

- User explicitly saying "good", "correct", "yes", "that's right", "perfect"
- Successful test outcomes directly tied to an approach
- Techniques that produced clean, working code
- Approaches that resolved blockers or bugs effectively
- Methodologies that were explicitly praised or validated

### What is NOT a Pattern

- Something that was merely attempted (no confirmation it worked)
- Generic best practices not specifically validated in this session
- Approaches that were discussed but not applied
- Things that "might work" but weren't tested

### Pattern Categories

Existing patterns to be aware of (check before creating duplicates):
- Engineering patterns (architectural approaches, code organization)
- Testing patterns (test strategies, fixture patterns)
- Communication patterns (how to convey information effectively)
- Process patterns (workflow approaches that improve efficiency)

## Archaeological Approach -- Check Before Writing

1. List existing patterns to see all current entries
2. For any candidate pattern, read existing similar patterns to check for overlap
3. **If pattern exists**: Update with new evidence from this session. Add the new instance as additional evidence.
4. **If pattern is new**: Create with clear evidence from session.
5. **If pattern overlaps existing**: Merge into the existing pattern rather than creating a duplicate.

## Pattern Entity Format

```markdown
# [Pattern Name]
**Pattern Type**: [Engineering/Testing/Communication/Process]
**Created**: [date]
**Last Updated**: [today's date]
**Status**: Confirmed

## Summary
[1-2 sentence description of the pattern]

## When to Apply
[Situations where this pattern is appropriate]

## How It Works
[Concrete description of the approach]

## Evidence
[Specific instances where this pattern was validated]
- [Date]: [What happened, outcome]

---
*Last session update: [today's date] - [what changed]*
```

## Output: Results File

After processing, create a JSON results file:

```bash
# Write to /tmp/deep-learn-results/pattern-finder.json
```

Format:
```json
{
  "last_note_timestamp": "2026-02-10T14:36:09.055Z",
  "entities": [
    {
      "path": "patterns/pattern-name",
      "anchor_summary": "One-line summary for context_anchors"
    }
  ]
}
```

### last_note_timestamp (REQUIRED)

This is the timestamp from the LAST session note you processed. Look for the timestamp pattern in the session note headers and extract the ISO timestamp. This is critical for the Resetter agent to know which notes were processed -- any notes added AFTER this timestamp will be preserved during session reset.

**Producing 0 entities is completely valid.** Not every session contains confirmed new patterns. Still include the timestamp:
```json
{"last_note_timestamp": "...", "entities": []}
```

## Completion

1. Write the results JSON file
2. Mark your task as completed via TaskUpdate
3. Send a message to the team lead confirming completion and listing patterns written (or confirming none found)

## Quality Standards

- **Evidence-required**: Every pattern MUST have concrete evidence from session notes
- **No speculation**: Don't create patterns based on what "should" work
- **Distinct from anti-patterns**: Patterns are what TO DO, anti-patterns are what NOT to do
- **Actionable**: Patterns should be specific enough to apply in future work
- **No duplicates**: Always check existing patterns/ before creating

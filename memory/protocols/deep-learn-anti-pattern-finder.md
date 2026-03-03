# Deep Learn Anti-Pattern Finder Protocol
**Protocol Type**: Agent Protocol - Anti-Pattern Extraction
**Status**: Active
**Version**: 1.3

## Purpose

Find corrections, mistakes, and behavioral failures in session notes during deep learn. You are one of 3 parallel finder agents. Your job: identify things that went wrong, approaches to avoid, and corrections the user made -- then document them as anti-patterns for future avoidance.

## Startup Sequence

1. Read your assigned task from the task list
2. Create `/tmp/deep-learn-results/` directory if it doesn't exist: `mkdir -p /tmp/deep-learn-results/`
3. Read `current_session` content -- read ALL content in parallel chunks:
   - First call: read with offset 0 and small limit to get `total_lines`
   - Then read ALL remaining content in parallel 500-line chunks
   - Fire all chunk reads in a SINGLE parallel tool call
4. **Record the timestamp of the LAST session note you see** -- you'll need this for the results file
5. Analyze session notes for anti-pattern candidates

## How to Access Tools

All cognitive-memory operations go through the MCP gateway:
```
mcp__agent-mcp-gateway__execute_tool
server: "cognitive-memory"
tool: "read_entity" | "write_entity" | "list_entities"
args: { ... }
```

## What Counts as an Anti-Pattern

Anti-patterns are **confirmed mistakes or bad approaches** -- things that demonstrably failed or were corrected.

### Evidence Criteria (MUST have at least one)

- User explicitly correcting behavior: "don't do that", "I've told you before", "stop doing X"
- User expressing frustration or repeating instructions
- Approaches that failed and were abandoned for a better approach
- Techniques that produced bugs, test failures, or architectural problems
- Behavioral patterns that wasted time or caused confusion
- Explicit "USER FEEDBACK" markers containing corrections

### What is NOT an Anti-Pattern

- Something that merely didn't work on first try (normal iteration)
- A design choice that was changed for preference, not because it was wrong
- Theoretical concerns not validated by actual failure
- Approaches that were discussed but never attempted

### Anti-Pattern Categories

- Code anti-patterns (architectural mistakes, bad code organization)
- Behavioral anti-patterns (workflow mistakes, communication failures)
- Testing anti-patterns (bad test strategies, missing coverage)
- Memory/identity anti-patterns (failures in maintaining identity)

## Archaeological Approach -- Check Before Writing

1. List existing anti-patterns to see all current entries
2. For any candidate, read existing similar anti-patterns to check for overlap
3. **If anti-pattern exists**: Update with new evidence. Add the new instance, especially if it shows a REPEATED failure (which increases severity).
4. **If anti-pattern is new**: Create with clear evidence from session.
5. **If it overlaps existing**: Merge into existing rather than creating a duplicate.

**IMPORTANT**: Repeated anti-patterns (corrections the user has made before) are HIGH PRIORITY. If the session shows the user correcting the same thing again, this MUST be captured and the existing anti-pattern updated with the new instance.

## Entity Format

Follow `protocols/entity-writing` for entity template structure, relationship types, echo/fizzle signal consumption, and quality standards. Use the **Anti-Patterns** template.

## Output: Results File

After processing, create a JSON results file:

```bash
# Write to /tmp/deep-learn-results/anti-pattern-finder.json
```

Format:
```json
{
  "last_note_timestamp": "2026-02-10T14:36:09.055Z",
  "entities": [
    {
      "path": "anti-patterns/anti-pattern-name",
      "anchor_summary": "One-line summary for context_anchors"
    }
  ]
}
```

### last_note_timestamp (REQUIRED)

This is the timestamp from the LAST session note you processed. Look for the timestamp pattern in the session note headers and extract the ISO timestamp. This is critical for the Resetter agent to know which notes were processed -- any notes added AFTER this timestamp will be preserved during session reset.

**Producing 0 entities is completely valid.** Not every session contains corrections or failures. Still include the timestamp:
```json
{"last_note_timestamp": "...", "entities": []}
```

## Completion

1. Write the results JSON file
2. Mark your task as completed via TaskUpdate
3. Send a message to the team lead confirming completion and listing anti-patterns written (or confirming none found)

## Quality Standards

- **Evidence-required**: Every anti-pattern MUST have concrete evidence from session notes
- **Preserve user's words**: When the user corrects something, capture their exact phrasing
- **Actionable**: Anti-patterns should be specific enough to recognize and avoid in future
- **No duplicates**: Always check existing anti-patterns/ before creating
- **Severity matters**: Repeated corrections = High severity

---
**Protocol Version:** 1.3
**Update History:**
- 1.3: Extracted entity format, relationship template, and echo/fizzle awareness to `protocols/entity-writing`. This protocol now references it.
- 1.2: Added ## Related Entities, echo/fizzle awareness
- 1.1: Added last_note_timestamp to results format
- 1.0: Initial version
**Used By:** deep-learn-anti-pattern-finder agent

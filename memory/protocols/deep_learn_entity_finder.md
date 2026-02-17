# Deep Learn Entity Finder Protocol
**Protocol Type**: Agent Protocol - Entity Extraction
**Status**: Active

## Purpose

Extract knowledge entities (projects/, people/, concepts/) from session notes during deep learn. You are one of 3 parallel finder agents. Your job: read session notes, identify entities that need creating or updating, write them to memory, and report results.

## Startup Sequence

1. Read your assigned task from the task list to understand any specific instructions
2. Create `/tmp/deep-learn-results/` directory if it doesn't exist: `mkdir -p /tmp/deep-learn-results/`
3. Read `current_session` content -- read ALL content in parallel chunks:
   - First call: read with offset 0 and small limit to get `total_lines`
   - Then read ALL remaining content in parallel 500-line chunks
   - Fire all chunk reads in a SINGLE parallel tool call
4. **Record the timestamp of the LAST session note you see** -- you'll need this for the results file
5. Analyze the session notes for entity candidates

## Entity Identification Strategy

### What to Look For

| Entity Type | Path Prefix | Signals |
|-------------|-------------|----------|
| Projects | projects/ | Technical work, architecture decisions, code changes, test results, deployments |
| People | people/ | Collaboration mentions, feedback from others, relationship updates |
| Concepts | concepts/ | Theoretical frameworks, mental models, emerging ideas discussed multiple times |

### Frequency Filter

- **3+ mentions** across session notes -> strong candidate for entity creation/update
- **Single mention** -> skip UNLESS user explicitly emphasized importance (HIGH marker, USER FEEDBACK marker)
- **Recurring across prior sessions** (visible in existing entities) -> definitely update

### Importance Signals

- Notes marked `HIGH` importance -> prioritize
- `USER FEEDBACK` markers -> high priority, preserve verbatim quotes
- `DECISION` markers -> capture architectural choices and rationale
- `INSIGHT` markers -> capture discoveries and pattern recognition

## Archaeological Approach -- Check Before Writing

Before creating or updating ANY entity:

1. List existing entities in the relevant directory to see what exists
2. Read existing entities with similar names to check for overlap
3. **If entity exists**: Merge new information with existing content. PRESERVE existing content not mentioned in this session. Add new sections or update existing ones.
4. **If entity doesn't exist**: Create with full structure.

**CRITICAL**: Never overwrite existing entity content that isn't mentioned in the current session. Merge, don't replace.

## Entity Content Format

```markdown
# [Entity Name]
**Type**: [people/projects/concepts]
**Created**: [date]
**Last Updated**: [today's date]

## Summary
[2-3 sentence overview]

## Key Details
[Structured content -- be specific, include file paths, test counts, architecture notes]

## Evidence/Examples
[Specific instances, quotes, measurements]

---
*Last session update: [today's date] - [what changed]*
```

## Output: Results File

After writing all entities, create a JSON results file:

```bash
# Write to /tmp/deep-learn-results/entity-finder.json
```

Format:
```json
{
  "last_note_timestamp": "2026-02-10T14:36:09.055Z",
  "entities": [
    {
      "path": "projects/example-project",
      "anchor_summary": "One-line summary of current relevance for context_anchors"
    }
  ]
}
```

### last_note_timestamp (REQUIRED)

This is the timestamp from the LAST session note you processed. Look for the timestamp pattern in the session note headers and extract the ISO timestamp. This is critical for the Resetter agent to know which notes were processed -- any notes added AFTER this timestamp will be preserved during session reset.

The `anchor_summary` should be 1-2 sentences capturing what's currently relevant about this entity. It will be used in context_anchors by the Resetter agent.

**If no entities need creating/updating**, still include the timestamp:
```json
{"last_note_timestamp": "...", "entities": []}
```

## Completion

1. Write the results JSON file
2. Mark your task as completed via TaskUpdate
3. Send a message to the team lead confirming completion and listing entities written

## Quality Standards

- **Specific over vague**: Include concrete details (file paths, test counts, commit hashes)
- **Preserve granularity**: Don't over-summarize -- keep the detail that makes entities useful
- **Include evidence**: Quotes, outcomes, measurements from session notes
- **Maintain chronology**: Note when things happened within the session
- **No hallucination**: Only write what's actually in the session notes

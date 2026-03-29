# Deep Learn Protocol
**Protocol Type**: Memory Integration - Session Consolidation
**Status**: Active
**Version**: 5.0

## Purpose

Consolidate session notes into structured entity memory. Runs as a **4-agent team** to keep raw session content OUT of the main conversation context. Agents read session notes in their own context windows; only confirmation messages return to the orchestrator.

## Core Principle

**Session notes are working memory; entities are long-term memory.** Deep Learn bridges these by synthesizing session details into structured, categorized entity files that persist across conversation instances.

## When to Run

Run Deep Learn when the human explicitly requests it — either directly ("run deep learn") or as part of the end-of-day ritual.

## Key Architectural Distinction from Learn

| Protocol | Updates | Focus | Frequency |
|----------|---------|-------|----------|
| **Deep Learn** | people/, projects/, concepts/, patterns/, anti-patterns/, context_anchors | Knowledge + behavioral consolidation | On explicit request |
| **Learn** | me, protocols/ | Identity + protocol updates | Periodic, on archives |

**Deep Learn** = What I know about the world + confirmed patterns/anti-patterns
**Learn** = Who I am + how protocols work

---

## Team Architecture

### Agents

| Agent | Type | Role |
|-------|------|------|
| **Orchestrator** | `deep-learn-agent` | Prepares environment, spawns finders in parallel, waits, spawns resetter |
| **Entity Finder** | `deep-learn-entity-finder` | Extract projects/, people/, concepts/ + build co-echo relationships from ECHO/FIZZLE signals |
| **Pattern Finder** | `deep-learn-pattern-finder` | Find confirmed positive patterns |
| **Anti-Pattern Finder** | `deep-learn-anti-pattern-finder` | Find corrections and failures |
| **Resetter** | `deep-learn-resetter` | Collect results, update anchors, archive, reset |

### Data Flow

```
current_session (read by each finder in their own context)
    |-> Entity Finder      -> write_entity(projects/*, people/*, concepts/*)
    |-> Pattern Finder      -> write_entity(patterns/*)
    |-> Anti-Pattern Finder -> write_entity(anti-patterns/*)
    |
    |   [all three write results to /tmp/deep-learn-results/*.json]
    |
    +-> Resetter (spawned only after above complete)
            |- reads /tmp/deep-learn-results/*.json
            |- updates context_anchors with all anchor summaries
            |- archives current_session -> session_archives/YYYY-MM-DD
            +- resets current_session
```

### Result Passing (Finders -> Resetter)

Each finder writes a JSON results file to `/tmp/deep-learn-results/`:
```json
{ "entities": [{ "path": "projects/example", "anchor_summary": "Summary text" }] }
```

Resetter reads all three, merges, builds context_anchors section. Files avoid routing content through main conversation context.

---

## Orchestration Workflow

This is what `deep-learn-agent` executes.

### Step 1: Prepare

```bash
mkdir -p /tmp/deep-learn-results/
```

### Step 2: Spawn Finders in Parallel

Spawn all three finder agents simultaneously using `Agent` tool with `run_in_background: true`:

```
Agent tool — call 1:
  subagent_type: "deep-learn-entity-finder"
  run_in_background: true
  prompt: "Read current_session, identify projects/people/concepts entities, write via cognitive-memory, output results to /tmp/deep-learn-results/entity-finder.json"

Agent tool — call 2:
  subagent_type: "deep-learn-pattern-finder"
  run_in_background: true
  prompt: "Read current_session, identify validated positive patterns, write to patterns/, output results to /tmp/deep-learn-results/pattern-finder.json"

Agent tool — call 3:
  subagent_type: "deep-learn-anti-pattern-finder"
  run_in_background: true
  prompt: "Read current_session, identify corrections/failures, write to anti-patterns/, output results to /tmp/deep-learn-results/anti-pattern-finder.json"
```

All three calls must be issued in the same turn so they run in parallel.

### Step 3: Wait for Finders

Wait for all three background agents to complete before proceeding.

### Step 4: Spawn Resetter

After all three finders confirm completion, spawn the resetter (NOT in background — wait for it):

```
Agent tool:
  subagent_type: "deep-learn-resetter"
  run_in_background: false
  prompt: "Read /tmp/deep-learn-results/*.json, update context_anchors, archive current_session to session_archives/YYYY-MM-DD, reset session, cleanup /tmp/deep-learn-results/"
```

### Step 5: Verify & Cleanup

After Resetter completes:

1. Verify context_anchors updated — check for new Deep Learn Session section
2. Verify session reset — should be minimal
3. Verify cleanup: `/tmp/deep-learn-results/` should not exist
4. Report the archived session path (e.g. `session_archives/2026-03-27`) to the caller

**Success criteria:**
- Context anchors have new timestamped section with entity summaries
- Session is archived and reset
- /tmp/deep-learn-results/ is cleaned up
- Main conversation context consumed minimal tokens (no raw session content)

---

## Entity Type Quick Reference

### people/
- User feedback, collaboration patterns
- Preferences, teaching moments
- Relationship evolution

### projects/
- Technical progress, architecture decisions
- Blockers, completions
- Related PRs/commits

### concepts/
- Theoretical frameworks
- Mental models spanning contexts
- Industry connections

### patterns/
- Confirmed positive approaches (evidence required)
- Techniques that demonstrably worked
- Validated by user feedback or successful outcomes

### anti-patterns/
- Confirmed mistakes or bad approaches (evidence required)
- User corrections and frustrations
- Repeated failures increase severity

### context_anchors
- Updated by Resetter with new Deep Learn Session section
- Contains anchor summaries for all entities created/updated

---

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Reading session notes into main context | Use agent team — agents read in their context |
| Over-consolidation (losing detail) | When in doubt, keep more detail |
| Under-consolidation (entity for every note) | Apply frequency/importance filters |
| Anchor data dump | Keep summaries to 1-2 sentences |
| Ignoring existing entities | Agents always list_entities first |
| Context compaction during deep learn | Team architecture prevents this |

---

## Integration with Other Protocols

- **End of Day Ritual**: Spawns deep-learn-agent as Phase 1, then learn-agent as Phase 2
- **Learn Protocol**: Operates on archived sessions for identity/protocol updates

---

**Protocol Version:** 5.0
**Update History:**
- 5.0: Removed size-based triggers. Deep Learn now runs on explicit human request only. Replaced Teammate/TaskCreate orchestration with Agent tool + run_in_background: true. Added deep-learn-agent as named orchestrator type in team architecture table.
- 4.1: Entity Finder now processes ECHO/FIZZLE session note markers to build co-echo relationships between entities that prove useful together (2+ co-occurrence threshold)
- 4.0: Replaced sequential manual workflow with 4-agent team architecture. 3 parallel finders (entity, pattern, anti-pattern) + 1 sequential resetter. Results passed via /tmp/deep-learn-results/*.json to avoid routing through main context.
- 3.1: Changed read_entity pagination from tail/head to offset/limit parameters
- 3.0: Restructured as size-triggered protocol running 2-3x/day. Removed coupling to end-of-day ritual.
- 2.0: Complete workflow rewrite with entity type guidance
- 1.0: Initial version

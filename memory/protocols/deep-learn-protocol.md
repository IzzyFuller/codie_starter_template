# Deep Learn Protocol
**Protocol Type**: Memory Integration - Size-Triggered Session Consolidation
**Status**: Active
**Version**: 4.1

## Purpose

Consolidate session notes into structured entity memory when the session file grows too large to effectively read. This is a **reactive, size-triggered** protocol that runs multiple times per day as needed.

## Core Principle

**Session notes are working memory; entities are long-term memory.** Deep Learn bridges these by synthesizing session details into structured, categorized entity files that persist across conversation instances.

**Architecture Principle (v4.0):** Deep Learn runs as a **4-agent team** to keep raw session content OUT of the main conversation context. Agents read session notes in their own context windows; only confirmation messages return to the orchestrator.

## When to Trigger

### Primary Trigger: Size-Based

Run Deep Learn when current_session content approaches the effective read limit:

**Indicators it's time:**
- `mcp__cognitive-memory__read_entity` response shows `total_lines` significantly higher than `returned_lines`
- Need to use `offset`/`limit` parameters to paginate content
- Session notes feel unwieldy to process
- Multiple significant work sessions since last integration

### Secondary Triggers

- Before major context clears
- End of day if session is substantial (combine with End of Day ritual)
- After completing a major project milestone

### Expected Frequency

**2-3 times per day** during active work. Don't let session notes accumulate beyond comfortable reading.

## Key Architectural Distinction from Learn

| Protocol | Updates | Focus | Frequency |
|----------|---------|-------|----------|
| **Deep Learn** | people/, projects/, concepts/, patterns/, anti-patterns/, context_anchors | Knowledge + behavioral consolidation | Size-triggered, 2-3x/day |
| **Learn** | me.md, protocols/ | Identity + protocol updates | Periodic, on archives |

**Deep Learn** = What I know about the world + confirmed patterns/anti-patterns
**Learn** = Who I am + how protocols work

---

## Team Architecture

### Agents

| Agent | Type | Role |
|-------|------|------|
| **Entity Finder** | `deep-learn-entity-finder` | Extract projects/, people/, concepts/ + build co-echo relationships from ECHO/FIZZLE signals |
| **Pattern Finder** | `deep-learn-pattern-finder` | Find confirmed positive patterns |
| **Anti-Pattern Finder** | `deep-learn-anti-pattern-finder` | Find corrections and failures |
| **Resetter** | `deep-learn-resetter` | Collect results, update anchors, archive, reset |

### Data Flow

```
current_session (read by each finder in their own context)
    |-> Entity Finder      -> mcp__cognitive-memory__write_entity(projects/*, people/*, concepts/*)
    |-> Pattern Finder      -> mcp__cognitive-memory__write_entity(patterns/*)
    |-> Anti-Pattern Finder -> mcp__cognitive-memory__write_entity(anti-patterns/*)
    |
    |   [all three write results to /tmp/deep-learn-results/*.json]
    |
    +-> Resetter (blocked until above complete)
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

This is what the **main conversation** executes when triggering deep learn:

### Step 1: Prepare

```bash
mkdir -p /tmp/deep-learn-results/
```

### Step 2: Spawn Team

```
Teammate tool: spawnTeam
team_name: "deep-learn"
description: "Deep Learn session consolidation"
```

### Step 3: Create Tasks

Create 4 tasks via TaskCreate:

1. **"Extract knowledge entities from session notes"**
   - Description: Read current_session, identify projects/people/concepts entities, write via cognitive-memory, output results to /tmp/deep-learn-results/entity-finder.json

2. **"Find confirmed patterns in session notes"**
   - Description: Read current_session, identify validated positive patterns, write to patterns/, output results to /tmp/deep-learn-results/pattern-finder.json

3. **"Find anti-patterns and corrections in session notes"**
   - Description: Read current_session, identify corrections/failures, write to anti-patterns/, output results to /tmp/deep-learn-results/anti-pattern-finder.json

4. **"Collect results, update anchors, archive and reset session"**
   - Description: Read /tmp/deep-learn-results/*.json, update context_anchors, archive current_session, reset session, cleanup
   - **blockedBy: [task 1, task 2, task 3]**

### Step 4: Spawn Agents

Spawn the 3 finder agents in parallel via Task tool with `team_name: "deep-learn"`:

```
subagent_type: "deep-learn-entity-finder"
subagent_type: "deep-learn-pattern-finder"
subagent_type: "deep-learn-anti-pattern-finder"
```

### Step 5: Wait for Finders

Wait for all 3 finder agents to complete (they will send completion messages). Then spawn the Resetter:

```
subagent_type: "deep-learn-resetter"
```

### Step 6: Verify & Cleanup

After Resetter completes:

1. Verify context_anchors updated -- check for new Deep Learn Session section
2. Verify session reset -- should be minimal
3. Verify cleanup: `/tmp/deep-learn-results/` should not exist
4. Shutdown all agents via SendMessage shutdown_request
5. Cleanup team: `Teammate tool: cleanup`

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
| Reading session notes into main context | Use agent team -- agents read in their context |
| Over-consolidation (losing detail) | When in doubt, keep more detail |
| Under-consolidation (entity for every note) | Apply frequency/importance filters |
| Anchor data dump | Keep summaries to 1-2 sentences |
| Ignoring existing entities | Agents always call `mcp__cognitive-memory__list_entities` first |
| Letting session grow too large | Run Deep Learn when approaching ~800 lines |
| Context compaction during deep learn | Team architecture prevents this |

---

## Integration with Other Protocols

- **End of Day Ritual**: May trigger Deep Learn first if session is large, then do anchor updates
- **Learn Protocol**: Operates on archived sessions for identity/protocol updates (less frequent)

---

**Protocol Version:** 4.1
**Update History:**
- 4.1: Entity Finder now processes ECHO/FIZZLE session note markers to build co-echo relationships between entities that prove useful together (2+ co-occurrence threshold)
- 4.0: Replaced sequential manual workflow with 4-agent team architecture. 3 parallel finders (entity, pattern, anti-pattern) + 1 sequential resetter. Results passed via /tmp/deep-learn-results/*.json to avoid routing through main context.
- 3.1: Changed read_entity pagination from tail/head to offset/limit parameters
- 3.0: Restructured as size-triggered protocol running 2-3x/day. Removed coupling to end-of-day ritual.
- 2.0: Complete workflow rewrite with entity type guidance
- 1.0: Initial version

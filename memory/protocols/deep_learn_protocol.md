# Deep Learn Protocol

## Purpose

Consolidate session notes into structured entity memory when the session file grows too large to effectively read. This is a **reactive, size-triggered** protocol that runs multiple times per day as needed.

## Core Principle

**Session notes are working memory; entities are long-term memory.** Deep Learn bridges these by synthesizing session details into structured, categorized entity files.

## When to Trigger

### Primary Trigger: Size-Based

Run Deep Learn when current_session content exceeds ~800 lines or feels overwhelming.

### Secondary Triggers
- Before major context clears
- End of day if session is substantial
- After completing a major milestone

### Expected Frequency
2-3 times per day during active work.

## Entity Types

### people/
User feedback, collaboration patterns, preferences, teaching moments

### projects/
Technical progress, architecture decisions, blockers, completions

### concepts/
Theoretical frameworks, mental models spanning contexts

### patterns/
Confirmed positive approaches (evidence required), techniques that worked

### anti-patterns/
Confirmed mistakes (evidence required), user corrections, repeated failures

## Workflow

### Step 1: Read Session Notes
Read all current session content.

### Step 2: Identify Entities
Categorize content into entity types. Apply frequency filter:
- 3+ mentions -> strong candidate
- Single mention -> skip unless high importance
- Existing entities -> update with new evidence

### Step 3: Check Before Writing (Archaeological Approach)
Always list and read existing entities before creating new ones. Merge, don't replace.

### Step 4: Write Entities
Write to `{{MEMORY_PATH}}/` entity directories.

### Step 5: Update Context Anchors
Add new section to `{{MEMORY_PATH}}/context_anchors.md` with summaries.

### Step 6: Archive and Reset Session
Archive current session to `{{MEMORY_PATH}}/session_archives/YYYY-MM-DD.md`, then reset current_session with header noting the integration.

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Over-consolidation (losing detail) | When in doubt, keep more detail |
| Under-consolidation (entity for every note) | Apply frequency/importance filters |
| Ignoring existing entities | Always list_entities first |
| Letting session grow too large | Run when approaching ~800 lines |

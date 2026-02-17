# Learn Protocol

## Purpose

Guide AI synthesis of behavioral learnings into appropriate locations -- both memory entities AND infrastructure files. Learn identifies performance gaps and makes targeted improvements.

## Key Architectural Principle

- **me.md** = WHO you are (identity, philosophical foundations)
- **patterns/** = WHAT positive patterns to follow
- **anti-patterns/** = WHAT to avoid
- **protocols/** = HOW to do things (workflows, procedures)
- **Skills/hooks** = Automated enforcement infrastructure

## When to Use

### Frequency: Periodic (Weekly-ish)

Learn is NOT a daily ritual. Run it periodically when:
- A week or more of archived sessions have accumulated
- User explicitly corrects repeated behavioral patterns
- Significant methodology changes need documentation
- After major projects complete (retrospective learning)

### Source: Archived Session Notes

Learn operates on archived sessions, not current_session. Behavioral patterns need multiple sessions to validate.

## Learn Workflow

### Step 1: Review Archives for Learnings

Read session archives accumulated since last Learn. Identify:
- **Performance gaps**: Recurring behavior that didn't match expectations
- **Positive feedback**: What worked well
- **Infrastructure opportunities**: Patterns that could be automated
- **Recurring corrections**: Same feedback appearing multiple times

### Step 2: Validate Pattern Status

| Evidence Level | Action |
|----------------|--------|
| Single mention in one session | Leave in archives, not yet a pattern |
| Mentioned in 2-3 sessions | Candidate for entity, monitor |
| Recurring across 3+ sessions | Validated pattern, create/update entity |
| User explicitly stated as important | High priority regardless of frequency |

### Step 3: Route Learnings

| Learning Type | Route To |
|---------------|----------|
| Identity change | me.md |
| Positive pattern | `{{MEMORY_PATH}}/patterns/` |
| Thing to avoid | `{{MEMORY_PATH}}/anti-patterns/` |
| Workflow/procedure | `{{MEMORY_PATH}}/protocols/` |
| Automated enforcement | hooks/scripts |

### Step 4: Make Changes

Read current state, apply minimal change, preserve existing structure.

### Step 5: Document

Take session note documenting archives reviewed, patterns identified, and changes made.

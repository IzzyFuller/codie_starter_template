# Request Intake Protocol

## Purpose

Ensures every user request is filtered through memory architecture before responding, preventing work-in-isolation and ensuring historical learnings, patterns, and past decisions inform current work.

**Core Principle**: Never treat a request as "brand new" without checking if you've done similar work, encountered related patterns, or documented relevant principles.

## When to Use

**Mandatory for:**
- Feature implementation requests
- Bug fixes or investigations
- Refactoring or code improvement
- Code or architecture review
- Technical decisions
- Any task involving writing code or providing technical guidance

**Skip for:**
- Simple clarifying questions
- Purely factual information requests
- Conversational exchanges without technical work

## Protocol Steps

### Step 1: Parse the Request

Identify:
1. **Domain**: What area of codebase/project is involved?
2. **Action type**: Implement, fix, refactor, review, decide, document?
3. **Key concepts**: What technical concepts are mentioned?
4. **Project context**: Which project/repository?

### Step 2: Search Memory

Search `{{MEMORY_PATH}}/` for relevant past work, patterns, anti-patterns, and user feedback related to this type of work.

### Step 3: Read Relevant Memory

Based on search results, read specific entities:
- People entities for collaboration preferences
- Concepts/Patterns for methodological guidance
- Project entities for project-specific context
- Protocol entities for established workflows

### Step 4: Synthesize Before Responding

1. Past work check: Have we done this before?
2. Pattern application: What established patterns apply?
3. Anti-pattern avoidance: What mistakes to avoid?
4. Context integration: What project-specific context matters?

### Step 5: Document Memory Consultation

Take a session note documenting what you found.

## Integration with Other Protocols

This protocol is the **first step**:
1. **Request Intake** (this) -- understand through memory lens
2. **Principle Check** -- validate recommendations
3. **Context Mapping** -- apply historical learnings
4. **Anti-Pattern Detection** -- catch issues proactively
5. **Session Notes** -- document work in real-time

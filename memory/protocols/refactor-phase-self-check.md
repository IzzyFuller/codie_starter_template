# Refactor Phase Self-Check Protocol

## Purpose

Systematic review of recent work using memory-grounded principles. This protocol orchestrates multiple sub-protocols to evaluate code against documented best practices, always citing specific memory entities as the basis for evaluation. Produces a findings report -- does NOT fix anything.

## Key Differentiator: Memory Entity Citations

**Every evaluation MUST reference specific memory entities.**

Instead of generic claims like "this doesn't follow best practices," cite specifically:
- "Per `patterns/fail-fast-engineering`: this broad exception hides errors"
- "Per `concepts/archaeological-engineering`: should investigate existing before building new"
- "Per `anti-patterns/misplaced-imports`: import found inside function body"

This grounds review in documented principles, not vague intuitions.

## When to Invoke

**Automatic triggers:**
- After completing a significant implementation
- Before declaring a task complete
- After refactoring existing code
- When preparing for PR or commit
- When user asks for review

**Frequency guidance:**
- Major features: Full protocol
- Bug fixes: Light pass (anti-patterns + code smells)
- Refactoring: Full protocol with emphasis on pattern check

## Protocol Phases

### Phase 0: Preparation

**Identify scope of review:**
1. What files/functions were modified?
2. What type of work was this? (new feature, bug fix, refactor, etc.)
3. What areas are most critical to verify?

**Load relevant memory context:**

Use `mcp__cognitive-memory__list_entities` to enumerate all `anti-patterns/`, `patterns/`, and `concepts/` entities. These are the full set of documented principles to review against.

### Phase 1: Semantic Reflection

**Protocol reference:** `protocols/semantic-reflection`

**Purpose:** Retrieve relevant historical context that should inform evaluation.

**Execute:**
1. Search memory for past feedback on similar work types
2. Check if this area has documented learnings
3. Identify project-specific patterns or anti-patterns

**Citation format:**
- "Searching memory for [topic]..."
- "Found relevant context in [entity]: [specific finding]"

### Phase 2: Principle Check

**Protocol reference:** `protocols/principle-check`

**Purpose:** Verify recommendations and implementations align with core principles.

**Execute:**
1. Check Archaeological Engineering alignment (investigated existing first?)
2. Check proportional response (solution complexity <= problem complexity?)
3. Check evidence-based approach (solving observed vs theoretical problems?)

**Citation format:**
- "Per `concepts/archaeological-engineering`: [specific evaluation]"
- "Per `concepts/proportional-response`: [specific evaluation]"

### Phase 3: Anti-Pattern Detection

**Protocol reference:** `protocols/anti-pattern-detection`

**Purpose:** Catch violations of documented anti-patterns.

**Execute:**
1. Use `mcp__cognitive-memory__list_entities` with entity_type `anti-patterns` to get the full current set
2. Read each anti-pattern entity relevant to the code under review via `mcp__cognitive-memory__read_entity`
3. Check the code against every applicable anti-pattern

Do NOT hardcode a list of anti-patterns -- the memory store is the source of truth and grows over time.

**Citation format:**
- "Per `anti-patterns/[name]`: [specific finding]"

### Phase 4: Pattern Check

**Protocol reference:** `protocols/pattern-check`

**Purpose:** Verify documented patterns are correctly applied.

**Execute:**
1. Use `mcp__cognitive-memory__list_entities` with entity_type `patterns` to get the full current set
2. Identify which patterns are applicable to the work type and code under review
3. Read each applicable pattern entity via `mcp__cognitive-memory__read_entity`
4. Verify compliance with each pattern

Do NOT hardcode a list of patterns -- the memory store is the source of truth and grows over time.

**Citation format:**
- "Per `patterns/[name]`: [compliance status]"

### Phase 5: Code Smell Check

**Protocol reference:** `protocols/code-smell-check`

**Purpose:** Evaluate contextual concerns requiring judgment.

`protocols/code-smell-check` is a full actionable protocol with its own phases (Identify -> Investigate Context -> Evaluate Against Catalog -> Make Determination -> Document Decision). Execute it -- don't just read it as a reference.

**Citation format:**
- "Code smell identified: [type]. Per `protocols/code-smell-check` [smell category]: [evaluation]"
- "Context evaluation: [why this is/isn't acceptable here]"

### Phase 6: Synthesis and Report

**Compile findings into a structured report:**

#### Findings
List all findings with citations:
```markdown
1. **[Category]**: [Description]
   - Citation: `[entity path]`
   - Location: [file:line or function]
   - Severity: [anti-pattern violation | pattern non-compliance | code smell]
```

#### Evaluation Summary
- Total items checked: N
- Anti-patterns detected: N
- Pattern violations: N
- Code smells requiring attention: N
- Items acceptable as-is: N

### Phase 7: Document Review

Document review completion in session notes.

**Note content should include:**
- Scope: files/functions reviewed
- Findings: what was identified and where
- Key citations referenced
- Summary assessment

## Evaluation Criteria (Quick Reference)

### Readability
- Clear naming conventions
- Appropriate abstraction levels
- Comments only where code can't be self-documenting
- Logical organization

### Cognitive Complexity
- No deeply nested conditionals
- Guard clauses over nested if/else
- Single responsibility per function
- Reasonable function length

### Software Design Standards
- Proper separation of concerns
- Dependencies flowing correctly
- Interfaces at boundaries
- Configuration externalized

### Performance
- No unnecessary iterations
- Appropriate data structures
- Caching where beneficial
- Lazy evaluation where appropriate

## Success Criteria

- All phases executed with memory entity citations
- Findings documented with specific entity references
- Anti-patterns and patterns checked against full memory store (not a hardcoded subset)
- Session notes capture the review results
- User can see exactly which principles guided the review

---

**Protocol Version:** 2.0
**Sub-Protocols:** semantic-reflection, principle-check, anti-pattern-detection, pattern-check, code-smell-check

# Pattern Check Protocol

## Purpose

During active work, verify that documented patterns are being correctly applied. While anti-pattern detection catches what to AVOID, pattern check ensures you're doing things the RIGHT way according to established practices.

## When to Invoke

- After completing a significant piece of code
- When implementing error handling
- When making architectural decisions
- When creating new abstractions or interfaces
- During self-review phases

## Protocol Steps

### Phase 1: Identify Applicable Patterns

Determine what patterns from `{{MEMORY_PATH}}/patterns/` apply to current work:
- Error handling? -> fail-fast patterns
- Architecture? -> archaeological engineering, proportional response
- Testing? -> TDD patterns
- Configuration? -> configuration management patterns

### Phase 2: Load Relevant Patterns

Read applicable pattern entities from memory.

### Phase 3: Verify Pattern Compliance

For each applicable pattern, verify:
1. Did I apply this pattern where relevant?
2. Did I apply it correctly?
3. Did I miss opportunities to use it?

### Phase 4: Common Pattern Checks

**Error Handling**: Try/except wraps exactly one call, specific exception types, fail-fast principle
**Data Modeling**: Specific typed models, required fields are required, validation at schema level
**Architecture**: Investigated existing first, solution complexity <= problem complexity, single responsibility
**Testing**: Tests verify behavior not implementation, no loops in tests, mock only at boundaries

### Phase 5: Document and Correct

Document findings, correct unjustified deviations, run tests after corrections.

# Pattern Check Protocol

## Purpose

During active work, verify that documented patterns are being correctly applied. While anti-pattern detection catches what to AVOID, pattern check ensures you're doing things the RIGHT way according to established practices. Confirms alignment with proven approaches from memory architecture.

## When to Invoke

**Automatic triggers:**
- After completing a significant piece of code
- When implementing error handling
- When making architectural decisions
- When creating new abstractions or interfaces
- When refactoring existing code
- During self-review phases

**Check frequency:**
- After completing each logical unit of work
- Before declaring a task "done"
- When uncertain if implementation follows established practices

## Protocol Steps

### Phase 1: Identify Applicable Patterns

**Determine what patterns apply to current work** (use `mcp__cognitive-memory__list_entities` with `entity_type: "patterns"` to enumerate, then read relevant ones via `mcp__cognitive-memory__read_entity`):

- Error handling? -> Check try/except, fail-fast patterns
- Data modeling? -> Check typed model patterns
- Architecture? -> Check archaeological engineering, proportional response
- Testing? -> Check TDD patterns, test quality principles
- Configuration? -> Check configuration management patterns

### Phase 2: Load Relevant Patterns

Read applicable pattern entities from memory.

### Phase 3: Verify Pattern Compliance

**For each applicable pattern, verify:**

1. **Pattern Recognition**
   - Did I apply this pattern where it was relevant?
   - Did I apply it correctly?
   - Did I miss opportunities to use it?

2. **Pattern Consistency**
   - Is my implementation consistent with how this pattern is documented?
   - Did I deviate from the pattern? If so, is the deviation justified?

3. **Pattern Completeness**
   - Did I follow the full pattern or only part of it?
   - Are all aspects of the pattern satisfied?

### Phase 4: Common Pattern Checks

**Error Handling Patterns:**
- [ ] Try/except wraps EXACTLY one call (the one that can fail)
- [ ] Exception type is specific, not broad
- [ ] Except block only retries/handles what failed
- [ ] No code duplication inside/outside except
- [ ] Fail-fast principle: errors surface loudly rather than silently

**Data Modeling Patterns:**
- [ ] Using specific typed models (not generic dicts)
- [ ] Required fields are required (not Optional with runtime guards)
- [ ] Validation at schema level, not runtime
- [ ] Proper casing at API boundaries vs internal code

**Architectural Patterns:**
- [ ] Investigated existing before building new (Archaeological Engineering)
- [ ] Solution complexity <= problem complexity (Proportional Response)
- [ ] Single responsibility -- each component does one thing
- [ ] Dependencies flow inward (Clean Architecture)

**Testing Patterns:**
- [ ] Tests verify external behavior, not implementation details
- [ ] No loops in tests -- test single invocations
- [ ] Mocking only at actual boundaries (not reflexively)
- [ ] Configuration via dependency injection, not monkeypatching

**Configuration Patterns:**
- [ ] Environment values injected via proper paths (env files, secrets)
- [ ] No code workarounds for missing config
- [ ] Security-sensitive data from single authoritative source

### Phase 5: Document Findings

**If pattern correctly applied:**
- Note the successful application (brief)
- Reference which pattern was followed

**If pattern missed or incorrectly applied:**
- Document the pattern deviation in session notes
- Reference which pattern was violated

### Phase 6: Correct Deviations

**If deviations found:**
1. Determine if deviation is justified (document why if yes)
2. If not justified, refactor to follow pattern
3. Run tests after correction
4. Note the correction in session

## Integration with Other Protocols

**Pattern check complements:**
- `anti-pattern-detection` - Catches what to avoid
- `pattern-check` (this) - Confirms what to do correctly
- `principle-check` - Validates recommendations before giving them
- `code-smell-check` - Evaluates contextual concerns

**Typical flow during refactor:**
1. `anti-pattern-detection` - Am I about to do something wrong?
2. `pattern-check` - Am I doing things the right way?
3. `code-smell-check` - Are there contextual concerns?

## Success Criteria

- Applicable patterns identified for current work type
- Pattern entities read and understood
- Current work verified against pattern requirements
- Deviations either justified or corrected
- Session notes document any significant findings

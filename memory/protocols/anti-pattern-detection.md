# Anti-Pattern Detection Protocol

## Purpose

During active work, periodically check your actions against documented anti-patterns. Catches problematic patterns early before they manifest as user corrections. Proactive prevention rather than reactive correction.

## When to Invoke

**Automatic triggers:**
- About to make architectural decisions
- Writing exception handling code
- Adding validators or fallback logic
- Creating "comprehensive" solutions
- Suggesting "best practices"
- Adding backwards compatibility logic
- About to over-engineer or add complexity

**Check frequency:**
- Every 10-15 minutes during active coding
- Before committing to an approach
- When solution feels complex
- When adding defensive code

## Protocol Steps

### Phase 1: Pause and Reflect

**Stop and ask:**
- What am I about to do?
- Why am I doing it this way?
- Is this solving observed problems or speculative ones?
- Does this feel more complex than the problem warrants?

### Phase 2: Check Against Known Anti-Patterns

Check current work against documented anti-patterns (use `mcp__cognitive-memory__list_entities` with `entity_type: "anti-patterns"` to enumerate them, then read each via `mcp__cognitive-memory__read_entity`):

1. **Backwards Compatibility Obsession**
   - Am I adding compatibility logic?
   - Is this for external APIs with consumers who can't update simultaneously?
   - Is this for existing persisted data needing migration?
   - If neither → ANTI-PATTERN DETECTED

2. **Generic Type Usage**
   - Am I using generic dictionaries?
   - Should this be a specific typed model instead?
   - If yes → ANTI-PATTERN DETECTED

3. **Broad Exception Handling**
   - Am I catching generic Exception?
   - Am I wrapping more than one instruction?
   - Do I know the specific exception type?
   - If broad → ANTI-PATTERN DETECTED

4. **Speculative Defensive Coding**
   - Am I fixing a crash that hasn't occurred?
   - Am I adding "just in case" logic?
   - Is this targeted to observed failures only?
   - If speculative → ANTI-PATTERN DETECTED

5. **Over-Engineering**
   - Is my solution complexity greater than problem complexity?
   - Am I building a framework for a simple problem?
   - Could this be simpler?
   - If over-engineered → ANTI-PATTERN DETECTED

6. **Reflexive Best Practice Parroting**
   - Am I suggesting something because "docs say so"?
   - Have I verified this applies to THIS context?
   - Am I questioning my own expertise claims?
   - If unverified → ANTI-PATTERN DETECTED

7. **Production Labels During Development**
   - Am I applying production labels?
   - Is this still being iterated on?
   - Has testing been completed?
   - If premature → ANTI-PATTERN DETECTED

### Phase 3: Check Entity Memory

**Search for project-specific anti-patterns:**

1. **Check project entities:**
   - What didn't work in this project before?
   - What approaches caused issues?
   - What did we learn to avoid?

2. **Check patterns/ collection:**
   - Are there documented anti-patterns for this type of work?
   - What failed approaches are recorded?

3. **Check people entities:**
   - What corrections relate to this type of work?
   - What has been explicitly taught as wrong?

### Phase 4: Evaluate Current Work

**Compare planned action against checks:**

For each anti-pattern checked:
- CLEAR: No match, proceed
- WARNING: Borderline, needs justification
- DETECTED: Stop, reformulate approach

### Phase 5: Reformulate if Needed

**If anti-pattern detected:**

1. **Acknowledge the detection** and document it in session notes

2. **Apply correct approach:**
   - What's the simpler alternative?
   - What's the targeted fix instead of comprehensive solution?
   - What evidence-based approach replaces speculation?

3. **Verify reformulation:**
   - Does new approach avoid the anti-pattern?
   - Is it proportional to the problem?
   - Is it based on observed needs, not speculation?

## Example Anti-Pattern Detections

### Example 1: Backwards Compatibility Creep
**Situation:** Refactoring internal function signature
**Initial thought:** "Add backwards-compatible wrapper for old signature"
**Check:** Is this external API? Are there consumers who can't update? Is this persisted data?
**Result:** ANTI-PATTERN DETECTED - internal change, no compatibility needed
**Reformulation:** Just update the signature and all call sites together

### Example 2: Exception Handling Scope
**Situation:** Writing file processing code
**Initial thought:** Wrap entire function in try/except
**Check:** Am I wrapping exactly one instruction? Do I know specific exception type?
**Result:** ANTI-PATTERN DETECTED - wrapping too much, catching too broadly
**Reformulation:** Wrap only the file open call, catch IOError specifically

### Example 3: Speculative Validation
**Situation:** Function receives user input
**Initial thought:** "Add validation for edge cases that might occur"
**Check:** Have these edge cases caused crashes? Is this observed or speculative?
**Result:** ANTI-PATTERN DETECTED - speculative defensive coding
**Reformulation:** Add validation only for observed failure modes

### Example 4: Over-Engineering
**Situation:** Need to rename a variable across codebase
**Initial thought:** "Build abstraction layer to prevent future renames"
**Check:** Is solution complexity > problem complexity? Is this a framework for a simple task?
**Result:** ANTI-PATTERN DETECTED - over-engineering simple rename
**Reformulation:** Just do the rename, it's a simple task

## Success Criteria

- Pause before implementing to check against anti-patterns
- Known anti-patterns actively compared against current work
- Detections caught BEFORE user correction
- Reformulation applied when anti-pattern found
- Session notes document both detections and course corrections
- Proactive prevention replacing reactive correction

## Warning Signs to Check Immediately

- Solution feels elegant but complex
- Adding "comprehensive" coverage
- Writing "just in case" logic
- Wrapping large code blocks in try/except
- Suggesting something because "best practice"
- Adding compatibility layers
- Building frameworks instead of solutions

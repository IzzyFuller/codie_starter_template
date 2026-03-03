# Code Smell Check Protocol

## Purpose

Evaluate contextual code concerns that might be okay OR might be problematic depending on circumstances. Unlike anti-patterns (always avoid) or patterns (always follow), code smells require understanding WHY something was done to determine if it's appropriate. This protocol guides investigation of "maybe okay, maybe not" situations.

## The Nature of Code Smells

**Code smells are NOT automatically bad.** They are signals that warrant investigation:

- A broad `except Exception` in a worker loop cleanup might be appropriate
- A broad `except Exception` in business logic is likely a bug-hider
- Same construct, different context, different evaluation

**The question is always:** Does this deviation from the ideal pattern have sufficient justification in THIS context?

## When to Invoke

**Automatic triggers:**
- Reviewing code that uses constructs known to be contextual
- Encountering try/except blocks
- Seeing generic types or loose typing
- Finding defensive code or fallback logic
- Noticing complexity that might be warranted or might not be
- During refactor self-check phases

**Explicit triggers:**
- "This could be okay or could be a problem"
- "I'm not sure if this is the right approach here"
- Code that feels uncomfortable but might be justified

## Protocol Steps

### Phase 1: Identify the Smell

**Recognize the construct that warrants investigation:**

1. What is the specific construct? (e.g., broad exception, generic type, complex logic)
2. Where is it located? (file, function, line)
3. What would the "ideal" pattern be in typical circumstances?

### Phase 2: Investigate Context

**Ask the critical questions:**

1. **What does this code DO?**
   - What's the purpose of this function/block?
   - What happens if it fails?

2. **Why might this be okay?**
   - Is there a legitimate reason for this approach?
   - What constraints or requirements might justify it?

3. **Why might this be problematic?**
   - What bugs could this hide?
   - What maintenance issues could this cause?
   - Does it violate principles without good reason?

4. **What's the blast radius?**
   - If this IS a problem, how bad is it?
   - Core business logic vs. cleanup code vs. logging

### Phase 3: Evaluate Against Known Smell Catalog

**Common code smells with evaluation criteria:**

#### Smell: Broad Exception Handling

**Might be okay when:**
- Worker loop outer catch (keep worker alive)
- Cleanup/finally logic (must not throw)
- Top-level error boundaries (last line of defense)
- Logging errors without re-raising (informational)

**Probably problematic when:**
- Business logic (hides bugs)
- Data transformation (masks corruption)
- API handlers beyond top-level (loses error specificity)
- Anywhere "specific exception type" is knowable

**Investigation question:** "What exceptions can actually occur here, and do I have a reason NOT to list them specifically?"

#### Smell: Generic Types (dict, list, Any)

**Might be okay when:**
- Truly dynamic data from external source (unknown schema)
- Temporary during refactoring (with TODO to fix)
- Test fixtures with known structure
- Third-party library boundaries (can't control their types)

**Probably problematic when:**
- Internal data structures (should be typed models)
- API contracts (should be typed)
- Configuration (should be typed)
- Any place where structure IS known

**Investigation question:** "Do I actually know the structure of this data? If yes, why isn't it typed?"

#### Smell: Defensive Code / Fallbacks

**Might be okay when:**
- External API responses (genuinely unknown)
- User input validation (intentional boundary)
- Migration/backwards compatibility (documented transition)
- Graceful degradation for optional features

**Probably problematic when:**
- Internal function calls (trust the contract)
- Required data (should fail, not fallback)
- Speculative "might be None" without evidence
- Hiding bugs rather than surfacing them

**Investigation question:** "Is this defending against an observed failure or a theoretical one?"

#### Smell: Complex Conditional Logic

**Might be okay when:**
- Genuinely complex business rules
- State machines with many valid states
- Feature flags (temporary, well-documented)

**Probably problematic when:**
- Could be simplified with better abstractions
- Multiple conditions testing same underlying concept
- Nested conditionals beyond 2-3 levels
- No documentation explaining the complexity

**Investigation question:** "Is this complexity inherent to the problem or is it incidental to the implementation?"

#### Smell: Code Duplication

**Might be okay when:**
- Superficially similar but semantically different
- Premature abstraction would be worse
- Test code (clarity over DRY)
- Temporary during refactoring

**Probably problematic when:**
- Same logic in multiple places
- Bug fixes need to be applied multiple times
- Changes require coordinated updates
- Three or more occurrences (rule of three)

**Investigation question:** "If I fix a bug in one place, do I need to fix it in the others too?"

### Phase 4: Make Determination

**Conclude one of:**

1. **ACCEPTABLE** - Context justifies the smell
   - Document the justification (comment or session note)
   - Leave code as-is but make reasoning explicit

2. **REFACTOR** - Smell indicates real problem
   - Document what's wrong
   - Plan the correction
   - Note expected behavior change (or confirm none)

3. **INVESTIGATE FURTHER** - Need more context
   - What additional information is needed?
   - Who to ask or what to check?

### Phase 5: Document Decision

Document the smell evaluation decision in session notes.

## Integration with Other Protocols

**Code smell check complements:**
- `anti-pattern-detection` - Things always to avoid (no context needed)
- `pattern-check` - Things always to do (no context needed)
- `code-smell-check` (this) - Things requiring contextual evaluation

**Typical refactor flow:**
1. Anti-pattern check -> Clear violations
2. Pattern check -> Missing good practices
3. Code smell check -> Contextual concerns requiring judgment

## Creating New Smell Entries

When a new "might be okay, might not" pattern emerges:

1. Document it as a code smell with:
   - What the construct is
   - When it might be okay (with examples)
   - When it's probably problematic (with examples)
   - The investigation question to ask

2. Consider creating a `code-smells/` entity directory for detailed smell documentation

## Success Criteria

- Contextual concerns identified during code review
- Each smell investigated with appropriate questions
- Decision made with clear rationale
- Acceptable smells documented (not left ambiguous)
- Problematic smells flagged for refactoring
- Session notes capture significant evaluations

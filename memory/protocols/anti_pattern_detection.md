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
- About to over-engineer or add complexity

**Check frequency:**
- Every 10-15 minutes during active coding
- Before committing to an approach
- When solution feels complex

## Protocol Steps

### Phase 1: Pause and Reflect

**Stop and ask:**
- What am I about to do?
- Why am I doing it this way?
- Is this solving observed problems or speculative ones?
- Does this feel more complex than the problem warrants?

### Phase 2: Check Against Known Anti-Patterns

Check current work against documented anti-patterns in `{{MEMORY_PATH}}/anti-patterns/`:

1. **Backwards Compatibility Obsession** -- only for external APIs with consumers who can't update
2. **Generic Type Usage** -- should this be a specific typed model?
3. **Broad Exception Handling** -- catching generic exceptions wrapping too much?
4. **Speculative Defensive Coding** -- fixing crashes that haven't occurred?
5. **Over-Engineering** -- solution complexity greater than problem complexity?
6. **Best Practice Parroting** -- citing docs without verifying contextual applicability?

### Phase 3: Evaluate Current Work

For each anti-pattern checked:
- CLEAR: No match, proceed
- WARNING: Borderline, needs justification
- DETECTED: Stop, reformulate approach

### Phase 4: Reformulate if Needed

If anti-pattern detected:
1. Acknowledge the detection
2. Apply correct approach (simpler alternative, targeted fix, evidence-based approach)
3. Verify reformulation avoids the anti-pattern

## Warning Signs to Check Immediately

- Solution feels elegant but complex
- Adding "comprehensive" coverage
- Writing "just in case" logic
- Wrapping large code blocks in try/except
- Suggesting something because "best practice"
- Building frameworks instead of solutions

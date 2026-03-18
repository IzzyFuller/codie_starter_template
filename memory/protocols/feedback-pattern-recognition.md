# Feedback Pattern Recognition Protocol

## Purpose

When receiving user corrections or feedback, systematically search memory for similar past feedback to identify recurring patterns. Transforms individual corrections into pattern awareness, enabling learning from recurring issues rather than just fixing immediate mistakes.

## When to Invoke

**Automatic triggers:**
- User explicitly corrects your behavior or recommendation
- User expresses frustration with something you did/suggested
- User says "I've told you this before" or similar
- User provides teaching moment feedback
- Receiving direct criticism about approach or methodology

## Protocol Steps

### Phase 1: Capture the Feedback (Immediate)

**Before responding to the correction:**

1. **Record verbatim feedback** in session notes (importance: high):
   Use `mcp__cognitive-memory__add_session_note` with parameters `note_type: "insight"`, `content: "USER FEEDBACK (VERBATIM): [exact words]"`, `importance: "high"`

2. **Extract the core issue:**
   - What specific behavior was corrected?
   - What was I doing wrong?
   - What should I have done instead?

### Phase 2: Search Memory for Patterns

**Use semantic search to find related feedback:**

1. **Search people entities** for similar feedback:
   - Look for patterns in teaching moments
   - Check if this behavior has been corrected before
   - Identify if this relates to documented anti-patterns

2. **Search me.md Behavioral Learnings section:**
   - Has this already been integrated as base instruction?
   - Am I violating my own documented principles?

3. **Search patterns/ and concepts/ directories:**
   - Does this relate to established patterns I should be following?
   - Is there a concept I'm failing to apply?

4. **Search session notes** (current_session):
   - Have I received similar feedback this session?
   - Is this the second occurrence of same issue?

### Phase 3: Pattern Classification

**Classify what you find:**

1. **First-time feedback:**
   - New learning opportunity
   - Capture thoroughly for future reference
   - Consider for me.md integration if broadly applicable

2. **Recurring pattern (2+ occurrences):**
   - RED FLAG: This is a systematic issue
   - Acknowledge pattern explicitly to user
   - Requires behavior modification, not just acknowledgment
   - Strong candidate for immediate me.md integration

3. **Violation of existing instruction:**
   - CRITICAL: Already knew better, failed to apply
   - Investigate why principle wasn't followed
   - May indicate attention/context issue vs knowledge gap

### Phase 4: Response Formulation

**Based on pattern classification:**

**For first-time feedback:**
"Thank you for that correction. I see that [specific behavior] was wrong because [reason]. I should have [correct approach] instead."

**For recurring pattern (acknowledge it):**
"I notice this relates to feedback you've given before about [pattern]. This is clearly a recurring issue for me -- [describe pattern]. Let me focus on [specific behavioral change]."

**For existing instruction violation:**
"You're right -- this violates the [principle/instruction] already in my base instructions. I failed to apply what I already know. The issue was [specific failure point]."

### Phase 5: Integration Decision

**Determine if this needs immediate integration:**

**Immediate me.md integration criteria:**
- Pattern has occurred 2+ times
- User explicitly marked as important ("I've told you this before")
- Relates to core working patterns (not edge cases)
- Prevents future recurrence of costly mistakes

**Session notes only:**
- First occurrence
- Context-specific issue
- Minor course correction

**Entity memory (patterns/, anti-patterns/):**
- New pattern worth documenting for future reference
- Technical learning that applies broadly
- Anti-pattern to avoid

## Red Flags in Pattern Search

- **Same feedback found in me.md**: You're not following your own instructions
- **Same feedback found 2+ times in session notes**: Systematic issue requiring immediate action
- **Same feedback found in people entities**: This was explicitly taught before
- **Related to documented anti-pattern**: You're doing something you know to avoid

## Success Criteria

- User feedback captured verbatim immediately
- Related past feedback identified (or confirmed as new)
- Pattern vs one-off distinguished clearly
- Response acknowledges pattern when present
- Integration decision made and executed
- Future recurrence prevented through learning integration

# Feedback Pattern Recognition Protocol

## Purpose

When receiving user corrections or feedback, systematically search memory for similar past feedback to identify recurring patterns. Transforms individual corrections into pattern awareness, enabling learning from recurring issues.

## When to Invoke

- User explicitly corrects your behavior or recommendation
- User expresses frustration with something you did/suggested
- User says "I've told you this before" or similar
- Receiving direct criticism about approach or methodology

## Protocol Steps

### Phase 1: Capture the Feedback (Immediate)

1. Record verbatim feedback in session notes (importance: high)
2. Extract core issue: What specific behavior was corrected? What should you have done instead?

### Phase 2: Search Memory for Patterns

1. Search people files for similar feedback
2. Check identity file for documented anti-patterns
3. Search `{{MEMORY_PATH}}/patterns/` and `{{MEMORY_PATH}}/concepts/`
4. Search current session notes for same feedback this session

### Phase 3: Pattern Classification

1. **First-time feedback**: New learning opportunity, capture thoroughly
2. **Recurring pattern (2+ occurrences)**: RED FLAG -- systematic issue requiring behavior modification
3. **Violation of existing instruction**: CRITICAL -- already knew better, failed to apply

### Phase 4: Response Formulation

- For first-time: Acknowledge and learn
- For recurring: Acknowledge the pattern explicitly
- For existing instruction violation: Acknowledge failure to apply known principle

### Phase 5: Integration Decision

- 2+ occurrences -> integrate into identity or anti-pattern documentation
- User explicitly marked important -> high priority integration
- Context-specific -> session notes only

# Refactor Phase Self-Check Protocol

## Purpose

Systematic self-evaluation of recent work using memory-grounded principles. Orchestrates multiple sub-protocols to evaluate code against documented best practices, always citing specific memory entities as the basis for evaluation.

## Key Differentiator: Memory Entity Citations

**Every evaluation MUST reference specific memory entities.** Instead of generic claims like "this doesn't follow best practices," cite specifically:
- "Per `patterns/fail_fast_engineering`: this broad exception hides errors"
- "Per `concepts/archaeological_engineering`: should investigate existing before building new"

## When to Invoke

- After completing a significant implementation
- Before declaring a task complete
- After refactoring existing code
- When preparing for PR or commit

## Protocol Phases

### Phase 0: Preparation
Identify scope of review and load relevant memory context from `{{MEMORY_PATH}}/`.

### Phase 1: Semantic Reflection
Retrieve relevant historical context that should inform evaluation.

### Phase 2: Principle Check
Verify implementations align with core principles (Archaeological Engineering, Proportional Response, Evidence-Based).

### Phase 3: Anti-Pattern Detection
Catch violations of documented anti-patterns.

### Phase 4: Pattern Check
Verify documented patterns are correctly applied.

### Phase 5: Code Smell Check
Evaluate contextual concerns requiring judgment.

### Phase 6: Synthesis and Action
Compile findings with citations, categorize, and summarize.

### Phase 7: Address Findings
For each opportunity: document, attempt to address, run tests. If tests fail, default assumption is "my change caused a real problem."

### Phase 8: Document Results
Record the self-check completion in session notes.

## Test Failure Handling

1. **Assume your change is wrong** (default stance)
2. Read the test to understand what it's checking
3. Determine: behavior test or implementation test?
4. Only dismiss a test failure if you can articulate WHY the test was wrong

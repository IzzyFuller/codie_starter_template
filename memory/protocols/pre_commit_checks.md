# Pre-Commit Checks Protocol

## Purpose

Standardized pre-commit validation workflow that ensures code quality, formatting consistency, and test coverage before committing changes.

## When to Use

### Explicit Triggers
- User says "ready to commit" or "run pre-commit checks"
- User asks to validate changes before commit

### When NOT to Use
- During active development iteration
- For documentation-only changes (unless requested)
- When user explicitly says "skip tests"

## Three-Phase Check Workflow

### Phase 1: Code Formatting
**Command**: Project-specific formatter (e.g., `ruff format`, `prettier`, `black`)

Auto-format code to project standards. On failure, report errors and stop.

### Phase 2: Linting with Auto-Fix
**Command**: Project-specific linter (e.g., `ruff check --fix`, `eslint --fix`)

Check for code quality issues and auto-fix when possible. On failure, report remaining issues and stop.

### Phase 3: Test Suite
**Command**: Project-specific test runner (e.g., `pytest`, `jest`, `cargo test`)

Verify all tests pass. On failure, report which tests failed and mark as NOT ready to commit.

## Sequential Execution

**Critical**: These commands must run **sequentially**, not in parallel.

Each phase depends on previous phase success:
1. Formatting must succeed before linting
2. Linting must succeed before tests
3. Tests must pass before commit is safe

## Reporting Results

Report results clearly with pass/fail status for each phase. Do NOT automatically commit -- wait for explicit user request.

## Fail-Fast Philosophy

- Let tests fail loudly -- don't suppress errors
- Show full error output to user
- Don't try to "work around" test failures
- Test failures are valuable signals, not problems to hide

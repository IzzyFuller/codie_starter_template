# Tests Before Implementation Violation
**Anti-Pattern Type**: Testing
**Severity**: High

## Summary

Making model or implementation changes before updating the tests to expect the new behavior, violating the RED-GREEN-REFACTOR cycle.

## The Mistake

Changing production code before changing tests:
1. Modify model (e.g., make field required instead of optional)
2. Run tests and see failures
3. Update test assertions to match new model
4. Tests pass — but this reverses TDD discipline

## The Correction

Always update tests FIRST:
1. **RED**: Update tests to expect new behavior (they fail)
2. **GREEN**: Change implementation to make tests pass
3. **REFACTOR**: Clean up if needed

This ensures tests actually validate the change, not just document it after the fact.

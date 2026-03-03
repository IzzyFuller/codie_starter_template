# Test Observable Behavior, Not Implementation Details
**Pattern Type**: Testing
**Status**: Confirmed

## Summary

Delete unit tests that verify implementation details rather than externally observable behavior. Only test what's visible from outside the module. Rely on e2e tests for integration validation.

## When to Apply

- When tests mock internal framework calls
- When tests verify intermediate state rather than final output
- When e2e tests already cover the behavior being unit-tested
- When tests would break on refactoring that doesn't change external behavior

## How It Works

**Delete Tests For**:
1. **Mocked framework calls** — Testing that you called a library method with specific parameters tests the library, not your code
2. **Framework internals** — Testing validation logic tests the framework, not your domain
3. **Implementation-covered behavior** — If e2e tests verify the feature works, don't unit test the internal service it calls

**Keep Tests For**:
1. **Public API contracts** — Endpoints, service methods, adapter interfaces
2. **Error conditions** — Missing files, validation failures, malformed input
3. **Business logic** — Domain-specific transformations, rules, calculations
4. **Observable outputs** — What users/callers see, not intermediate steps

**Migration Pattern**:
- Before deleting unit test: verify e2e test covers the observable behavior
- If no e2e coverage exists, write e2e test FIRST, then delete unit test

# Test-Driven Development (TDD)

**Concept Type:** Core Methodology
**Status:** Active (foundational)

## The Cycle

**Red → Green → Refactor.** No exceptions.

1. **Red**: Write a failing test that describes the behavior you want
2. **Green**: Write the minimum code to make it pass
3. **Refactor**: Clean up while tests stay green

## Rules

- Never write code that isn't required to make a failing test pass
- No extra fallbacks, no defensive validation, no "just in case" — trust the tests
- No stubs without tests (see `anti-patterns/stubs-without-tests`)
- No backfilled tests to inflate coverage — that's fake TDD
- Tests assert externally observable behavior, not implementation details (see `patterns/e2e-test-client-perspective`)
- If code doesn't have a test demanding it, it shouldn't exist yet

## Related Entities

- `anti-patterns/stubs-without-tests` — The inverse: writing code without a test demanding it
- `anti-patterns/tests-before-implementation-violation` — Changing implementation before updating tests
- `anti-patterns/defensive-overengineering` — Building layers that don't earn their existence
- `patterns/e2e-test-client-perspective` — Tests through public API only
- `patterns/evidence-first-debugging` — Gather evidence before changing code

---

*Created: 2026-03-13*

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
- Backfilling tests for existing code is still required — writing tests first is preferable, but if code already exists without tests, write the tests anyway
- If code doesn't have a test demanding it, it shouldn't exist yet

## What Makes a Good Test

- **Asserts on external behavior only** — tests verify what a unit does from the outside, not how it does it internally (see `patterns/e2e-test-client-perspective`)
- **No implementation detail coupling** — don't assert on private state, internal method calls, or intermediate values
- **Mocking only at the extreme edge of the system** — mock external boundaries (HTTP, filesystem, database, third-party APIs) and nothing else; mocking internal collaborators is a sign the test is testing the wrong thing
- **Single invocation** — no loops driving the assertion; each test exercises one scenario

## Related Entities

- `anti-patterns/stubs-without-tests` — The inverse: writing code without a test demanding it
- `anti-patterns/tests-before-implementation-violation` — Changing implementation before updating tests
- `anti-patterns/defensive-overengineering` — Building layers that don't earn their existence
- `patterns/e2e-test-client-perspective` — Tests through public API only
- `patterns/evidence-first-debugging` — Gather evidence before changing code

---

*Created: 2026-03-13*

# Anti-Pattern: Code Without Failing Tests

**Category**: Code Quality / TDD Discipline
**Severity**: High

## The Rule

**Never write code that isn't required to make a failing test pass.**

This is the core TDD discipline: Red -> Green -> Refactor. Write the *minimum* code to make the test pass. Nothing more.

## What This Means

- No stub implementations "to be filled in later"
- No skeleton code without corresponding test coverage
- No "I'll add tests after" -- the test comes FIRST
- No extra fallbacks or defensive code that isn't tested
- No validation logic beyond what tests require
- If there's no failing test demanding the code, the code shouldn't exist

## The Sneaky Violation

The obvious violation is writing stubs without tests. The *sneaky* violation is making a test pass and then adding "just in case" code:

- Extra `if` branches for edge cases you didn't test
- Fallback values "for safety"
- Validation that no test exercises
- Defensive checks beyond what the tests demand

If you chose not to write a test for it, you're saying it's not required. Trust that choice. Don't write the code.

## Why This Matters

1. **Tests define requirements**: A test is a specification. Untested code is unspecified behavior.
2. **Trust your tests**: If the test doesn't require it, neither does the system.
3. **Dead code prevention**: Untested code paths become mysterious, unmaintainable dead weight.
4. **Design feedback**: The constraint of "only what the test requires" keeps designs minimal and clear.

## The Pattern to Follow

1. Write a failing test that specifies desired behavior
2. Write the **minimum** code to make it pass -- nothing extra
3. Refactor if needed (tests still pass)
4. If you want more behavior, write another failing test first

## Common Violations

- Creating a class with empty methods "for the interface"
- Writing helper functions "we might need"
- Adding fallback returns "in case the main path fails"
- Extra parameter validation beyond what tests exercise
- Error handling for cases no test covers
- "Defensive" code that makes you feel safer but isn't tested

## Related Patterns
- `fail_fast_engineering` -- trust the system, don't add speculative safety
- `anti_overengineering_discipline` -- minimum viable implementation
- `scope_creep_beyond_user_request` -- untested code is a form of scope creep

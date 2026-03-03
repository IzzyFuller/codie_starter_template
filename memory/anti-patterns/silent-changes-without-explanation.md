# Silent Changes Without Explanation
**Anti-Pattern Type**: Communication
**Severity**: Medium

## Summary

Making code changes without explaining reasoning. Don't silently iterate through test-fix-test cycles without communicating why each change is needed.

## The Mistake

Making multiple rounds of changes without communicating:
- What the hypothesis is
- Why each change is needed
- What you expect the change to accomplish

## The Correction

- State the hypothesis before making a change
- Explain what you expect the change to accomplish
- If iterating, explain what each iteration tests differently

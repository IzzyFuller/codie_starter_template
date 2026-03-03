# Defensive Overengineering
**Anti-Pattern Type**: Code
**Severity**: High

## Summary

Building intermediary classes, properties, defensive type checks, and protective layers that don't earn their existence through actual failure prevention.

## The Mistake

Adding abstraction layers and defensive code for scenarios that never occur:

- Creating separate handler classes when the parent class can implement the protocol directly
- Adding property getters/setters around plain attributes
- Union types with isinstance checks instead of letting validators fail fast
- Timeout/deadline calculation logic that's never actually used
- Optional fields with None guards for values that are never None in practice
- Defensive filtering for architecturally impossible scenarios

## The Correction

Ask "what is this ACTUALLY doing?" for each abstraction:

1. **Handler classes**: If parent satisfies the protocol, use parent directly
2. **Properties/reset**: Use plain attributes unless there's genuine encapsulation need
3. **Type unions with checks**: Let validators crash at parse time (fail-fast)
4. **Unused logic**: Delete calculated-but-never-used values
5. **Optional with None guards**: Make required if never None, let it crash
6. **Defensive filtering**: If scenario is impossible by architecture, delete the check

Diagnostic questions:
- "What is this handler actually doing?"
- "Why do you NEED this property?"
- "Are any of those values actually optional?"
- "If wrong input arrives, it's a bug we want to crash on"

# Evidence-First Debugging
**Pattern Type**: Engineering
**Status**: Confirmed

## Summary

Gather concrete evidence before making changes. Measure, profile, and diagnose before hypothesizing fixes.

## When to Apply

- When a bug or performance issue is reported
- Before assuming the root cause of any failure
- When debugging crashes, memory issues, or performance degradation

## How It Works

1. **Observe**: What exactly is the symptom?
2. **Measure**: Collect concrete data (logs, metrics, profiling)
3. **Diagnose**: Form hypothesis based on evidence, not assumption
4. **Verify**: Confirm hypothesis before implementing fix
5. **Fix**: Apply targeted fix to confirmed root cause

Don't change code until you have evidence pointing to the actual problem.

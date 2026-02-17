# Pattern: Fail-Fast Engineering

**Category**: Code Quality and Error Handling
**Status**: Active principle

## Core Principle
**"We want big ugly crashes to surface data corruption bugs."** Fail-fast is DESIRABLE engineering excellence, not an anti-pattern.

## Pattern Description
Prefer code that crashes immediately on invalid data over defensive code that hides problems. Let bugs surface loudly rather than propagating silently through the system.

## When to Apply

### Apply Fail-Fast When:
1. **Data Validation**: Remove defensive type checks that hide corruption
2. **Schema Evolution**: Let crashes reveal incompatible data formats
3. **Contract Violations**: Allow TypeError/AttributeError to surface API misuse
4. **State Validation**: Crash on impossible states rather than attempting recovery

### Example: Defensive vs Fail-Fast

**Anti-Pattern (Defensive)**:
```python
def convert_legacy_items(v):
    if not isinstance(v, list):  # Hide non-list data
        return []  # Silent recovery masks corruption
    # ... conversion logic
```

**Fail-Fast Pattern**:
```python
def convert_legacy_items(v):
    if not v or isinstance(v[0], DetailedItem):
        return v  # Nothing to convert
    # v must be List[str] or we want a crash
    return [DetailedItem(value=item) for item in v]
```

**Rationale**: If v is not a list, we WANT the crash. It reveals data corruption that defensive code would hide.

## Contrast with Defensive Coding

### Defensive Coding (Anti-Pattern in Most Internal Contexts)
- Adds `isinstance()` checks for every operation
- Uses `hasattr()` before attribute access
- Catches broad exceptions and continues
- Provides default values for unexpected types
- Attempts recovery from invalid states

**Problems**: Hides bugs, makes debugging harder, adds complexity, creates false sense of robustness.

### Fail-Fast Engineering
- Assumes valid input per contract
- Lets the type system enforce contracts
- Minimal exception handling (only for expected cases)
- Crashes loudly on contract violations
- Clear failure messages at point of detection

**Benefits**: Bugs surface immediately, simpler code, easier debugging, forces fixing actual problems.

## Guard Clause Simplification

**Before**:
```python
if v is None:
    return v
if not v:
    return v
if isinstance(v[0], TargetType):
    return v
```

**After (Fail-Fast)**:
```python
if not v or isinstance(v[0], TargetType):
    return v  # Nothing to convert: None, empty, or already correct
```

## When Defensive Code IS Appropriate
1. **External Input Validation**: User input, API requests from untrusted sources
2. **Graceful Degradation**: When partial functionality is better than no functionality
3. **Error Recovery**: When recovery paths are well-defined and tested
4. **Backwards Compatibility**: When explicitly handling legacy formats

But even in these cases: **validate explicitly and fail loud** rather than silently recovering from unexpected states.

## Related Principles
- **Proportional Response**: Do not add complexity for speculative problems
- **Archaeological Engineering**: Investigate existing safeguards before adding new ones
- **Evidence-Based Validation**: Fix actual bugs, not imagined ones

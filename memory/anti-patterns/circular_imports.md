# Circular Imports Anti-Pattern

**Category**: Code Quality
**Severity**: High - CHRONIC recurring pattern

## Overview

Circular imports in Python are not something to "work around" -- they indicate architectural problems that must be fixed immediately.

## Why Circular Imports Are Anti-Patterns

Circular imports indicate:
- **Wrong dependency direction** -- imports should flow one way
- **Modules doing too much** -- responsibilities need to be split
- **Bad abstraction boundaries** -- types/functions in wrong locations

## Common (Wrong) Workarounds

### 1. TYPE_CHECKING Guards
```python
# WRONG - hides the symptom, doesn't fix the problem
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from module_b import SomeType
```

### 2. Lazy Imports Inside Functions
```python
# WRONG - masks architectural issues
def some_function():
    from module_b import something  # "Import here to avoid circular import"
    return something()
```

### 3. Comments Acknowledging the Problem
```python
# Import here to avoid circular import  <-- RED FLAG
```

## Correct Response to Circular Import

1. **Investigate the dependency cycle** -- understand which modules are in the cycle
2. **Fix the architecture**:
   - Extract shared dependency into its own module that doesn't participate in the cycle
   - Move types where they belong
   - Split module responsibilities
   - Fix dependency direction
3. **Address immediately** -- don't paper over with workarounds

## Key Learning

When facing circular imports, extract the shared dependency into its own module that doesn't participate in the cycle. This is the architectural fix, not a workaround.

## Related Anti-Patterns
- `misplaced_imports` -- often co-occurs with circular import workarounds

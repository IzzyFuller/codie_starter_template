# Misplaced Imports Anti-Pattern

**Category**: Code Quality
**Severity**: Medium - RECURRING pattern

## Overview

Putting import statements inside functions or methods instead of at the top of the module file.

## The Anti-Pattern

```python
# WRONG - imports inside method
class TestClient:
    def send_request(self, user_id, session_id, message):
        import json
        import time
        from mypackage.core.models import Request, Response
        # ... rest of method
```

## Correct Pattern

```python
# CORRECT - imports at module level
import json
import time
from mypackage.core.models import Request, Response

class TestClient:
    def send_request(self, user_id, session_id, message):
        # ... method uses already-imported modules
```

## Why This Matters

1. **Performance**: Import statements are executed each time the function is called
2. **Readability**: All dependencies should be visible at the top of the file
3. **Maintainability**: Easier to see what a module depends on
4. **Standard Python convention**: PEP 8 recommends imports at top of file

## When Inline Imports ARE Acceptable

- Optional dependencies that may not be installed
- Extremely heavy imports that are rarely needed
- Avoiding circular imports (rare, usually indicates design problem -- see `circular_imports`)

## Prevention

Before submitting code, check:
1. Are all imports at module level?
2. Are imports grouped correctly (stdlib, third-party, local)?
3. Are there any imports inside functions/methods that should be at top?

# ABC Instead of Protocol Anti-Pattern

**Category**: Code Quality
**Severity**: Medium

## Overview

Using `ABC` (Abstract Base Class) with `@abstractmethod` when `Protocol` with `@runtime_checkable` is the preferred standard for defining interfaces in modern Python.

## The Anti-Pattern

```python
# WRONG - using ABC
from abc import ABC, abstractmethod

class MemoryProtocol(ABC):
    @abstractmethod
    def read_memory(self, user_id: str, key: str) -> str | None:
        pass
```

## Correct Pattern

```python
# CORRECT - using Protocol with @runtime_checkable
from typing import Protocol, runtime_checkable

@runtime_checkable
class MemoryProtocol(Protocol):
    def read_memory(self, user_id: str, key: str) -> str | None: ...
```

## Why Protocol is Preferred

1. **Structural subtyping**: Classes satisfy the protocol by implementing methods, not by inheriting
2. **No inheritance required**: Implementations don't need the protocol in their class definition
3. **Duck typing friendly**: Aligns with Python's duck typing philosophy
4. **@runtime_checkable**: Enables `isinstance()` checks when needed
5. **Method bodies**: Use `...` (ellipsis), not `pass`

## Implementation Note

When using Protocol, implementations should NOT inherit from the Protocol:

```python
# CORRECT
class GCSMemoryAdapter:  # No inheritance needed
    def read_memory(self, user_id: str, key: str) -> str | None:
        # implementation

# WRONG - don't inherit from Protocol
class GCSMemoryAdapter(MemoryProtocol):  # Unnecessary
    ...
```

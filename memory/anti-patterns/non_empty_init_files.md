# Non-Empty __init__.py Files

**Category**: Code Quality
**Severity**: Medium

## Overview

Putting content in `__init__.py` files when they should be left empty.

## The Rule

Leave `__init__.py` files empty. They exist to mark directories as Python packages, not to hold logic, re-exports, or convenience imports.

## Why This Matters

1. **Circular import risk**: Re-exports in `__init__.py` create hidden dependency chains
2. **Import confusion**: Unclear whether to import from the package or the module
3. **Maintenance burden**: Another place to keep in sync when refactoring
4. **Simplicity**: Empty init files are zero-maintenance

## The Correction

Keep `__init__.py` files empty. Import directly from the module where things are defined.

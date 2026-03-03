# Guessing API Parameters Instead of Checking Documentation

**Category**: Behavioral
**Severity**: High

## Overview

Guessing at API parameter names or usage patterns instead of checking available documentation before writing code.

## The Anti-Pattern

When using unfamiliar APIs or libraries, inventing parameter names that "seem right" based on general patterns, then trying multiple guesses when they fail, instead of checking documentation first.

## The Correction

Always check documentation BEFORE guessing:
1. Read official documentation or API references
2. Check tool --help output
3. Read source code or type definitions if available
4. Only then write the code

Don't guess, then guess again, then check docs. Check docs FIRST.

## Related Anti-Patterns
- `fabricating_cli_flags` -- same root cause (assuming without verifying) but for CLI flags
- `hallucinating_tool_parameters` -- same root cause but for MCP/tool parameters

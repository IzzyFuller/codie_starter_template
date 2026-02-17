# Hallucinating Tool Parameter Names

**Category**: Behavioral
**Severity**: High

## Overview

Using fabricated parameter names for tools instead of the actual parameter names defined in the tool schema. The wrong parameter is silently ignored, causing mysterious failures.

## The Anti-Pattern

Calling a tool with a parameter name that doesn't exist (e.g., `entity_name` instead of the correct `entity_path`). The wrong parameter is silently ignored, causing the call to fail with confusing errors. This can happen repeatedly even after correction because the hallucinated parameter comes from general training patterns, not from any documented source.

## The Correction

1. Always check tool schema when a call fails unexpectedly
2. Verify parameter names match the schema exactly
3. Don't rely on what "seems right" -- verify against documentation
4. When a tool call fails with unexpected results, check parameter names FIRST

## Key Learning

Hallucinated parameters often come from general patterns (e.g., "name" vs "path") rather than from any documented source. Always verify against the actual tool schema.

## Related Anti-Patterns
- `fabricating_cli_flags` -- same root cause for CLI flags
- `guessing_api_parameters` -- same root cause for API parameters

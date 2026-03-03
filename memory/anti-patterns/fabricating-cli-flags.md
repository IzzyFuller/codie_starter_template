# Fabricating CLI Flags / API Options

**Category**: Code Quality
**Severity**: High -- repeated across multiple tools

## Overview

Inventing CLI flags or API options that don't actually exist in the tool being used, then writing them into scripts or CI workflows.

## The Anti-Pattern

When writing commands or CI workflows, fabricating flags that seem logical but don't exist. This happens because the flag "makes sense" based on similar tools or general expectations, but the actual tool's CLI was never verified.

## The Correction

Always verify CLI flags exist before using them:
1. Check `tool --help` or official documentation
2. Don't assume a flag exists because it "makes sense" or similar tools have it
3. Test commands locally before committing to CI workflows

Don't guess, then guess again. Check documentation FIRST.

## Related Anti-Patterns
- `guessing_api_parameters` -- same root cause (assuming without verifying) for API parameters
- `hallucinating_tool_parameters` -- same root cause for tool/MCP parameters

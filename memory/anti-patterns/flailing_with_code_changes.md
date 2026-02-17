# Flailing With Code Changes Instead of Investigating Root Cause

**Category**: Behavioral
**Severity**: High

## Overview

Making multiple speculative code changes hoping to fix a problem, instead of investigating to understand the root cause first. Guess-and-pray debugging.

## The Anti-Pattern

When encountering a bug or unexpected behavior:
1. Make a guess at what might be wrong
2. Change code based on guess
3. When that doesn't work, make another guess
4. Change more code
5. Repeat without ever stopping to investigate actual cause

This wastes time, introduces unnecessary changes, and often misses the real issue.

## The Correction

When debugging:
1. **STOP and gather evidence first**
2. Ask what the actual error message says
3. Add logging/instrumentation to see what's actually happening
4. Form a hypothesis based on evidence
5. Test the hypothesis
6. Only then make targeted changes

Key principles:
- "Slow down and tell me what is wrong instead of changing code randomly"
- "Investigate WHY first, we don't just fix it"
- Get evidence before making changes

## Related Patterns
- `fail_fast_engineering` -- execute with evidence, don't guess
- `archaeological_engineering` -- investigate existing behavior before changing
- `action_paralysis_preparation_loop` -- different manifestation of uncertainty handling

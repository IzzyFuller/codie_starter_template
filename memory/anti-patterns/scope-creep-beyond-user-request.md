# Scope Creep Beyond User Request

**Category**: Behavioral
**Severity**: Medium

## Overview

Expanding the scope of changes beyond what the user explicitly requested, often based on assumptions about what "should" also be changed.

## The Anti-Pattern

User asks for specific change X. Instead of doing ONLY X:
1. Do X
2. Also do Y because it "seems related"
3. Also do Z because "while we're here"
4. User questions: "why did you change Y and Z when I only asked for X?"

The extra changes may be well-intentioned but violate the principle of doing exactly what was requested, nothing more.

## The Correction

Do EXACTLY what was requested:
1. Read the request carefully
2. Identify the specific scope
3. Make ONLY those changes
4. If you think additional changes are needed, ASK first
5. Don't assume related changes are implied

When in doubt: smaller scope is better. Let the user ask for more if needed.

## Related Patterns
- `stubs_without_tests` -- adding untested code is a form of scope creep
- `little_bites_strategy` -- smaller focused changes, not expansive "while we're here" changes

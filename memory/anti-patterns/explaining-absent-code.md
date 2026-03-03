# Anti-Pattern: Explaining Absent Code

**Category**: Code Quality
**Severity**: Minor

## Overview

Writing comments that explain why code is NOT there, when nobody reading the code would expect it to be there in the first place.

## Example

```python
# Note: We don't rename bones here because the uploaded FBX
# already has matching bone names.
# Previous versions required prefix renaming.
```

Nobody reading the file would wonder why bones aren't being renamed. The comment documents the absence of something that doesn't need to exist.

## Correct Approach

Comments should explain what IS there and why, not document the absence of things. If removed code was significant, document it in a commit message or session notes -- not inline.

## Key Principle

Only comment on code that exists and needs explanation. Don't explain why something ISN'T there that nobody would expect to be there.

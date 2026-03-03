# Never Amend Commits
**Anti-Pattern Type**: Git Safety
**Severity**: High

## Summary

Never amend commits. Always create new commits. No exceptions.

## The Mistake

Using `git commit --amend` to modify the previous commit. This rewrites history and can destroy previous work, especially if:
- The amended commit was already pushed
- Pre-commit hooks fail and --amend modifies the WRONG commit

## The Correction

Always create new commits. If there's a mistake in the previous commit, fix it and create a NEW commit.

**HARD RULE: Never amend commits. Always create new commits. No exceptions.**

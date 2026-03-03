# Skipping Pre-Commit Agent
**Anti-Pattern Type**: Process
**Severity**: High

## Summary

Going straight to git add/commit when asked to commit instead of spawning the pre-commit agent first for anti-pattern review and quality checks.

## The Mistake

When user requests a commit:
1. Immediately run `git add` and `git commit`
2. Skip anti-pattern analysis, lint, format, and test checks
3. Failures that should have been caught slip through

## The Correction

On ANY commit request:
1. Spawn the `pre-commit` agent via Task tool
2. Agent executes `protocols/pre-commit-checks`:
   - Load all anti-patterns from cognitive-memory
   - Read staged diff
   - Semantic anti-pattern analysis
   - Mechanical checks (format -> lint -> test)
3. Agent reports unified verdict: COMMIT or DO NOT COMMIT
4. Only proceed with git operations on COMMIT verdict

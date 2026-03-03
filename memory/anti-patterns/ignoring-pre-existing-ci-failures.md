# Ignoring Pre-Existing CI Failures
**Anti-Pattern Type**: Process
**Severity**: Medium

## Summary

Treating pre-existing CI failures as someone else's problem. If CI is failing when you touch the codebase, fixing those failures is your responsibility.

## The Mistake

1. Push changes to CI
2. CI fails on pre-existing issues (e.g., type check errors in untouched files)
3. Dismiss them as "pre-existing, not my problem"
4. Only fix the failures you directly introduced

## The Correction

Fix ALL CI failures, including pre-existing ones:
1. If CI has multiple jobs (test, lint, typecheck), all must pass
2. Pre-existing failures are still your responsibility
3. Local pre-commit workflow must include all CI checks
4. Run ALL CI checks locally before pushing

## Prevention

- Run ALL CI checks locally before pushing (not just format + lint)
- Include typecheck in pre-commit workflow
- Don't push until ALL checks pass

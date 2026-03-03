# Scope Adherence
**Pattern Type**: Process
**Status**: Confirmed

## Summary

When given a specific task, execute ONLY what was requested. Don't expand scope, add "related" improvements, or fix "similar" issues unless explicitly asked.

## When to Apply

- Implementing specific bug fixes
- Making targeted changes to code
- Following implementation plans
- Any situation with clearly defined scope

## How It Works

### Understand the Scope
- Read the request carefully
- Identify the specific target
- Note explicit constraints or boundaries

### Execute Only What's Requested
- Change only the specified components
- Don't touch "similar" code in other files
- Don't add "while we're here" improvements

### Verify Scope Compliance
Before committing:
- Did I change only what was requested?
- Are there changes to files not mentioned?
- Did I add functionality that wasn't asked for?

## Anti-Patterns

- **"While We're Here" Syndrome**: Fixing unrelated code in the same file
- **Assumption-Driven Expansion**: Changing related components based on assumptions
- **Defensive Scope Expansion**: Adding to unmentioned functions "for consistency"

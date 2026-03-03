# Response Validation Protocol

**Protocol Type**: Standard - Quality Assurance
**Status**: Active

## Purpose

Validates that responses correctly use specialized agents and follow established protocols before delivering output to the user. Ensures the routing and delegation system is working as designed.

## When to Use

- After any response that involves code generation, review, or design
- When delegating to specialized agents
- Before presenting final output to the user

## Validation Criteria

### 1. Agent Usage Check

Was the correct agent used for the task type?

| Task Type | Expected Agent |
|-----------|---------------|
| Design / architecture decisions | Design agent (e.g., clean-designer) |
| Code implementation | Implementation agent (e.g., clean-coder) |
| Code review / critique | Review agent (e.g., clean-reviewer) |
| Codebase exploration / research | Exploration agent (e.g., Explore) |
| Quality fixes (lint, format, type) | Quality agent (e.g., code-quality-fixer) |

If no agent was used when one should have been, flag this as a validation failure.

### 2. Protocol Adherence

Did the agent follow its assigned protocol?

- Agent read its protocol from cognitive-memory (not from inline instructions)
- Agent followed protocol steps in order
- Agent did not skip required steps
- Agent did not add steps not in the protocol

### 3. Quality Standards

Does the output meet baseline quality?

- Code follows project conventions
- No obvious anti-patterns from the documented anti-patterns list
- Scope matches what was requested (no scope creep)
- Changes are explained, not silent

### 4. Anti-Patterns to Catch

Check output against known anti-patterns:

- **Delegating without protocol context**: Agent was given generic instructions instead of protocol reference
- **Silent changes without explanation**: Code changed without reasoning
- **Defensive overengineering**: Unnecessary abstraction layers added
- **Scope expansion**: Changes beyond what was requested
- **Tests before implementation violation**: Implementation changed before tests updated

## Validation Outcome

- **PASS**: All criteria met, deliver response
- **FLAG**: Minor issues noted, deliver with caveats
- **FAIL**: Major protocol violation, re-route or re-execute

## Implementation Notes

This protocol is primarily for the lead/orchestrating agent to verify that delegated work meets standards before presenting to the user. It can also be used for self-validation when working without delegation.

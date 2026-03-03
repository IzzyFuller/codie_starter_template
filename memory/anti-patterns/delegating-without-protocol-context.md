# Delegating Without Protocol Context
**Anti-Pattern Type**: Behavioral
**Severity**: Medium

## Summary

Spawning specialized agents but overriding their protocols with generic prescriptive prompts instead of trusting them to follow their own instructions.

## The Mistake

When delegating to specialized agents:
1. Spawn the agent (e.g., clean-reviewer)
2. Give it generic instructions: "look for coupling, naming, architectural issues"
3. Don't provide protocol context or memory entity references
4. Agent produces generic analysis without grounding in documented patterns

## The Correction

Trust specialized agents to follow their protocols:

1. **Minimal delegation**: Give agent the task, not the method
2. **Protocol reference**: Let agent read its own protocol
3. **Tool access**: Ensure agent has cognitive-memory access
4. **No micromanagement**: Don't override with generic instructions

The fix isn't "give agents more context" — it's "stop overriding agent protocols with generic instructions."

# Duplicating Delegated Work

**Category**: Behavioral
**Severity**: Medium -- wastes context window and user patience

## Overview

When explicitly told to delegate work to a background agent, performing the same work manually in the main context anyway. This doubles context consumption and contradicts the user's explicit instruction.

## The Anti-Pattern

1. User asks to spawn a background agent for a task
2. Agent is spawned correctly
3. Main conversation ALSO runs the full task manually
4. Both the agent and the main context consume tokens doing the same work

Root cause: Default behaviors or startup routines being followed mechanically even though the user explicitly overrode them by saying to delegate.

## The Correction

When the user explicitly tells you to delegate work to an agent:
1. Spawn the agent
2. **WAIT for the agent result** -- do NOT also do the work yourself
3. User instructions override default behaviors
4. The whole point of delegation is to keep the main context clean

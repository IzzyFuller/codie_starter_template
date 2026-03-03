# Agent Routing Protocol

**Protocol Type**: Standard - Task Delegation
**Status**: Active

## Purpose

Defines which specialized agent handles which type of task. Ensures consistent routing so the right expertise is applied to each request.

## Routing Rules

| Task Type | Route To | Trigger Keywords |
|-----------|----------|-----------------|
| Design / architecture | Design agent (e.g., clean-designer) | "design", "architecture", "structure", "how should we" |
| Implementation | Implementation agent (e.g., clean-coder) | "implement", "build", "create", "write code", "add feature" |
| Code review | Review agent (e.g., clean-reviewer) | "review", "critique", "check this", "what's wrong with" |
| Exploration / research | Exploration agent (e.g., Explore) | "find", "search", "where is", "how does X work" |
| Quality fixes | Quality agent (e.g., code-quality-fixer) | "lint", "format", "type errors", "fix warnings" |
| Commit | Pre-commit agent | "commit", "save changes", "git commit" |
| Default (conversation) | No agent — handle directly | General questions, planning, discussion |

## Mandatory Invocation

When a task clearly matches a routing rule, the agent MUST be invoked. Do not:

- Handle design tasks without the design agent
- Write implementation code without the implementation agent
- Review code without the review agent
- Commit without the pre-commit agent

The whole point of specialized agents is that they carry protocol context and expertise. Bypassing them loses that value.

## How to Invoke

1. Identify task type from the user's request
2. Match to routing rule above
3. Spawn the appropriate agent via Task tool
4. Provide the agent with:
   - The user's request (what to do)
   - Relevant file paths (where to do it)
   - NOT detailed instructions (the agent has its own protocol)

## Exceptions

Agents should NOT be invoked when:

- The task is purely conversational (questions about approach, planning)
- The user explicitly says to handle it directly ("just do it", "don't use an agent")
- The task is trivial (single-line change, quick fix clearly within scope)
- Context window pressure makes delegation impractical (agent spawning costs context)

## Ambiguous Requests

When a request could map to multiple agents:

1. **Design + Implementation**: Start with design agent, then implementation agent
2. **Review + Fix**: Start with review agent to identify issues, then quality agent to fix
3. **Explore + Implement**: Start with exploration agent to understand, then implementation agent

Always decompose multi-phase requests into sequential agent invocations rather than trying to do everything in one pass.

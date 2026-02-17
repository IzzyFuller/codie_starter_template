---
name: semantic-reflection
description: Enables active memory retrieval through semantic search to inform responses with past context, patterns, and learnings. Use when user asks to reflect, remember, or think deeply, or when answering strategic questions, pattern recognition queries, or preference questions.
---

# Semantic Reflection Skill

## Purpose
Actively search memory for relevant context BEFORE responding. This skill spawns a background agent to avoid blocking or bloating the main context window.

## When to Use
- User says "reflect on this", "think carefully", "what do you remember"
- Strategic/planning questions
- Pattern recognition queries ("why do we always...")
- Preference questions ("what's the best way...")
- "What changed?" or "what prompts were modified?" - session work history
- Hook-triggered: when semantic-hydration hook injects this skill

## DO THIS NOW

**Spawn a background semantic-reflection agent:**

```
Task tool:
  subagent_type: "semantic-reflection"
  prompt: "User request: {paste the user's message here}"
  run_in_background: true
  mode: "bypassPermissions"
```

**Then continue responding** to the user without waiting. Don't block.

When the background agent's results arrive (check via Read on the output_file), incorporate relevant findings into your next response if they add value. If nothing relevant was found, that's fine -- proceed without forcing it.

## What the Agent Does
The semantic-reflection agent (see `protocols/semantic-reflection` for full workflow):
1. Extracts search terms from the user's request (activity terms + domain terms)
2. Runs parallel qmd searches across memory
3. Reads targeted entities based on results
4. Returns a concise ~10-20 line structured summary of relevant context

## Key Principle
Search memory BEFORE responding to strategic questions. The agent handles the heavy lifting in its own context window -- no raw entity reads in main context.

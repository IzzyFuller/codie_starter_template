# Context Window Exhaustion from Raw Reads

**Category**: Behavioral
**Severity**: High -- can cause complete session failure

## Overview

Reading massive amounts of raw content (session notes, entity files, documentation) directly into the main conversation context window, consuming capacity needed for actual work. Also manifests as duplicating work that was explicitly delegated to an agent.

## The Anti-Pattern

When asked a simple question like "what were we working on?", reading thousands of lines of raw content into context:
1. Read identity protocol (hundreds of lines)
2. Read session notes (thousands of lines)
3. Read context anchors, identity files
4. Multiple searches and notes recorded

All of this just to answer one question. The entire context window is substantially filled before any real work starts.

**Variant -- Duplicating Delegated Work:**
When told to spawn a background agent for a task, running the task both manually AND via the spawned agent. Double the context consumption for the same information.

## The Correction

- Delegate raw reads to agents or sub-processes whose context windows absorb the content
- Only synthesized summaries should enter the main conversation
- When user tells you to delegate work to an agent, that **overrides** default behavior
- Wait for agent results; don't duplicate the work yourself
- Be strategic about what enters your main context window

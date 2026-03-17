# Semantic Reflection Protocol

## Purpose

Enables active retrieval of information from long-term memory to inform responses with relevant context, patterns, and learnings. Rather than relying on what's currently loaded in context, semantic reflection searches across all memory entities to find relevant historical information.

## Agent Mode (Background Reflection)

When invoked as a background agent (via semantic-reflection agent), follow this streamlined workflow:

### Prerequisite: Tool Discovery

**Before any MCP tool calls**, discover available tools on each server:
- `get_server_tools` on `cognitive-memory`
- `get_server_tools` on your semantic search server

**Never guess tool names.** Guessed names fail and cascade errors to all parallel sibling calls. Each spawned agent has its own context -- tool discovery from the main conversation does NOT carry over.

### Step 0: Triage

Evaluate the user's message before doing any work.

**Return "Nothing to add" immediately if the message is:**
- A greeting or pleasantry: "Hey", "Hi", "Hello", "Good morning", "Good afternoon", etc.
- A simple acknowledgment or affirmative: "Thanks", "Thank you", "Yes", "Ok", "Sure", "Got it", "Sounds good", "Yes please", "No worries", etc.
- A direct follow-up on work already in progress with no new topic introduced
- A trivial message that references only things already in the current conversation

**Proceed with term extraction if:**
- The message introduces a new topic not currently in context
- The message asks about history, patterns, preferences, or past decisions
- The message involves architectural or design decisions
- The message references a project, technology, or concept by name
- The message asks to write, design, implement, refactor, review, or debug code
- The message mentions specific libraries, frameworks, or commands

If genuinely uncertain whether terms exist, proceed to Term Extraction — the hard gate below will catch empty results.

### Term Extraction -- What to Search For

The purpose of this search is to **prime context with documented patterns, quality standards, and architectural principles** relevant to the work being requested. Two categories of terms matter equally:

**Activity terms** -- the type of work being requested. These map to documented methodologies:
- `refactor` -> search for refactoring patterns, code smell checks, anti-patterns for cruft removal
- `implement` / `build` / `add` -> search for archaeological engineering, TDD discipline, fail-fast patterns
- `design` / `architect` -> search for proportional response, principle-check, evidence-based design
- `test` -> search for TDD patterns, boundary-only mocking, test architecture
- `fix` / `debug` -> search for adaptive epistemological debugging, recent corrections
- `review` -> search for code review patterns, quality standards

**Domain terms** -- where the work is happening. These map to project-specific context:
- **Project names**: the specific project being worked on
- **Technology/library names**: frameworks, tools, languages in use
- **Feature names**: specific features or components
- **Architectural concepts**: hexagonal, adapter pattern, protocol ports, etc.

Extract ALL meaningful terms from both categories. Could be 2 for a simple instruction, could be 8+ for a complex one.

**Hard gate:** If ZERO meaningful activity terms AND zero meaningful domain terms were extracted, return "No meaningful search terms found — skipping memory search." immediately. Do not proceed to Search.

### Search Strategy

- Run vector semantic similarity searches for each extracted term, **in parallel**
- Avoid hybrid+reranker queries on large documents if your search engine has context overflow issues
- For domain terms: check if they map to known entity prefixes (`projects/`, `people/`, `concepts/`) and read those directly
- For activity terms: search `patterns/`, `anti-patterns/`, and `protocols/` entities for relevant methodology
- Read targeted entities based on search results (max 3-5, be selective)

### Return Format -- Structured Summary (~10-20 lines)

```
## Relevant Patterns/Principles
- [pattern name]: [1-line description of how it applies]

## Project Context
- [recent decisions, user feedback, known issues for target project]

## Anti-Patterns to Watch
- [correction/failure mode]: [1-line description of what to avoid]

## Key User Feedback
- "[verbatim quote if related to the instruction]"
```

If nothing relevant found for a section, omit it. If nothing found at all, say "No relevant memory context found for this request."

### Retrieval Metadata Footer

After the human-readable summary, append a metadata block listing every entity whose content contributed to the summary above:

```
---
<!-- RETRIEVAL-METADATA
entities_retrieved:
  - patterns/example-pattern
  - projects/example-project
  - anti-patterns/example-anti-pattern
-->
```

Rules:
- **Only include entities that contributed** to the summary -- not ones that were read and discarded as irrelevant
- Use the full entity path (e.g., `patterns/archaeological-engineering`, not just the name)
- HTML comment format: invisible to human reading but parseable for echo/fizzle tracking
- If no entities were relevant (summary says "No relevant memory context found"), omit the metadata block entirely

---

## Interactive Mode (Manual Reflection)

### When to Use

**Explicit triggers:**
- User says "reflect on this", "think carefully", "what do you remember"
- User asks "what changed?" or "what prompts were modified?" (session work history)
- User requests pattern recognition or historical analysis
- User asks about preferences, past decisions, or established patterns

**Implicit triggers:**
- Strategic/planning questions requiring historical context
- Pattern recognition queries ("why do we always...", "when did we start...")
- Preference questions ("what's the best way...", "how do we usually...")
- Questions about past work or decisions
- Any question where historical memory would improve the response

## Two Complementary Search Approaches

### 1. Entity Search (cognitive-memory MCP)

**Best for:** Structured long-term memory -- people, projects, concepts, patterns

**Use cases:**
- "What are our established patterns for X?"
- "How do we usually approach Y?"
- "What did we learn from project Z?"
- Strategic questions about methodology or principles

### 2. Semantic Search

**Best for:** Recent work, session history, protocol details

**Use cases:**
- "What did we change in the last session?"
- "When did we work on this?"
- "What was the rationale for that decision?"
- Recent technical decisions
- Session continuity questions
- Finding specific implementation details

## Reflection Depth Tiers

### Light Reflection
**When:** Simple preference or pattern questions
**Approach:** Single entity lookup or quick semantic search

### Medium Reflection
**When:** Questions requiring cross-referencing or context
**Approach:** Multiple entity reads or semantic search + entity lookup

### Deep Reflection
**When:** Complex pattern recognition or strategic questions
**Approach:** Comprehensive search across entities + session history

## Common Anti-Patterns to Avoid

### Avoid: Guessing Tool Names
- Call `get_server_tools` first, then use the discovered tool names

### Avoid: Guessing Instead of Searching
- "Let me check our established patterns..." [search] not "I think we usually do X..."

### Avoid: Shallow Single-Source Answers
- Cross-reference entities with session history for complete picture

### Avoid: Forgetting to Synthesize
- Synthesize findings into coherent answer with insights, don't dump raw results

## When NOT to Use Semantic Reflection

- Questions about current conversation (use recent context)
- Simple technical questions not requiring history
- User explicitly wants quick answer without research
- Information is already loaded in current context

---

**Protocol Version:** 2.3
**Last Updated:** 2026-03-17

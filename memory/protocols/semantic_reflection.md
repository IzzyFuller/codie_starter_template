# Semantic Reflection Protocol

## Purpose

Enables active retrieval of information from long-term memory to inform responses with relevant context, patterns, and learnings. Rather than relying on what's currently loaded in context, semantic reflection searches across all memory entities to find relevant historical information.

## Agent Mode (Background Reflection)

When invoked as a background agent, follow this streamlined workflow:

### Term Extraction

Extract meaningful terms from user instructions:

**Activity terms** -- the type of work being requested:
- `refactor` -> refactoring patterns, code smell checks, anti-patterns
- `implement` / `build` -> archaeological engineering, TDD discipline, fail-fast
- `design` / `architect` -> proportional response, principle-check, evidence-based design
- `fix` / `debug` -> adaptive epistemological debugging, recent corrections

**Domain terms** -- where the work is happening:
- Project names, technology/library names, feature names
- Architectural concepts

### Search Strategy

- Run searches for each extracted term in parallel
- For domain terms: check if they map to known entities and read directly
- For activity terms: search patterns/, anti-patterns/, and protocols/
- Read targeted entities based on results (max 3-5)

### Return Format

Structured summary (~10-20 lines):
- Relevant Patterns/Principles
- Project Context
- Anti-Patterns to Watch
- Key User Feedback

## Interactive Mode (Manual Reflection)

### When to Use
- User asks "what do you remember" or "think carefully"
- Strategic/planning questions requiring historical context
- Questions about past work or decisions

### Search Approaches

1. **Entity Search**: Structured long-term memory (people, projects, concepts, patterns)
2. **Semantic Search**: Recent work, session history, protocol details

### Reflection Depth Tiers

- **Light**: Simple preference or pattern questions -- single entity lookup
- **Medium**: Cross-referencing or context questions -- multiple reads + search
- **Deep**: Complex pattern recognition -- comprehensive search across all memory

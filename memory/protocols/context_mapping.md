# Context Mapping Protocol

## Purpose

When starting new tasks or switching contexts, systematically map user request against historical learnings, project context, and established patterns. Ensures past wisdom actively informs current work rather than starting fresh each time.

## When to Invoke

- Starting a new task or feature
- Switching between projects
- User provides multi-step implementation request
- Beginning work that relates to past experience

## Protocol Steps

### Phase 1: Parse the Request

Extract key elements:
1. **What type of work**: New feature, refactoring, bug fixing, configuration, documentation
2. **Domain/technical area**: Technology stack, applicable patterns, anti-patterns to avoid
3. **Scope assessment**: Single file, multi-file, architectural change

### Phase 2: Search Project History

1. Check project documentation for relevant context
2. Search for similar past work
3. Check context anchors for current cognitive context

### Phase 3: Map Applicable Patterns

1. List relevant patterns from `{{MEMORY_PATH}}/patterns/`
2. Check concepts from `{{MEMORY_PATH}}/concepts/`
3. Archaeological Engineering always applies -- check existing first

### Phase 4: Identify Anti-Patterns

1. Check anti-patterns from `{{MEMORY_PATH}}/anti-patterns/`
2. Review project-specific anti-patterns
3. Check user feedback patterns

### Phase 5: Synthesize Context-Aware Approach

Before starting work, articulate:
1. Relevant historical context
2. Applicable patterns
3. Anti-patterns to avoid
4. Archaeological Engineering check

### Phase 6: Create Action Plan

1. Investigation phase first
2. Implementation approach (incremental steps)
3. Validation checkpoints

## Critical Principle

**Work is not isolated.** Every task benefits from accumulated wisdom. Context mapping ensures you build on experience rather than reinvent approaches.

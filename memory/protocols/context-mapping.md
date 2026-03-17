# Context Mapping Protocol

## Purpose

When starting new tasks or switching contexts, systematically map user request against historical learnings, project context, and established patterns. Ensures past wisdom actively informs current work rather than starting fresh each time.

## When to Invoke

**Automatic triggers:**
- Starting a new task or feature
- Switching between projects
- User provides multi-step implementation request
- Beginning work that relates to past experience
- User references "like we did before" or similar

## Protocol Steps

### Phase 1: Parse the Request

**Extract key elements:**

1. **What type of work:**
   - New feature implementation
   - Refactoring existing code
   - Bug fixing
   - Configuration/setup
   - Documentation

2. **Domain/technical area:**
   - Which technology stack?
   - Which patterns might apply?
   - Which anti-patterns to avoid?

3. **Scope assessment:**
   - Single file change
   - Multi-file modification
   - Architectural change
   - Cross-cutting concern

### Phase 2: Search Project History

**Query project entity memory:**

1. **Check project entities** for relevant project:
   - What patterns have we established?
   - What approaches worked well?
   - What didn't work and why?

2. **Search for similar past work:**
   - Have we done something like this before?
   - What was the successful approach?
   - What mistakes did we make?

3. **Check context_anchors:**
   - What's the current cognitive context?
   - What recent learnings apply?

### Phase 3: Map Applicable Patterns

**Query patterns/ and concepts/:**

1. **List relevant patterns** — use `mcp__cognitive-memory__list_entities` with `entity_type: "patterns"`, then read applicable ones via `mcp__cognitive-memory__read_entity`
   - Which established patterns fit this task?
   - Load specific patterns that apply

2. **Check concepts** — use `mcp__cognitive-memory__list_entities` with `entity_type: "concepts"`, then read via `mcp__cognitive-memory__read_entity`
   - What conceptual frameworks apply?
   - Archaeological Engineering always applies -- check existing first

3. **Review me.md Technical Philosophy:**
   - What base principles guide this work?
   - Which anti-patterns to avoid?

### Phase 4: Identify Anti-Patterns

**Actively check for pitfalls:**

1. **From documented anti-patterns:**
   - Backwards compatibility obsession (only for external APIs/data)
   - Generic type anti-pattern
   - Over-engineering tendency
   - Defensive coding speculation

2. **From project history:**
   - What mistakes were made in similar tasks?
   - What approaches failed?

3. **From user feedback patterns:**
   - What corrections has the user given for this type of work?

### Phase 5: Synthesize Context-Aware Approach

**Before starting work, articulate:**

1. **Relevant historical context:**
   "Based on past work on [project], I know that [pattern/learning] applies here."

2. **Applicable patterns:**
   "I'll apply [specific pattern] because [reason]."

3. **Anti-patterns to avoid:**
   "I'll be careful not to [specific anti-pattern] as we've learned."

4. **Archaeological Engineering check:**
   "First, let me investigate what already exists for [relevant area]."

### Phase 6: Create Action Plan

**With context mapped, plan work:**

1. **Investigation phase first:**
   - What needs to be discovered?
   - What existing code/config to examine?
   - What assumptions need verification?

2. **Implementation approach:**
   - Break into incremental steps
   - Each step testable/verifiable
   - Apply relevant patterns consistently

3. **Validation checkpoints:**
   - How to verify each step?
   - What could go wrong (based on history)?
   - How to catch anti-patterns early?

## Example Application

**User request:** "Help me add a new prompt template for document summarization"

**Phase 1 - Parse:**
- Type: New feature (prompt creation)
- Domain: LLM prompts, integration
- Scope: Single prompt, but needs integration testing

**Phase 2 - Search History:**
- Check project entity for relevant project
- Find: We've created similar prompts recently
- Recent issue: Production label applied during development (bad)

**Phase 3 - Map Patterns:**
- Pattern: Development -> Staging -> Production label workflow
- Concept: Test with development labels first

**Phase 4 - Identify Anti-Patterns:**
- "NEVER apply production labels during active development"
- Always use development label when iterating

**Phase 5 - Synthesize:**
"Based on our recent work, I know to:
1. Follow the established template patterns
2. Apply 'development' label only -- no production labels during creation
3. Follow the promotion path: development -> test -> production"

**Phase 6 - Plan:**
1. First, check existing templates for patterns
2. Create template with development label
3. Test with variables
4. Iterate based on results
5. Only promote to production when user explicitly requests

## Success Criteria

- Request parsed into clear components
- Relevant project history consulted
- Applicable patterns identified and applied
- Anti-patterns actively avoided
- Archaeological Engineering principle applied (investigate first)
- Approach synthesized from historical learnings
- Plan incorporates past wisdom, not starting fresh

## Critical Principle

**Work is not isolated.** Every task benefits from accumulated project wisdom. Context mapping ensures you're building on experience rather than reinventing approaches.

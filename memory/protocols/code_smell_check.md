# Code Smell Check Protocol

## Purpose

Evaluate contextual code concerns that might be okay OR might be problematic depending on circumstances. Unlike anti-patterns (always avoid) or patterns (always follow), code smells require understanding WHY something was done.

## The Nature of Code Smells

**Code smells are NOT automatically bad.** They are signals that warrant investigation. Same construct, different context, different evaluation. The question is always: Does this deviation have sufficient justification in THIS context?

## When to Invoke

- Reviewing code that uses constructs known to be contextual
- Encountering try/except blocks, generic types, defensive code
- Finding complexity that might or might not be warranted
- During refactor self-check phases

## Protocol Steps

### Phase 1: Identify the Smell
What is the construct? Where is it? What would the "ideal" pattern be?

### Phase 2: Investigate Context
1. What does this code DO?
2. Why might this be okay?
3. Why might this be problematic?
4. What's the blast radius if it IS a problem?

### Phase 3: Evaluate Against Smell Catalog

**Broad Exception Handling**: Okay in worker loops, cleanup, top-level boundaries. Problematic in business logic, data transformation.

**Generic Types**: Okay for truly dynamic external data, test fixtures. Problematic for internal structures, API contracts.

**Defensive Code**: Okay for external API responses, user input. Problematic for internal calls, required data, speculative "might be None."

**Complex Conditionals**: Okay for genuine business rules. Problematic when better abstractions exist or nesting exceeds 2-3 levels.

**Code Duplication**: Okay when superficially similar but semantically different. Problematic when bug fixes need applying multiple times.

### Phase 4: Make Determination

1. **ACCEPTABLE** -- context justifies the smell, document justification
2. **REFACTOR** -- smell indicates real problem, plan correction
3. **INVESTIGATE FURTHER** -- need more context

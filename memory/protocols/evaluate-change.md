# Evaluate Change Protocol

**Protocol Type**: Testing & Validation
**Status**: Active

## Purpose

Systematic framework for evaluating Claude Code configuration changes across sessions. Uses session notes as test artifacts + semantic search for comparison.

## When to Use

- Before modifying skills, hooks, settings, or agents
- When wanting evidence a change actually improves things
- For A/B testing behavioral modifications

## 5-Phase Workflow

### Phase 1: Design Test

1. Define the change being evaluated
2. Create test prompts that exercise the behavior
3. Define success metrics (qualitative/quantitative)

### Phase 2: Capture Baseline

1. Start fresh session (baseline)
2. Run test prompts
3. Document structured observations

### Phase 3: Apply Change

1. Edit configuration files
2. Document exact changes

### Phase 4: Capture Evaluation

1. Start fresh session (with change applied)
2. Run IDENTICAL test prompts
3. Document observations same structure as baseline

### Phase 5: Compare and Decide

1. Side-by-side diff of baseline vs evaluation
2. Assess against success metrics
3. Decision: KEEP / REVERT / ITERATE
4. Document reasoning

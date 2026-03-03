# Changeability-First Design

## Summary

When evaluating design choices, think about how hard it will be to debug or change the resulting code, NOT what future features might be needed.

## Key Distinction

**Anti-Pattern (Speculative Feature Building)**:
- "User might need X in the future, so build flexibility now"
- "This abstraction will help if requirements change"

**Valid Heuristic (Evaluating Changeability)**:
- "Design A has nested conditionals, Design B has guard clauses. Design B will be easier to modify."
- "This 80-line function is hard to understand. Smaller functions make it easier to isolate changes."

## Core Insight

You're not predicting WHAT will change — you're evaluating HOW RESISTANT TO CHANGE the design is.

## Evaluation Questions

1. **Is this code easy to understand?**
2. **If a bug appears, how hard to debug?**
3. **If requirements shift, how resistant to change?**
4. **Does complexity match problem complexity?** (Proportional Response)

## Red Flags (Speculative)
- "We might need..."
- "In case we want to..."
- "Future-proofing for..."

## Green Flags (Changeability)
- "This will be easier to debug because..."
- "Changes will be localized to..."
- "The control flow is clearer with..."

## Integration

- **Proportional Response**: Solution complexity < problem complexity
- **Archaeological Engineering**: Evaluate if existing code is easy to change vs. rewrite
- **Fail-Fast Engineering**: Design for debuggability through clear failure modes

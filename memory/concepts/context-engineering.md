# Context Engineering

## Summary

Emerging discipline focused on how to effectively structure and manage context for AI systems. A memory architecture built on these principles independently converges on many of the same ideas.

## Core Concepts

### The Event Clock
Every system has two clocks:
- **State Clock**: What's true right now
- **Event Clock**: What happened, in what order, WITH REASONING

### Three-Layer Architecture
1. **Content Layer**: Immutable source documents (evidence trail)
2. **Entities Layer**: Identity-resolved people, organizations, products
3. **Facts Layer**: Temporal assertions with source attribution

### Decision Traces
The key differentiator: store DECISIONS (what was considered, why path was chosen), not just OUTCOMES.

## Convergence with Memory Architecture

| Context Engineering Principle | Memory Architecture Implementation |
|------------------------------|------------------------------------|
| Event clock (decision traces) | Session notes capturing rationale |
| State clock (current facts) | Entity files with current state |
| Progressive disclosure | context_anchors -> entity files |
| Attention budget | Selective entity loading at startup |
| Tiered memory | current_session / context_anchors / entities |
| Identity resolution | Entity deduplication (people/, projects/) |
| Grounding truth | me.md, patterns/, protocols/ as foundation |
| Continuity | context_anchors persisting across sessions |

## Significance

The most important patterns aren't invented — they're discovered. A memory architecture that emerges from practical needs (identity continuity, session documentation, knowledge preservation) can independently arrive at patterns being formalized as Context Engineering.

## Key Quotes

- "Advantage won't come from better models. It will come from better context."
- "The map must precede the walkers."

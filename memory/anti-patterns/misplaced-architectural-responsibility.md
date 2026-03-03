# Misplaced Architectural Responsibility
**Anti-Pattern Type**: Code
**Severity**: Medium

## Summary

Placing concerns in the wrong architectural layer — retrieval vs consumer, thin wrapper vs protocol, infrastructure vs application.

## The Mistake

- Putting consumer logic in the retrieval layer
- Putting protocol instructions in hook code instead of the protocol entity
- Putting business logic in infrastructure code
- Putting display formatting in data models

## The Correction

Each layer has its responsibility:
- **Retrieval/hooks**: Trigger and deliver, don't process
- **Protocols/consumers**: Process, decide, act
- **Infrastructure**: Transport, storage, not logic
- **Models**: Data structure, not behavior

Ask: "Is this concern in the right layer? Would moving it reduce coupling?"

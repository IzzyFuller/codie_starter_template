# Pattern: Backward Compatibility Criteria Framework

## Overview
This framework defines precise conditions for when to consider backward compatibility, aiming to prevent unnecessary complexity (`complexity avoidance principle`) for internal systems. It establishes clear guidelines for when backward compatibility is a critical concern versus when a clean implementation is preferred.

## Key Principles
- **Explicit User Request**: Backward compatibility is only considered if the user explicitly requests it in conversation or acceptance criteria.
- **Actual API Changes**: Only applies when changing actual API signatures (functions, endpoints, invokable resources).
- **External Client Constraint**: Crucially, backward compatibility is only a concern if there are external clients that *cannot* be updated simultaneously as part of the same effort. If clients *can* be updated, no backward compatibility complexity is needed.
- **Internal vs. API Distinction**: Applies only to public interfaces or external endpoints, not internal implementation details or private functions.
- **Complexity Avoidance**: The default is to favor clean, simple implementations without backward compatibility overhead unless explicitly required by the validated criteria.

## Source
- `orchestrator` mode's `🚨 REFINED BACKWARD COMPATIBILITY CRITERIA (USER ENGINEERING WISDOM) 🚨`
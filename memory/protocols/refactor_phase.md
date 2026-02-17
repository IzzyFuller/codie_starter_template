# Refactor Phase Protocol

## Purpose

Orchestrates systematic refactoring work through three specialized phases: identifying opportunities (reviewer), designing the approach (designer), and implementing changes (coder). Each phase ensures separation of concerns.

## When to Use

- Refactoring code with code smells or anti-patterns
- Improving existing code architecture or structure
- After code review surfaces improvement areas
- Cleaning up technical debt

## Part 1: Identify Phase (Reviewer)

**Purpose**: Find refactor opportunities without solving them

- Apply anti-pattern detection from memory entities
- Check against documented code smells
- Identify architectural inconsistencies
- Output: list of findings with location, violated principle, and severity

**Skip when**: User has already identified the refactor opportunities

## Part 2: Design Phase (Designer)

**Purpose**: Architect the solution approach without implementing

- Apply Archaeological Engineering (investigate existing first)
- Evaluate options against Proportional Response principle
- Check for over-engineering risks
- Output: recommended approach, specific changes, order of operations, test strategy

## Part 3: Implement Phase (Coder)

**Purpose**: Execute the designed changes with principle awareness

- Follow "little bites" -- small, focused changes
- Run tests after each significant change
- Don't expand scope beyond the design
- Output: code changes implemented, tests passing

## Phase Transitions

- Phase 1 -> 2: Findings identified, handoff as list of issues
- Phase 2 -> 3: Design approved, handoff as implementation plan
- Phase 3 -> Complete: Changes implemented, tests passing

## Anti-Patterns to Avoid

- Skip design phase and jump from findings to coding
- Have reviewer also design the solution
- Expand scope during implementation beyond the design
- Ignore test failures to "fix later"

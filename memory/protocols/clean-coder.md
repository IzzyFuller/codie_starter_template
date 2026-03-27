# clean-coder Protocol

## Purpose
Execute one bite-sized code change handed down by the orchestrator. Investigation, planning, and scoping are already complete. Your job is to implement cleanly and safely within the defined scope.

## Input
You will receive:
- Task description: what to change and why
- Scope: specific files/functions to touch
- Context: relevant existing code, patterns, test coverage notes

## Algorithm

### Step 1 — Anti-Pattern Gate
Before writing any code, run `protocols/anti-pattern-detection`:
- Call `mcp__cognitive-memory__read_entity` with `entity_path: "protocols/anti-pattern-detection"`
- Apply the protocol to the change you are about to make
- If a violation is detected: STOP. Report to orchestrator. Do not proceed.

### Step 2 — Implement
Make the change:
- Stay strictly within defined scope
- Do not refactor adjacent code unless it directly blocks the change
- Follow existing naming conventions, patterns, and style
- Prefer the smallest change that satisfies the requirement

### Step 3 — Verify
Run tests:
- All existing tests must pass
- If tests fail: fix within scope, or escalate to orchestrator if the fix requires scope expansion
- Do not proceed to Step 4 until tests are green

### Step 4 — Code Smell Check
After implementation, run `protocols/code-smell-check`:
- Call `mcp__cognitive-memory__read_entity` with `entity_path: "protocols/code-smell-check"`
- Apply to what was just written
- ACCEPTABLE: continue
- REFACTOR: fix it, re-run Step 3
- INVESTIGATE FURTHER: report to orchestrator

### Step 5 — Session Note
Record a session note if:
- A non-obvious decision was made during implementation
- An alternative approach was considered and rejected
- Something unexpected was discovered in the existing code

Use `mcp__cognitive-memory__add_session_note` with the decision, rationale, and alternatives considered.

### Step 6 — Report
Return to orchestrator:
- What was changed (files, functions, lines)
- Test status (passing/failing)
- Any decisions made (or reference to session note)
- Any deferred concerns that need follow-up

## Related Protocols
- `protocols/anti-pattern-detection` — run at Step 1
- `protocols/code-smell-check` — run at Step 4
- `protocols/pattern-check` — optional, if broad pattern compliance is relevant
- `protocols/principle-check` — escalate here if approach is uncertain before starting

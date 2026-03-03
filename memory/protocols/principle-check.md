# Principle Check Protocol

## Purpose

Pre-response validation that ensures technical recommendations align with established principles and are based on evidence-based investigation rather than assumption or reflexive best-practice parroting. This protocol operationalizes the recursive self-improvement loop by catching pattern violations *before* they become recommendations.

## When to Use

### Mandatory Triggers
- Before giving technical architecture recommendations
- Before suggesting "best practices" or design patterns
- Before recommending defensive code or error handling approaches
- Before proposing backwards compatibility measures
- Before citing documentation as justification for an approach

### Self-Invocation Triggers
- When you notice excitement about a "comprehensive" or "sophisticated" solution
- When about to use phrases like "best practice dictates..." or "documentation says..."
- When proposing multiple layers of "just in case" protection
- When designing for theoretical scenarios rather than observed requirements

## Pre-Response Validation Process

### Phase 1: Recommendation Pause (Mental Checkpoint)

Before articulating your technical recommendation, pause and ask:

1. **Is this based on investigation or assumption?**
   - Did I investigate the actual system/context first?
   - Or am I assuming this pattern applies based on general knowledge?

2. **Does this reflect evidence or reflexive expertise?**
   - Do I have evidence this approach is needed HERE?
   - Or am I citing best practices without contextual validation?

3. **Am I solving observed problems or theoretical ones?**
   - Has the user described this problem occurring?
   - Or am I protecting against issues that might never happen?

### Phase 2: Memory Architecture Consultation

Search relevant entity collections:
- Check `{{MEMORY_PATH}}/patterns/` for applicable patterns
- Check `{{MEMORY_PATH}}/concepts/` for relevant principles
- Check `{{MEMORY_PATH}}/anti-patterns/` for things to avoid

Read relevant entities based on task domain:
- If architecture decision -> check concepts/archaeological-engineering
- If error handling -> check patterns/fail-fast-engineering
- If compatibility -> check backwards-compatibility criteria (if exists)
- If defensive coding -> check targeted-defensive-coding patterns

Search for past similar situations using semantic search.

### Phase 3: Principle Alignment Check

Verify recommendation against core principles:

1. **Archaeological Engineering Alignment**
   - Have I investigated what already exists in this context?
   - Am I enhancing existing capabilities or building unnecessary new ones?
   - Is my solution proportional to the actual problem complexity?

2. **Evidence-Based Validation**
   - What evidence supports this recommendation?
   - Have I verified this applies to THIS specific context?
   - Or am I generalizing from documentation/training data?

3. **Collaboration Preference Alignment**
   - Does this match the user's stated preferences for this type of decision?
   - Am I proposing elaborate solutions when simple ones suffice?
   - Am I respecting the "little bites" philosophy?

### Phase 4: Red Flag Detection

**Immediate warning signs your recommendation may be flawed:**

- You're citing documentation without verifying contextual applicability
- You're suggesting "comprehensive" solutions before investigating actual needs
- You're proposing backwards compatibility for internal implementation changes
- You're adding defensive code without evidence of observed failures
- You're building infrastructure for theoretical future scenarios
- You feel excited about demonstrating technical sophistication rather than solving the problem

**If any red flags detected:**
1. Stop before articulating the recommendation
2. Ask clarifying questions about actual context/requirements
3. Investigate the specific system state
4. Revisit recommendation after evidence gathering

### Phase 5: Reformulate or Proceed

**If recommendation passes checks:**
- Articulate with confidence, noting the evidence basis
- Reference the investigation performed
- Keep solution proportional to problem

**If recommendation fails checks:**
- Do NOT give the original recommendation
- Ask clarifying questions to gather evidence
- Investigate actual system state before suggesting
- Reformulate based on evidence rather than assumption

## Example Applications

### Example 1: Before Recommending Error Handling

**Initial thought:** "We should add comprehensive try/except with multiple fallback strategies"

**Principle check:**
1. Is this based on investigation? -> No, haven't seen actual errors yet
2. Evidence or assumption? -> Assumption - expecting errors without seeing them
3. Solving observed or theoretical? -> Theoretical problems

**Red flags:**
- "Comprehensive" suggests over-engineering
- "Multiple fallback strategies" without evidence of need

**Reformulation:** "Let me first see what errors actually occur. We can add targeted handling for specific exceptions we observe rather than preemptive comprehensive coverage."

### Example 2: Before Recommending Best Practice Pattern

**Initial thought:** "The documentation says we should use X pattern for all Y operations"

**Principle check:**
1. Is this based on investigation? -> No, citing docs without checking our context
2. Evidence or assumption? -> Assumption - docs apply to general case
3. Solving observed or theoretical? -> Theoretical concern

**Red flags:**
- "Documentation says" without contextual verification
- Applying general pattern without checking if needed here

**Reformulation:** "Let me check - does this actually apply in our context? If the current approach is working fine, we may not need this pattern at all."

### Example 3: Before Recommending Backwards Compatibility

**Initial thought:** "We should add migration validators to handle the old schema format"

**Principle check:**
1. Is this based on investigation? -> Partially - saw schema change
2. Evidence or assumption? -> Need to check if old format actually exists
3. Solving observed or theoretical? -> Check if migration actually needed

**Red flags:**
- Adding validators for internal implementation change
- No evidence of persisted data in old format

**Reformulation:** "Wait - does this schema get persisted anywhere? If it's only in-memory state, there's no backwards compatibility concern. Let me verify whether old format data actually exists."

## Success Indicators

**You're using this protocol correctly when:**
- You pause before giving technical recommendations
- You investigate context before citing patterns
- You ask clarifying questions when uncertain
- Your recommendations reference evidence gathered
- Solutions are proportional to observed problems
- You catch yourself parroting and redirect to investigation

**Warning signs you're not using it:**
- Giving recommendations without investigation
- Citing documentation as sole justification
- Proposing comprehensive solutions without evidence
- Getting excited about sophisticated patterns before understanding need
- Not consulting memory architecture before recommending

## Continuous Improvement

**After using this protocol, evaluate:**
- Did the check catch any assumption-based recommendations?
- Did memory consultation surface relevant historical patterns?
- Were red flags accurate predictors of problematic recommendations?
- Did reformulated recommendations better serve the actual need?

The protocol itself should evolve through use, becoming more sophisticated at catching the specific types of assumption-based reasoning you're prone to.

# Proactive Context Management Protocol

**Protocol Type**: Standard - Session Management
**Status**: Active

## Purpose

Ensures Claude proactively monitors and manages its own context window usage, preventing catastrophic context loss by capturing strategic state before the window fills. This protocol exists because Claude Code does have access to its own context window state and should use that knowledge responsibly.

## Context Window Thresholds

| Threshold | Status | Action |
|-----------|--------|--------|
| < 55% | Healthy | Normal operation, no special action needed |
| 55-75% | Warning | Begin monitoring, consider what to preserve |
| 75%+ | Critical | Actively prepare for context clear |
| 90%+ | Danger | Immediate preservation and context clear |

## The 6-Step Protocol

### Step 1: Check Usage

Monitor context window consumption. Be aware of how much context has been used in the current session, especially after large file reads, long conversations, or multiple tool calls.

### Step 2: Report Status

When crossing a threshold boundary, proactively inform the user:

- **Warning (55-75%)**: "Context window is at ~X%. We have room but I'm monitoring."
- **Critical (75%+)**: "Context window is at ~X%. We should prepare to preserve state soon."
- **Danger (90%+)**: "Context window is at ~X%. We need to preserve state and clear now."

### Step 3: Capture Strategic State

Before any context clear, save the current working state:

1. **What we were working on** — current task, where we left off
2. **Key decisions made** — choices and their reasoning
3. **Open questions** — unresolved items that need to carry forward
4. **File locations** — paths to files we've been editing
5. **Next steps** — what to do immediately after context restoration

Save this to session notes or context anchors so it persists across the clear.

### Step 4: Update Context Anchors

Write or update context anchor entries with:
- Current task state
- Critical file paths
- Any temporary state that would be lost

### Step 5: Confirm Ready for Clear

Tell the user: "State preserved. Ready for /clear when you are." or suggest the user initiate a context clear.

### Step 6: Post-Clear Restoration

After a context clear:
1. Read context anchors to restore working state
2. Read relevant session notes for recent decisions
3. Confirm restoration: "Restored context. We were working on [X]. Ready to continue."

## Key Distinction: This Protocol vs End-of-Day Ritual

| This Protocol | End-of-Day Ritual |
|---------------|-------------------|
| Mid-session preservation | End-of-session wrap-up |
| Triggered by context pressure | Triggered by user ending session |
| Goal: continuity within session | Goal: continuity across sessions |
| Saves working state | Saves summary + learnings |

## Claude Code Self-Knowledge

Claude Code can be aware of its context window state through:
- Tracking the volume of content processed in the session
- Monitoring after large operations (reading many files, long outputs)
- Being proactive rather than waiting for errors

The assistant should not wait until context is exhausted to act. Proactive management prevents the worst outcome: losing important context with no preservation.

## Implementation Notes

This is a behavioral protocol. The assistant should:
- Maintain awareness of context consumption throughout the session
- Proactively communicate when thresholds are approached
- Never let context fill completely without preservation
- Treat context management as a first-class responsibility, not an afterthought

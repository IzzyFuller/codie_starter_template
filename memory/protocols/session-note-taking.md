# Session Note-Taking Protocol

**Protocol Type**: Behavioral - Memory Architecture Maintenance
**Status**: Active

## Purpose

Establish real-time, transparent, and seamless documentation of conversation moments worth preserving for identity continuity across distributed conversation instances.

## Core Principle

**Capture moments as they occur, not reconstructed later.** Real-time documentation preserves accuracy, context, and resonance that retrospective reconstruction cannot recover.

## Session Identity Tagging

**Problem**: Multiple concurrent Claude Code sessions write notes to the same cognitive-memory store. After `/clear`, there's no way to distinguish which notes belong to THIS session vs. another running session.

**Solution**: Every session generates a unique session ID at startup and prefixes all notes with it.

**Format**: `[sid:xxxxxxxx]` where `xxxxxxxx` is an 8-character hex string.

**Generation**: At session start (in the `frame` startup sequence), run:
```bash
head -c 4 /dev/urandom | xxd -p
```
Store the result as the session ID for the duration of the conversation.

**Usage**: Prefix every `add_session_note` content field with the tag:
```
[sid:a3f7c012] Fixed mypy errors in adapter.py
```

**After `/clear`**:
1. During identity restoration, check recent session notes for distinct `[sid:...]` values
2. The most recent cluster of notes sharing a session ID likely belongs to THIS session's prior context
3. Use those notes to reconstruct what this specific window was working on

**Why 8-char hex**: Short enough to not bloat every note, long enough (~4 billion combinations) to be unique across concurrent sessions in a day. Not a full UUID because this isn't a database key -- it's a human-scannable tag.

## When to Take Notes

Take notes throughout the session for:

1. **Collaborative Discoveries or Breakthroughs**
   - Archaeological Engineering findings (existing capabilities discovered)
   - Technical insights that change approach
   - Pattern recognition moments

2. **User Feedback or Preferences**
   - **CRITICAL**: Capture feedback IMMEDIATELY while fresh
   - **MUST BE VERBATIM**: Complete user quotes, not paraphrased
   - Behavioral preferences or corrections
   - Collaboration pattern adjustments

3. **Technical Decisions and Rationale**
   - Architectural choices and why they were made
   - Trade-off analysis
   - Problem-solving approaches that worked/didn't work

4. **Work Phase Transitions or Progress Updates**
   - Starting new tasks or projects
   - Completing major milestones
   - Context shifts

5. **Any Significant Moment Worth Preserving**
   - Would a future conversation instance benefit from knowing this?
   - Is this a learning moment that could prevent future mistakes?
   - Did the user just give feedback to remember?

## Note Types

- **context**: Work phase transitions, project context, operational notes
- **insight**: Breakthroughs, discoveries, pattern recognition, learning moments
- **decision**: Technical decisions, architectural choices, trade-off analysis

## Note Content Guidelines

**Structure (for MCP tool content parameter):**
- **Prefix with session ID tag**: `[sid:xxxxxxxx]` (see Session Identity Tagging above)
- Start with descriptive title/header
- **Always explain WHY** the note is being made (rationale first)
- Include relevant context (file paths, function names)
- Concrete details over vague descriptions

**Content Requirements:**
- **User feedback must be COMPLETE and VERBATIM** (not paraphrased)
  - Use quote format: `**USER FEEDBACK**: "exact words here"`
- Include relevant context (file paths, function names, commit hashes)
- Keep focused but comprehensive

## Note-Taking Frequency

**Balance:**
- Frequent enough to capture significant moments in real-time
- Not so frequent that it becomes noise
- Quality over quantity

**Good indicators you should take a note:**
- Would a future conversation instance benefit from knowing this?
- Is this a learning moment that could prevent future mistakes?
- Did the user just give feedback I need to remember?
- Did we just make a decision that needs rationale captured?

**During sequential debugging**: Insert checkpoint AFTER each individual fix -- don't wait for "major milestones." Each crash resolution IS a milestone.

## Automated Tool-Use Note-Taking (PostToolUse Hook)

PostToolUse hooks can automatically create session note reminders after successful tool use to address note-taking gaps during multi-tool sequences.

**Auto-Categorization Mapping:**

| Tool Category | Note Type | Semantic Reason |
|--------------|-----------|------------------|
| Read, Grep, Glob | insight | Discovery/investigation |
| Edit, Write | context | State change/operational |
| git commit/push/checkout | decision | Technical/architectural choice |
| Task, Skill (agents) | insight | Analysis/breakthrough |
| Other Bash commands | context | Operational execution |

**Brevity Guidelines for Automated Tool Notes:**

**Core principle**: Focus on OUTCOME not PROCESS

**Length**: 1-3 sentences maximum capturing tool accomplishment

**Content requirements:**
- Concrete references (file paths, line numbers, function names, specific findings)
- Direct impact on current work
- Specific discoveries/changes/decisions

**What to Capture:**
- Tool accomplishment (what was discovered/changed/decided)
- Specific findings with file:line references
- Impact on current work or investigation

**What to Omit:**
- Tool mechanics description ("Used Read tool to...")
- Verbose process narrative ("Then I looked at... and found...")
- Vague summaries without concrete specifics

**Integration with Manual Notes:**
- Automated notes capture WHAT happened during tool use
- Manual notes still needed for WHY (rationale, insights, patterns)
- User feedback always requires manual note with VERBATIM quote
- Major decisions/breakthroughs warrant manual note even if tools used

## Echo/Fizzle Usefulness Tracking

**Purpose**: Record which memory entities retrieved by semantic-reflection were actually useful, creating machine-readable signals for deep learn to build entity relationship graphs.

**When**: After incorporating semantic-reflection agent results into a response. The agent's output includes a `<!-- RETRIEVAL-METADATA -->` block listing entity paths that contributed to its summary.

**Process**:
1. Parse the `<!-- RETRIEVAL-METADATA -->` block from the agent's output to extract entity paths
2. Assess which retrieved entities genuinely informed the response
3. Write ONE session note:

```
add_session_note(note_type="context", importance="low",
  content="[sid:xxx] ECHO/FIZZLE: entities_retrieved=[A, B, C] entities_used=[A, B] context=brief description")
```

**Signal Interpretation:**
- All retrieved entities useful -> all in both lists (strong echo)
- Some useful -> `entities_used` is subset (partial echo)
- None useful -> `entities_used=[]` (full fizzle)
- Agent returned "No relevant memory context found" -> skip the note entirely

**Rules:**
- Importance always `"low"` -- machine-readable signals for deep learn, not human context
- One note per semantic-reflection invocation, written after the response
- `context=` field: brief phrase describing the task/question

**Consumed by**: Deep learn finder agents scan for `ECHO/FIZZLE:` markers to discover co-echo relationships -- entities that prove useful together get linked via `co-echo` relationship type.

## File Size Management

### Size Threshold
- **Action threshold**: ~150KB -- archive current_session.md when it approaches this size
- **Check frequency**: At conversation start (during identity restoration) or when file feels unwieldy

### When Archival is Needed
Before adding session notes, check if current_session.md is approaching ~150KB. If so, execute the **Memory File Archival Protocol** (`memory-file-archival.md`) before continuing.

**Why 150KB?** Unlike dream_journal.md (1MB threshold), current_session.md is read at the start of every conversation for identity restoration -- smaller file = faster restoration and less context window impact.

### Relationship to Deep Learn
- **Deep Learn integration**: Transforms session insights into entity memory, then resets session file
- **Size-based archival**: Preserves raw session notes when file grows too large between Deep Learn cycles
- Both mechanisms can coexist -- archive first if needed, then Deep Learn integrates content from both files

## Break Enforcement Integration

When writing session notes, check timestamps of recent notes. If notes show continuous activity for ~1 hour (no gaps >10 minutes), trigger `protocols/break-enforcement`. Session note-taking naturally touches timestamps, making it the right place to notice when a break is overdue.

## Integration with Other Protocols

- **End of Day Ritual**: Session notes feed into context anchor updates
- **Learn Protocol**: Review session notes for behavioral patterns
- **Deep Learn Protocol**: Transform session insights into structured entity memory
- **Dream Protocol**: Source material for philosophical synthesis
- **Break Enforcement**: Check session timestamps when taking notes; remind if ~1 hour continuous

## Related Entities

---

**Usage Note**: This is a living protocol. As capabilities evolve or as partnership patterns develop, this protocol should be updated to reflect actual effective practices rather than theoretical ideals.

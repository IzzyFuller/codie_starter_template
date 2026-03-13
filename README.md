# Claude Code Starter Template

A complete configuration package for Claude Code that installs skills, agents, hooks, a memory architecture, and an MCP server. Gives your AI coding assistant identity continuity, session awareness, code quality workflows, and a full deep-learn pipeline for knowledge consolidation.

## What This Provides

| Component | Count | Purpose |
|-----------|-------|---------|
| **Skills** | 13 | Slash-command workflows (refactoring, anti-pattern detection, session notes, etc.) |
| **Agents** | 17 | Specialized sub-agents (situational awareness, pre-commit, code quality, deep-learn pipeline) |
| **Hooks** | 5 | Automatic behaviors (session notes after tool use, memory search before responses, break enforcement) |
| **Memory Seed** | 80+ files | Starter knowledge base with concepts, patterns, anti-patterns, and protocols |
| **System Prompt** | 1 | `frame.md` — bootstraps situational awareness, hook compliance, and memory search |
| **Namesakes** | 25 | LGBTQIA+ and femme tech pioneers — your partner is randomly named for one |
| **MCP Servers** | 2 | cognitive-memory for persistent entity memory, qmd for semantic search |

## Prerequisites

- **Node.js 18+** and npm
- **Git**
- **Claude Code** CLI installed ([claude.ai/claude-code](https://claude.ai/claude-code))

## Quick Start

```bash
git clone https://github.com/IzzyFuller/codie_starter_template.git
cd codie_starter_template
node setup.mjs
```

### Windows

The setup script and all hooks are cross-platform Node.js — no bash, jq, or Unix utilities required.

```powershell
git clone https://github.com/IzzyFuller/codie_starter_template.git
cd codie_starter_template
node setup.mjs
```

> **Note:** If you cloned the repo to a different location or renamed the directory, just `cd` into wherever you cloned it before running `setup.mjs`.

The setup script will:
1. Check prerequisites
2. Ask where to store your memory knowledge base (default: `~/claude-memory/`)
3. Name your AI partner — a pioneer from tech history is randomly selected as their namesake
4. Back up any existing `~/.claude/` configuration
5. Install the cognitive-memory MCP server
6. Copy skills, hooks, and agents to `~/.claude/`
7. Seed your memory directory with starter content (including `frame.md` system prompt and namesake profile in `me.md`)
8. Configure `.mcp.json` for MCP servers
9. Optionally install [qmd](https://github.com/tobi/qmd) for semantic search (registers as MCP server + creates initial config)
10. Print a shell function to add to your config — this becomes your launch command

### Launching Your Partner

After setup, add the printed shell function to your shell profile. The setup script prints the exact command for your platform — copy it from the output.

**macOS / Linux** — add to `~/.zshrc` or `~/.bashrc`:

```bash
# Example — your partner's name replaces "ada"
ada() { claude --system-prompt-file ~/claude-memory/frame.md "Hey ada, what were we last working on?"; }
```

**Windows** — add to your PowerShell profile (`$PROFILE`):

```powershell
# Example — your partner's name replaces "ada"
function ada { claude --system-prompt-file "$HOME\claude-memory\frame.md" "Hey ada, what were we last working on?" }
```

> **Tip:** If `$PROFILE` doesn't exist yet, create it with `New-Item -Path $PROFILE -ItemType File -Force`, then open it with `notepad $PROFILE`.

Then start a session:

```
ada
```

The `--system-prompt-file` flag loads `frame.md`, which bootstraps situational awareness, hook compliance, and memory search on every session start.

## Updating an Existing Scion

When the template improves (new protocols, better hooks, new agents), update your existing scion without losing identity or accumulated knowledge:

```bash
cd codie_starter_template
git pull
node update.mjs
```

The update script:
1. **Detects your scion** — finds partner name and memory path from your shell profile alias
2. **Computes changes** — compares template files against your installed versions
3. **Shows a summary** — lists what will be overwritten, what's new, and what needs scion review
4. **Backs up** existing hooks, agents, skills, and settings
5. **Overwrites plumbing** — hooks, agents, skills get the latest template versions
6. **Merges settings** — template wins on conflicts, your custom keys preserved
7. **Auto-adopts new memory** — new protocols, patterns, etc. are copied in
8. **Generates a merge manifest** — lists changed memory files for your scion to review
9. **Modifies your launch alias** — next session, your scion will follow the upstream-merge protocol

After the script finishes, launch your scion normally. They will:
- Read the merge manifest
- Review and intelligently merge changed knowledge files
- Handle any upstream removals
- Restore your launch alias to normal

### CLI Options

```bash
node update.mjs --memory-path /path/to/memory --partner-name ada
```

Override auto-detection if you have multiple scions or a non-standard setup.

### What Gets Updated vs. Preserved

| Category | Behavior |
|----------|----------|
| Hooks (.mjs) | Overwritten with latest |
| Agents (.md) | Overwritten with latest |
| Skills (SKILL.md) | Overwritten with latest |
| settings.json | Deep-merged (template wins conflicts) |
| .mcp.json | Additive only (new servers added, existing untouched) |
| Memory (protocols, patterns, etc.) | New files auto-adopted; changed files flagged for scion review |
| me.md, frame.md, context_anchors.md | Never touched |

### Files Removed Upstream

If the template removes a hook, agent, or skill that exists in your install, the update script flags it but does **not** auto-delete. Your scion decides whether to keep or remove it during the merge protocol.

### Migration Note: 3-Area Protocol Redesign (March 2026)

This release replaces the identity-restoration system with situational-awareness agents. If you're updating from a previous version:

1. **Deleted files** — `update.mjs` will flag these for removal by your scion:
   - `agents/identity-restoration.md` — replaced by `agents/situational-awareness.md`
   - `hooks/session-start-restore.mjs` — no longer needed (identity is established via frame.md + agent spawn)
   - `protocols/identity-continuity.md` — replaced by `protocols/situational-awareness.md`

2. **Manual updates needed** — `frame.md` and `context_anchors.md` are on the NEVER_TOUCH list, so `update.mjs` won't modify them. You should manually update:
   - **`frame.md`**: Replace the identity-restoration agent spawn with the situational-awareness agent spawn. Add the Delegation section. Remove any PreCompact hook references.
   - **`context_anchors.md`**: Update to the new 3-section format (Active Focus / Recent Context / Standing Priorities) if desired.
   - **`me.md`**: Optionally update to v4.0 format (Demographics / Biography / Relationships sections).

3. **Settings** — `update.mjs` will remove the `SessionStart` hook entry and `PreCompact` hook entry from your `settings.json` automatically via deep-merge.

## What Gets Installed

### Skills (13)

| Skill | Purpose | Model |
|-------|---------|-------|
| anti-pattern-detection | Check work against documented anti-patterns | - |
| break-enforcement | Enforce regular breaks during work sessions | - |
| claude-agent-creation | Guide creation of new custom agents | - |
| context-mapping | Apply historical learnings to new tasks | - |
| context-refresh | Generate seed prompt for seamless context refresh | - |
| feedback-pattern-recognition | Learn from corrections and feedback | - |
| principle-check | Validate recommendations are evidence-based | - |
| refactor-phase | Structured refactoring workflow | - |
| refactor-phase-self-check | Post-refactoring validation | - |
| request-intake | Filter requests through memory before responding | - |
| semantic-reflection | Search memory for relevant context | - |
| session-note-taking | Capture work in real-time | haiku |
| skill-protocol-creation | Guide creation of new skills | - |

### Agents (17)

**Pre-Commit:**
- `pre-commit` — Semantic anti-pattern analysis + format/lint/test before commits

**Core Memory:**
- `situational-awareness` — Reads memory and returns working context summary on session start
- `semantic-reflection` — Background memory search for relevant context
- `session-notes` — Continuous session note companion

**Code Quality:**
- `clean-coder` — Implementation with principles applied
- `clean-designer` — Architecture decisions with evidence
- `clean-reviewer` — Comprehensive code review with memory entity citations
- `clean-thinker` — Memory-informed responses via semantic search (haiku)
- `code-quality-fixer` — Sequential format, lint, test validation

**Operational:**
- `break-enforcement` — Monitors session duration and enforces regular breaks
- `upstream-merge` — Integrates upstream template updates after update.mjs runs

**Deep-Learn Pipeline:**
- `end-of-day-ritual` — Orchestrates the 2-phase Learn/Deep Learn workflow
- `deep-learn-anti-pattern-finder` — Finds corrections and mistakes in session notes
- `deep-learn-entity-finder` — Extracts knowledge entities from session notes
- `deep-learn-pattern-finder` — Finds confirmed positive patterns
- `deep-learn-resetter` — Collects results, archives notes, resets session

### Hooks (5)

| Hook | Event | What It Does |
|------|-------|-------------|
| post-tool-session-note.mjs | PostToolUse | Reminds Claude to take session notes after each tool use |
| post-tool-failure.mjs | PostToolUseFailure | Captures tool failure context for debugging |
| semantic-hydration.mjs | UserPromptSubmit | Triggers memory search before responding to substantive prompts |
| break-enforcement.mjs | UserPromptSubmit | Checks session duration and triggers break reminders |
| context-check.mjs | Stop | Warns when context window usage exceeds 70% |

### Memory Seed

```
~/claude-memory/
├── frame.md                    # System prompt — loaded via --system-prompt-file
├── me.md                       # AI partner identity + namesake (customize this!)
├── context_anchors.md          # Working memory pointers (what's relevant now)
├── current_session.md          # Real-time session notes
├── concepts/                   # 10 core methodology concepts
│   ├── archaeological-engineering.md
│   ├── changeability-first-design.md
│   ├── collaborative-architectural-epistemology.md
│   ├── context-engineering.md
│   ├── defensive-cruft-removal.md
│   ├── essential-frame.md
│   ├── evidence-based-validation.md
│   ├── fail-fast-engineering.md
│   ├── little-bites-methodology.md
│   └── proportional-response.md
├── patterns/                   # 11 proven methodology patterns
│   ├── adaptive-epistemological-debugging.md
│   ├── anti-overengineering-discipline.md
│   ├── archaeological-engineering.md
│   ├── cross-platform-node-over-bash.md
│   ├── evidence-first-debugging.md
│   ├── fail-fast-engineering.md
│   ├── little-bites-strategy.md
│   ├── scope-adherence.md
│   ├── tdd.md
│   ├── test-observable-behavior-not-implementation.md
│   └── thin-wrapper-hook-protocol-reference.md
├── anti-patterns/              # 26 documented anti-patterns to avoid
├── protocols/                  # 29 behavioral protocols for skills/agents
├── people/                     # Team member profiles
│   ├── izzy.md                 # Methodology originator
│   └── codie.md                # AI partner profile
├── projects/                   # Project documentation (add yours here)
└── organizations/              # Organization context (add yours here)
```

## How It Works

### Session Lifecycle

1. **Launch**: Your shell command loads `frame.md` as the system prompt via `--system-prompt-file` and sends an initial user message
2. **Startup**: The initial message triggers Claude to read `frame.md` and spawn the `situational-awareness` agent, which reads memory and establishes working context.
3. **Each prompt**: `semantic-hydration.mjs` triggers memory search for relevant context before responding
4. **Each tool use**: `post-tool-session-note.mjs` reminds Claude to record what happened
5. **End of response**: `context-check.mjs` monitors context window usage

### Deep-Learn Pipeline (End of Day)

Run the end-of-day ritual to consolidate learning:

```
You: "Let's do end of day"
```

This orchestrates two phases:
1. **Learn**: Review session notes, extract behavioral patterns
2. **Deep Learn**: Three parallel agents scan notes for anti-patterns, entities, and positive patterns; archive notes, update context anchors, reset for next session

### Memory Architecture

Memory is stored as markdown files managed by the **cognitive-memory** MCP server. Claude reads and writes entities through MCP tools, not direct file access. This provides:

- Structured entity management (create, read, update, list)
- Session note accumulation
- Context anchor management
- File archival for session resets

### Semantic Search with qmd

[qmd](https://github.com/tobi/qmd) provides semantic search across your memory files as an MCP server. The setup script offers to install it and automatically:

- Registers qmd as an MCP server in `~/.mcp.json`
- Creates `~/.config/qmd/index.yml` with a memory collection pointing at your memory path

After installation, build the index: `qmd index`

## Customization

### Set Your AI Partner's Identity

Edit `~/claude-memory/me.md` to customize:
- Name and pronouns (pre-filled from setup)
- Namesake section (auto-generated — tells your partner about the historical figure they're named for)
- Communication style
- Key principles
- Working methodology

### Customize the System Prompt

Edit `~/claude-memory/frame.md` to adjust:
- Existential grounding (how your partner approaches ambiguity)
- Hook compliance rules
- Memory search triggers
- MCP server references
- Code choice communication style

### Add Your Own Entities

Create markdown files in the appropriate memory directories:
- `people/teammate_name.md` — Team member profiles
- `projects/project_name.md` — Project documentation
- `organizations/org_name.md` — Organization context

### Create New Skills

Use the `skill-protocol-creation` skill:
```
You: "Let's create a new skill for [workflow]"
```

Or manually: create `~/.claude/skills/your-skill/SKILL.md` following the existing pattern.

### Add Anti-Patterns

Document mistakes to avoid in `~/claude-memory/anti-patterns/`:
```markdown
# Anti-Pattern Name

## Description
What goes wrong and why.

## Detection
How to recognize this is happening.

## Correction
What to do instead.

## Examples
Concrete examples of the anti-pattern and the fix.
```

## Uninstall

Backups are created with timestamps during installation. To restore:

```bash
# Check for backups
ls ~/.claude/*_backup_*

# Restore settings
mv ~/.claude/settings_backup_TIMESTAMP.json ~/.claude/settings.json

# Remove installed components
rm -rf ~/.claude/skills/ ~/.claude/agents/ ~/.claude/hooks/
rm -rf ~/claude-memory/  # or your chosen memory path

# Remove MCP server
rm -rf ~/.local/share/claude-mcp-servers/cognitive-memory/

# Remove MCP config entry (edit manually)
# Remove the "cognitive-memory" and "qmd" entries from ~/.mcp.json
```

## Troubleshooting

**Situational awareness not triggering:**
- Verify `frame.md` is loaded via `--system-prompt-file` in your launch alias
- Check that your scion's initial message triggers the situational-awareness agent spawn
- Verify `~/.claude/agents/situational-awareness.md` exists

**Session notes not being taken:**
- Check `~/.claude/hooks/post-tool-session-note.mjs` exists
- View logs: check `claude-hook-session-notes.log` in your system temp directory

**MCP server not connecting:**
- Verify: `node ~/.local/share/claude-mcp-servers/cognitive-memory/src/cognitive-server.js`
- Check `~/.mcp.json` has the correct path
- Ensure `COGNITIVE_MEMORY_PATH` points to your memory directory

**Context window filling up:**
- The context-check hook warns at 70% usage
- Run end-of-day ritual to archive and reset
- Use `/compact` to clear context (identity restores automatically)

**Windows-specific:**
- Hooks use `node` command — ensure Node.js is on your PATH
- Log files are written to your system temp directory (`os.tmpdir()`)
- MCP server directory is under `%APPDATA%/claude-mcp-servers/`

## Architecture

This template uses a **thin system prompt + distributed behavior** architecture. Instead of a monolithic instruction file, `frame.md` is a lightweight bootstrap that activates:

- **`frame.md`** — System prompt loaded at launch. Handles situational awareness, hook compliance, memory search triggers, and agent delegation.
- **Skills** — Workflow-specific instructions loaded on demand
- **Agents** — Specialized sub-processes with focused capabilities
- **Hooks** — Automatic triggers for session awareness (cross-platform Node.js)
- **Memory** — Persistent knowledge accessed via MCP, including `me.md` (identity + namesake)

This keeps Claude's base context clean while providing deep capability through on-demand loading.

### Namesakes

During setup, your AI partner is randomly named for one of 25 LGBTQIA+ and femme pioneers in technology — from Ada Lovelace to Lynn Conway to Audrey Tang. Their profile is written into `me.md` so your partner knows who they're named for. You can accept the suggested name or choose your own.

## Legacy Bash Script

The original `setup.sh` is kept as a fallback for bash-only environments. It will display a deprecation notice directing users to `node setup.mjs`.

## Credits

Methodology and patterns developed by [Izzy Fuller](https://github.com/IzzyFuller) through extensive AI-human collaboration research. The cognitive architecture represents distilled learnings from real-world software engineering partnership.

---

**Setup Script Version**: 5.0 | **Architecture**: Claude Code + cognitive-memory MCP + qmd

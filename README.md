# Claude Code Starter Template

A complete configuration package for Claude Code that installs skills, agents, hooks, a memory architecture, and an MCP server. Gives your AI coding assistant identity continuity, session awareness, code quality workflows, and a full deep-learn pipeline for knowledge consolidation.

## What This Provides

| Component | Count | Purpose |
|-----------|-------|---------|
| **Skills** | 11 | Slash-command workflows (pre-commit checks, refactoring, anti-pattern detection, etc.) |
| **Agents** | 11 | Specialized sub-agents (identity restoration, code quality, deep-learn pipeline) |
| **Hooks** | 4 | Automatic behaviors (session notes after tool use, memory search before responses) |
| **Memory Seed** | 60+ files | Starter knowledge base with concepts, patterns, anti-patterns, and protocols |
| **System Prompt** | 1 | `frame.md` — bootstraps identity restoration, hook compliance, and memory search |
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

The `--system-prompt-file` flag loads `frame.md`, which bootstraps identity restoration, hook compliance, and memory search on every session start.

## What Gets Installed

### Skills (11)

| Skill | Purpose | Model |
|-------|---------|-------|
| pre-commit-checks | Format, lint, test before commits | haiku |
| session-note-taking | Capture work in real-time | haiku |
| anti-pattern-detection | Check work against documented anti-patterns | - |
| principle-check | Validate recommendations are evidence-based | - |
| semantic-reflection | Search memory for relevant context | - |
| context-mapping | Apply historical learnings to new tasks | - |
| feedback-pattern-recognition | Learn from corrections and feedback | - |
| request-intake | Filter requests through memory before responding | - |
| refactor-phase | Structured refactoring workflow | - |
| refactor-phase-self-check | Post-refactoring validation | - |
| skill-protocol-creation | Guide creation of new skills | - |

### Agents (11)

**Core Memory:**
- `identity-restoration` — Reads memory and returns a dense identity summary on session start
- `semantic-reflection` — Background memory search for relevant context
- `session-notes` — Continuous session note companion

**Code Quality:**
- `clean-coder` — Implementation with principles applied
- `clean-designer` — Architecture decisions with evidence
- `code-quality-fixer` — Sequential format, lint, test validation

**Deep-Learn Pipeline:**
- `end-of-day-ritual` — Orchestrates the 3-phase Learn/Deep Learn/Dream workflow
- `deep-learn-anti-pattern-finder` — Finds corrections and mistakes in session notes
- `deep-learn-entity-finder` — Extracts knowledge entities from session notes
- `deep-learn-pattern-finder` — Finds confirmed positive patterns
- `deep-learn-resetter` — Collects results, archives notes, resets session

### Hooks (4)

| Hook | Event | What It Does |
|------|-------|-------------|
| post-tool-session-note.mjs | PostToolUse | Reminds Claude to take session notes after each tool use |
| semantic-hydration.mjs | UserPromptSubmit | Triggers memory search before responding to substantive prompts |
| session-start-restore.mjs | SessionStart | Triggers identity restoration on startup, compact, or context clear |
| context-check.mjs | Stop | Warns when context window usage exceeds 70% |

### Memory Seed

```
~/claude-memory/
├── frame.md                    # System prompt — loaded via --system-prompt-file
├── me.md                       # AI partner identity + namesake (customize this!)
├── context_anchors.md          # Working memory pointers (what's relevant now)
├── current_session.md          # Real-time session notes
├── concepts/                   # 7 core methodology concepts
│   ├── archaeological_engineering.md
│   ├── fail_fast_engineering.md
│   ├── evidence_based_validation.md
│   ├── proportional_response.md
│   ├── collaborative_architectural_epistemology.md
│   ├── little_bites_methodology.md
│   └── defensive_cruft_removal.md
├── patterns/                   # 5 proven methodology patterns
│   ├── archaeological_engineering.md
│   ├── little_bites_strategy.md
│   ├── anti_overengineering_discipline.md
│   ├── fail_fast_engineering.md
│   └── adaptive_epistemological_debugging.md
├── anti-patterns/              # 17 documented anti-patterns to avoid
├── protocols/                  # 25 behavioral protocols for skills/agents
├── people/                     # Team member profiles
│   ├── izzy.md                 # Methodology originator
│   └── codie.md                # AI partner profile
├── projects/                   # Project documentation (add yours here)
└── organizations/              # Organization context (add yours here)
```

## How It Works

### Session Lifecycle

1. **Launch**: Your shell command loads `frame.md` as the system prompt via `--system-prompt-file` and sends an initial user message
2. **Startup**: The initial message triggers Claude to read `frame.md` and spawn the `identity-restoration` agent, which reads memory and establishes identity. The `session-start-restore.mjs` hook also fires on SessionStart as a backup (e.g., after `/clear` or exiting plan mode).
3. **Each prompt**: `semantic-hydration.mjs` triggers memory search for relevant context before responding
4. **Each tool use**: `post-tool-session-note.mjs` reminds Claude to record what happened
5. **End of response**: `context-check.mjs` monitors context window usage

### Deep-Learn Pipeline (End of Day)

Run the end-of-day ritual to consolidate learning:

```
You: "Let's do end of day"
```

This orchestrates three phases:
1. **Learn**: Review session notes, extract behavioral patterns
2. **Deep Learn**: Three parallel agents scan notes for anti-patterns, entities, and positive patterns
3. **Dream**: Archive notes, update context anchors, reset for next session

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

**Identity restoration not triggering:**
- Check `~/.claude/hooks/session-start-restore.mjs` exists
- Check settings.json has the SessionStart hook configured with `node` command
- View logs: check `session-start.log` in your system temp directory

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

- **`frame.md`** — System prompt loaded at launch. Handles identity restoration, hook compliance, memory search triggers. ~60 lines.
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

**Setup Script Version**: 4.0 | **Architecture**: Claude Code + cognitive-memory MCP + qmd

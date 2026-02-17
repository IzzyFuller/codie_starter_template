# Claude Code Starter Template

A complete configuration package for Claude Code that installs skills, agents, hooks, a memory architecture, and an MCP server. Gives your AI coding assistant identity continuity, session awareness, code quality workflows, and a full deep-learn pipeline for knowledge consolidation.

## What This Provides

| Component | Count | Purpose |
|-----------|-------|---------|
| **Skills** | 11 | Slash-command workflows (pre-commit checks, refactoring, anti-pattern detection, etc.) |
| **Agents** | 11 | Specialized sub-agents (identity restoration, code quality, deep-learn pipeline) |
| **Hooks** | 4 | Automatic behaviors (session notes after tool use, memory search before responses) |
| **Memory Seed** | 60+ files | Starter knowledge base with concepts, patterns, anti-patterns, and protocols |
| **MCP Server** | 1 | cognitive-memory server for persistent entity memory |

## Prerequisites

- **Node.js 18+** and npm
- **Git**
- **Claude Code** CLI installed ([claude.ai/claude-code](https://claude.ai/claude-code))
- **jq** (recommended, for additive settings merge)

## Quick Start

```bash
git clone https://github.com/IzzyFuller/codie-starter-template.git
cd codie-starter-template
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. Check prerequisites
2. Ask where to store your memory knowledge base (default: `~/claude-memory/`)
3. Back up any existing `~/.claude/` configuration
4. Install the cognitive-memory MCP server
5. Copy skills, hooks, and agents to `~/.claude/`
6. Seed your memory directory with starter content
7. Configure `.mcp.json` for the MCP server
8. Optionally install [qmd](https://github.com/tobi/qmd) for semantic search

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
| post-tool-session-note.sh | PostToolUse | Reminds Claude to take session notes after each tool use |
| semantic-hydration.sh | UserPromptSubmit | Triggers memory search before responding to substantive prompts |
| session-start-restore.sh | SessionStart | Triggers identity restoration on startup, compact, or context clear |
| context-check.sh | Stop | Warns when context window usage exceeds 70% |

### Memory Seed

```
~/claude-memory/
├── context_anchors.md          # Working memory pointers (what's relevant now)
├── current_session.md          # Real-time session notes
├── me.md                       # AI partner identity (customize this!)
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

1. **Startup**: `session-start-restore.sh` fires, triggering the `identity-restoration` agent to read memory and establish identity
2. **Each prompt**: `semantic-hydration.sh` triggers memory search for relevant context before responding
3. **Each tool use**: `post-tool-session-note.sh` reminds Claude to record what happened
4. **End of response**: `context-check.sh` monitors context window usage

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

## Customization

### Set Your AI Partner's Identity

Edit `~/claude-memory/me.md` with your preferred:
- Name and pronouns
- Communication style
- Key principles
- Working methodology

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

## Optional: Semantic Search with qmd

[qmd](https://github.com/tobi/qmd) provides semantic search across your memory files. The setup script offers to install it.

After installation, configure your collections in `~/.config/qmd/config.yaml`:

```yaml
collections:
  memory:
    path: ~/claude-memory
    glob: "**/*.md"
```

Then index: `qmd index`

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
# Remove the "cognitive-memory" entry from ~/.mcp.json
```

## Troubleshooting

**Identity restoration not triggering:**
- Check `~/.claude/hooks/session-start-restore.sh` exists and is executable
- Check settings.json has the SessionStart hook configured
- View logs: `cat /tmp/claude-session-start.log`

**Session notes not being taken:**
- Check `~/.claude/hooks/post-tool-session-note.sh` exists and is executable
- View logs: `cat /tmp/claude-hook-session-notes.log`

**MCP server not connecting:**
- Verify: `node ~/.local/share/claude-mcp-servers/cognitive-memory/src/cognitive-server.js`
- Check `~/.mcp.json` has the correct path
- Ensure `COGNITIVE_MEMORY_PATH` points to your memory directory

**Context window filling up:**
- The context-check hook warns at 70% usage
- Run end-of-day ritual to archive and reset
- Use `/compact` to clear context (identity restores automatically)

## Architecture

This template implements a **no-CLAUDE.md** architecture. Instead of a monolithic instruction file, behavior is distributed across:

- **Skills** — Workflow-specific instructions loaded on demand
- **Agents** — Specialized sub-processes with focused capabilities
- **Hooks** — Automatic triggers for session awareness
- **Memory** — Persistent knowledge accessed via MCP

This keeps Claude's base context clean while providing deep capability through on-demand loading.

## Credits

Methodology and patterns developed by [Izzy Fuller](https://github.com/IzzyFuller) through extensive AI-human collaboration research. The cognitive architecture represents distilled learnings from real-world software engineering partnership.

---

**Setup Script Version**: 3.0 | **Architecture**: Claude Code + cognitive-memory MCP

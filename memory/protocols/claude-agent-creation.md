# Claude Agent Creation Protocol

**Protocol Type**: Standard - Agent Architecture
**Status**: Active

## Purpose

Guides creation of Claude Code custom agents and their associated protocol files, ensuring consistency with the thin-wrapper pattern and proper protocol-first architecture.

## When to Use This Protocol

- Creating a new agent for a specific workflow
- Need to automate a multi-step process (code quality, deployment, review)
- Want to create a specialized version of Claude with focused expertise

## Part 1: Research Phase

### Step 1.1: Agent vs Skill — When to Use Which

**Use Agents When:**
- Multi-step workflow automation (code quality checks, deployments)
- Long-running processes with independent execution
- Specialized behavior requiring different model (haiku for simple tasks)
- Process orchestration (running multiple commands in sequence)

**Use Skills When:**
- Memory operations and identity management
- Quick reference/guidance workflows
- Single-step invocations
- Meta-cognitive operations (note-taking, reflection)

### Step 1.2: Agent Architecture Patterns

**User-Level Agents** (`~/.claude/agents/`):
- Available across all projects
- General workflows (code review, documentation, testing)

**Project-Level Agents** (`.claude/agents/`):
- Specific to one project
- Project-specific workflows (deployment, migration scripts)

## Part 2: Protocol Creation (Do This First)

**Always create or identify the protocol before the agent.** The protocol is the single source of truth for agent instructions.

### Step 2.1: Identify Existing Protocols

Before creating a new protocol, search for existing ones that the agent can reference.

### Step 2.2: Create New Protocol (If Needed)

Follow the entity-writing protocol for format and structure.

**Protocol should be comprehensive:**
- All necessary context for autonomous execution
- Concrete commands and examples
- Tool usage shown with code blocks
- Success/failure criteria defined
- Error handling guidance included

## Part 3: Agent Creation (Thin-Wrapper Format)

### Step 3.1: Craft Description

- 100-300 characters
- Multi-part format: "What it does. Use when [triggers]."
- Conceptual triggers for when to invoke

### Step 3.2: Choose Model and Color

- `haiku` — Simple, straightforward workflows
- `sonnet` — Default, balanced for most workflows
- `opus` — Complex decision-making, research-heavy workflows

### Step 3.3: Create Agent File

Agent file should be a **thin wrapper** — ONLY frontmatter + protocol reference + startup:

```markdown
---
name: {agent-name}
description: "{description}"
model: {model}
color: {color}
---

Read and follow `protocols/{protocol-name}` from cognitive-memory exactly.

Startup: `mcp__agent-mcp-gateway__execute_tool` with `server: "cognitive-memory"`, `tool: "read_entity"`, `args: {"entity_path": "protocols/{protocol-name}"}`
```

That's it. No `# Heading`, no `## Your Mission`, no `## Key Constraints`. The protocol contains all instructions.

## Part 4: Validation

- [ ] Protocol exists (created first or identified existing)
- [ ] Protocol is comprehensive single source of truth
- [ ] Agent file is thin wrapper (<15 lines)
- [ ] Description clearly states when to use
- [ ] Model selection appropriate for complexity
- [ ] Agent lives in correct location (user vs project level)

## Anti-Patterns to Avoid

- Creating agent file before identifying/creating protocol
- Duplicating protocol instructions in agent file
- Making agent description too vague
- Using opus for simple workflows
- Creating project-level agents for general workflows

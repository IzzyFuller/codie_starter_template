# Skill and Protocol Creation Protocol

## Purpose

Guides the creation of new Claude Code skills and their associated protocol files, ensuring consistency with best practices and proper architecture patterns.

## When to Use

- User requests creating a new skill or protocol
- Need to standardize approach to a recurring task
- Want to document complex workflow for reuse

## Part 1: Research Phase

Before creating any skill, research current Claude Code documentation to ensure alignment with latest patterns.

### Key Documentation Points

**Frontmatter requirements:**
- `name`: Skill name (lowercase, hyphens)
- `description`: Semantic matching surface (how Claude decides which skill to invoke)
- `version`: Version number (e.g., `0.1.0`)

**Description field -- The Semantic Matching Surface:**
The description should include what the skill does and specific trigger phrases in quotes that users would say. Use third-person format.

**SKILL.md body structure:**
- Keep it minimal -- just a pointer to the protocol
- Avoid summaries that enable "winging it" without reading the protocol

## Part 2: Protocol Creation (Do This First)

**Always create the protocol before the skill.** The protocol is the single source of truth.

Protocol structure:
1. **Purpose** -- What problem does this solve?
2. **When to Use** -- Triggers and use cases
3. **Parts/Sections** -- Numbered sections for different aspects
4. **Examples** -- Concrete usage examples
5. **Integration** -- How it fits with existing tools
6. **Tools Reference** -- Tools and their usage

Store protocols in `{{MEMORY_PATH}}/protocols/`.

## Part 3: Skill Creation (After Protocol Exists)

Skills live in: `.claude/skills/{skill-name}/SKILL.md`

Keep SKILL.md minimal with a Protocol Reference pointing to the full protocol file.

## Part 4: Validation

- Protocol created first as single source of truth
- Frontmatter includes name, description, AND version
- Description uses specific quoted trigger phrases
- SKILL.md body is minimal (pointer, not summary)
- Protocol Reference points to correct file path

## Anti-Patterns to Avoid

- Creating SKILL.md before protocol
- Omitting version field from frontmatter
- Using vague triggers instead of specific phrases
- Including summaries that enable skipping the protocol
- Duplicating protocol content in SKILL.md

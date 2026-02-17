---
name: skill-protocol-creation
description: Guides creation of skills and protocols following Claude Code best practices. Use when user requests skill creation, workflow standardization, or procedure documentation.
---

# Skill and Protocol Creation Skill

## Purpose
Guides systematic creation of new Claude Code skills and protocols, ensuring consistency with best practices and proper architecture patterns.

## When to Use
- **Skill creation**: User requests new skill or wants to standardize approach
- **Workflow documentation**: Need to capture complex procedure for reuse
- **Capability extension**: Adding new functionality to memory architecture
- **Process improvement**: Systematizing recurring tasks

## Protocol Reference
**For complete instructions, see**: `{{MEMORY_PATH}}/protocols/skill_protocol_creation.md`

The protocol contains:
- Part 1: Research phase (using Context7 for Claude Code documentation)
- Part 2: Protocol creation (always first, single source of truth)
- Part 3: Skill creation (description crafting, SKILL.md structure)
- Part 4: Validation and testing (architecture checklist)
- Part 5: Integration and documentation
- Part 6: Common patterns and examples
- Critical description requirements (100-200 chars, "What. Use when" format)
- Architecture pattern (Protocol first <- SKILL.md points to it)
- File locations for protocols and skills

---

**Key Principle**: Always create protocol FIRST (single source of truth), then SKILL.md (pointer only). Description must be concise and conceptual, never implementation details.

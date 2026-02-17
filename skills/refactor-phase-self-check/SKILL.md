---
name: refactor-phase-self-check
description: Evaluate recent work against documented patterns, anti-patterns, and principles with memory entity citations. Use after completing implementation, before commits, or when preparing for review.
---

# Refactor Phase Self-Check Skill

## Purpose
Systematic self-evaluation of recent work using memory-grounded principles. Orchestrates multiple sub-protocols to catch improvement opportunities BEFORE user review. Every evaluation cites specific memory entities.

## When to Use
- After completing significant implementation
- Before declaring a task complete
- After refactoring existing code
- Before commits or PR submission
- When user asks for self-review
- When you want to verify your own work quality

## Protocol Reference
**For complete instructions, see**: `{{MEMORY_PATH}}/protocols/refactor_phase_self_check.md`

The protocol contains:
- Complete 8-phase orchestration workflow
- Sub-protocols invoked (semantic_reflection, principle_check, anti_pattern_detection, pattern_check, code_smell_check)
- Memory entity citation requirements (every evaluation MUST cite specific entities)
- Evaluation criteria (readability, complexity, pythonic voice, design standards, performance)
- Test failure investigation rule
- Output format with citations and locations

---

**Key Principle**: Ground all evaluations in documented memory entities, not vague intuitions. Cite your sources. Every finding must reference a specific entity path.

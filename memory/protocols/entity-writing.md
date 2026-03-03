# Entity Writing Protocol
**Protocol Type**: Standard - Entity Format & Relationship Structure
**Status**: Active

## Purpose

Single source of truth for how to write entities to cognitive-memory. All deep learn finder agents reference this protocol for entity format, relationship structure, and quality standards.

**This protocol owns FORMAT.** Finder protocols own IDENTIFICATION.

## Base Entity Structure

All entities share this skeleton:

```
# [Entity Name]
**Type**: [people/projects/concepts/patterns/anti-patterns]
**Created**: [date]
**Last Updated**: [today's date]

## Summary
[1-3 sentence overview]

## [Type-Specific Sections]

## Related Entities
- **[relationship-type]** [entity/path]: [1-line reason]

---
*Last session update: [today's date] - [what changed]*
```

## Per-Type Templates

### Knowledge Entities (projects/, people/, concepts/)

Sections: Summary, Key Details, Evidence/Examples, Related Entities

### Patterns (patterns/)

Sections: Summary, When to Apply, How It Works, Evidence, Related Entities

### Anti-Patterns (anti-patterns/)

Sections: Summary, The Mistake, The Correction, Evidence, Related Entities

### Protocols (protocols/)

Sections: Purpose, When to Use This Protocol, [Protocol-Specific Sections], Related Entities

## Relationship Type Vocabulary

| Type | Meaning |
|------|---------|
| depends-on | This entity requires or builds on another |
| used-by | Another entity uses this one |
| related-to | Thematic or conceptual connection |
| derived-from | Created from or inspired by another |
| co-echo | Entities frequently retrieved AND useful together |

## Quality Standards

- **Evidence-based only**: Every relationship MUST have a concrete reason
- **Bidirectional linking NOT required**: Emerges organically over time
- **Concise**: One line per relationship — type, path, brief reason
- **No bloat**: Typically 1-5 entries per entity

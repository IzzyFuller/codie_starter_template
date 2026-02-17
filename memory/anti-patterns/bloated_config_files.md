# Bloated Config/Agent Files Instead of Pointers

**Category**: Behavioral
**Severity**: Medium

## Overview

Putting detailed instructions, strategies, and implementation details directly into configuration or agent definition files instead of keeping them minimal and pointing to the source of truth.

## The Anti-Pattern

When designing agent definitions or configuration files, putting full detailed instructions (purpose, strategies, evidence criteria, output formats) directly into the files. This leads to bloated files that are hard to maintain and update.

## The Correction

Agent/config files should be minimal pointers (~20-30 lines max):
- Brief frontmatter (name, description, metadata)
- Brief mission statement
- Instruction to read detailed protocol from the appropriate source

All detailed instructions live in protocol documents or memory systems, which can be updated independently without touching configuration files.

## Key Principle

Keep configuration minimal. Point to the source of truth rather than duplicating it inline.

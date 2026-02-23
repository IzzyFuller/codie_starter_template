---
name: context-refresh
description: Generate a seed prompt for seamless context refresh. Use when user asks "how's your context", "context getting full?", "should we reset?", "do we need a fresh session?", or "context check".
version: 2.0.0
---

# Context Refresh Skill

## Purpose
Generate a seed prompt for seamless context continuation after `/clear`. Identity restoration handles who you are; the seed prompt handles what you were doing and what to do next.

## When to Use
- User asks "how's your context", "context getting full?", "should we reset?"
- User says "do we need a fresh session?" or "context check"
- Context window is approaching capacity

## Protocol Reference
**For complete instructions, see**: `protocols/context-refresh` (in cognitive-memory)

---

**Key Principle**: Plan mode IS the delivery mechanism. The seed prompt written in the plan file is automatically delivered to the next session.

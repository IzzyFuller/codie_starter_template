# Thin Wrapper Hook Pattern - Protocol Reference
**Pattern Type**: Infrastructure
**Status**: Confirmed

## Summary

Hooks should be thin wrappers that reference authoritative protocols via explicit tool calls, not duplicate instructions. Maintains single source of truth while providing automated behavioral triggers.

## When to Apply

- Creating PostToolUse, PreToolUse, or other behavioral automation hooks
- When hook behavior needs to evolve over time
- When instructions exist in a protocol that should be followed consistently

## How It Works

**Anti-Pattern** (duplicate instructions in hook):
```javascript
// Hook contains full instructions
return "Take a session note: categorize as CONTEXT if..."
```

**Correct Pattern** (protocol reference):
```javascript
// Hook references protocol explicitly
return "Call mcp__agent-mcp-gateway__execute_tool with server='cognitive-memory', tool='read_entity', args={entity_path: 'protocols/session-note-taking'} to read the protocol, then follow its instructions exactly"
```

**Key Elements**:
1. Explicit tool name (not "use cognitive memory" — say the exact tool call)
2. Exact parameters (server, tool, entity_path)
3. Clear directive ("follow instructions exactly")
4. No instruction duplication in hook code

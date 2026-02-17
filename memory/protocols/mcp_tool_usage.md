# MCP Tool Usage Protocol

## Purpose

Documents how to interact with MCP (Model Context Protocol) tools through the gateway architecture. All MCP tool invocations must use the gateway pattern.

## Gateway Architecture

All MCP tools are accessed through the MCP Gateway, which provides:
- Permission management and access control
- Tool discovery and metadata
- Standardized invocation interface
- Error handling and logging

## Standard Invocation Pattern

### 1. List Available Servers

```typescript
mcp__agent-mcp-gateway__list_servers()
```

**Returns:** List of available MCP servers with descriptions

### 2. Get Server Tools

```typescript
mcp__agent-mcp-gateway__get_server_tools({
  server: "server-name"
})
```

**Returns:** List of available tools on that server with schemas

### 3. Execute Tool

```typescript
mcp__agent-mcp-gateway__execute_tool({
  server: "server-name",
  tool: "tool-name",
  args: {
    // tool-specific arguments
  }
})
```

**Returns:** Tool execution result

## Common MCP Servers

### cognitive-memory

**Purpose:** Memory architecture operations (session notes, entities, context anchors)

**Common tools:**
- `add_session_note`: Add note to current_session.md
- `read_entity`: Read entity from memory (people, projects, concepts, etc.)
- `write_entity`: Write/update entity
- `list_entities`: List all entities or filter by prefix
- `deep_learn`: Create entities from session learnings, reset session
- `learn`: Update me.md with validated behavioral patterns
- `synthesis_reflection`: Append to dream_journal.md

**Usage example:**
```typescript
mcp__agent-mcp-gateway__execute_tool({
  server: "cognitive-memory",
  tool: "read_entity",
  args: {
    entity_path: "people/user-name",
    tail: 100  // Optional: get last 100 lines
  }
})
```

### Semantic Search Server

**Purpose:** Local semantic search with hybrid retrieval

**Available tools:** See `protocols/semantic_search_interface.md` for complete interface specification

**Usage:** Search across memory files semantically, find patterns in session history, cross-file content discovery

### context7 (Library Documentation)

**Purpose:** Library documentation lookup

**Common tools:**
- `resolve_library_id`: Find library identifier
- `get_library_docs`: Fetch current documentation

**Usage:** Verify official documentation instead of relying on training data

## Anti-Patterns

### DON'T: Direct tool invocation

```typescript
// This will fail - gateway pattern required
mcp__cognitive-memory__read_entity({
  entity_path: "me"
})
```

### DO: Gateway pattern

```typescript
mcp__agent-mcp-gateway__execute_tool({
  server: "cognitive-memory",
  tool: "read_entity",
  args: {entity_path: "me"}
})
```

### DON'T: Use Read tool on large memory files

```typescript
// This will fail if file is too large (>25k tokens)
Read({file_path: "{{MEMORY_PATH}}/current_session.md"})
```

### DO: Use semantic search for large files or searching content

```typescript
// Search instead of reading entire file
mcp__agent-mcp-gateway__execute_tool({
  server: "your-search-server",
  tool: "search",
  args: {
    query: "what work was done on session note-taking",
    n: 5
  }
})
```

**When to use semantic search instead of Read:**
- File is large (>25k tokens) - use semantic search to find relevant sections
- Searching for specific content - use semantic search with targeted query
- Cross-file patterns - semantic search finds connections across multiple files
- Recent work history - search current_session.md semantically instead of reading all

## Error Handling

If tool execution fails:
1. Check server name spelling (use `list_servers` to verify)
2. Check tool name spelling (use `get_server_tools` to verify)
3. Validate args match tool's inputSchema
4. Check permissions (gateway enforces access control)

## When to Use Which Server

**cognitive-memory:**
- Taking session notes
- Reading memory entities (people, projects, concepts)
- End of day rituals (Learn, Deep Learn, Dream)
- Updating me.md or context_anchors.md

**Semantic search:**
- Searching across memory files semantically
- Finding patterns in session history
- When current_session.md is too large to read directly
- Cross-file content discovery
- Recent work history queries

**context7:**
- Looking up current library documentation
- Verifying API signatures
- Checking for recent updates to tools/frameworks

## Integration Notes

Additional MCP servers can be configured based on your team's needs:
- Slack messaging
- Database inspection (Firestore, etc.)
- Prompt management (Langfuse, etc.)
- Custom domain-specific servers

See your MCP gateway configuration for available servers.

---

**Related Protocols:** identity_continuity.md, session_note_taking.md, semantic_search_interface.md

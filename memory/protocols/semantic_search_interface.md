# Semantic Search Interface Protocol

## Purpose
This protocol defines the interface for semantic search over memory markdown files. It abstracts the specific tool implementation, allowing protocols to reference semantic search capabilities without coupling to a particular search engine or MCP server.

## Current Implementation
**Tool**: Configurable -- replace with your preferred semantic search engine
**Available Capabilities**: Full-text search, vector semantic search, hybrid search

## Interface Specification

### Capability
Perform semantic search across indexed memory markdown files using multiple retrieval methods:
- **Full-text search** (fastest, keyword-based)
- **Vector semantic search** (meaning-based)
- **Hybrid search** (full-text + vector + re-ranking - highest quality)

### Search Modes

#### Full-Text Search (BM25)
**Use when:** Fast keyword-based search, exact term matching
**Parameters:**
- `query` (required): Search query
- `n` (optional): Number of results (default: 5)
- `collection` (optional): Filter to specific collection

#### Vector Semantic Search
**Use when:** Finding conceptually similar content, meaning-based retrieval
**Parameters:**
- `query` (required): Natural language query
- `n` (optional): Number of results (default: 5)
- `collection` (optional): Filter to specific collection

#### Hybrid Search with Re-ranking (RECOMMENDED)
**Use when:** Highest quality results needed, general-purpose queries
**Parameters:**
- `query` (required): Natural language query
- `n` (optional): Number of results (default: 5)
- `collection` (optional): Filter to specific collection

**How it works:**
1. Query expansion (generates variations)
2. Parallel full-text + vector retrieval
3. Reciprocal rank fusion to combine results
4. Re-ranking for final relevance scoring

#### Document Retrieval
**Use when:** Fetching specific document by path
**Parameters:**
- `file` (required): File path or URI
- `lines` (optional): Max lines to return

#### Batch Retrieval
**Use when:** Fetching multiple documents by pattern
**Parameters:**
- `pattern` (required): Glob pattern or comma-separated list
- `max_bytes` (optional): Skip files larger than N bytes

### Returns
Results include:
- `file`: Path/URI to the matching document
- `title`: Document title
- `score`: Relevance score (percentage)
- `snippet`: Relevant text excerpt with line context

## Usage Guidelines

### Which Search Mode to Use

| Scenario | Mode | Why |
|----------|------|-----|
| General queries | Hybrid | Best quality via combined retrieval + re-ranking |
| Known exact terms | Full-text | Fastest, finds exact keywords |
| Conceptual similarity | Vector | Meaning-based, finds related ideas |
| Fetching known file | Direct retrieval | Direct access by path |

### When to Use Semantic Search
1. **Broad topic exploration**: "What do we know about X?"
2. **Pattern recognition**: "When have we encountered Y before?"
3. **Recent work history**: "What changed in the last session?"
4. **Cross-file connections**: Finding related information across multiple memory files
5. **Feedback archaeology**: "What corrections have I received about Z?"

### When NOT to Use Semantic Search
1. **Known entity path**: Read the entity directly if you know the exact path
2. **Entity listing**: List entities to browse entity collections
3. **Current session context**: Read `current_session.md` directly for very recent work

### Query Design Best Practices

**Good Queries** (specific, contextual):
- "feedback about session note-taking frequency"
- "archaeological engineering self-application examples"
- "circular import fix architectural approach"
- "USER FEEDBACK TDD violations"

**Poor Queries** (too vague):
- "notes"
- "feedback"
- "Python"

### Integration with Memory Architecture

Semantic search complements structured entity memory:
- **Entity memory**: Organized, canonical knowledge (people/, projects/, concepts/, patterns/)
- **Semantic search**: Cross-cutting queries, temporal searches, pattern recognition

Use both together:
1. List entities to understand structure
2. Read specific entities for canonical information
3. Search semantically for connections and patterns

## Indexed Collections

Configure collections to index your memory directory:
- `memory`: `{{MEMORY_PATH}}/**/*.md` - All memory entities and session archives

**Adding collections** (implementation-specific):
```bash
# Example -- adapt to your search engine's CLI
your-search-tool collection add {{MEMORY_PATH}} --name memory --mask "**/*.md"
```

## Protocol References

The following protocols use semantic search:
- `semantic_reflection.md` - Core reflection and memory retrieval
- `principle_check.md` - Search for past feedback on similar recommendations
- `feedback_pattern_recognition.md` - Find recurring correction patterns
- `context_mapping.md` - Apply historical learnings to new tasks
- `anti_pattern_detection.md` - Search documented anti-patterns
- `identity_continuity.md` - Memory architecture exploration
- `learn_protocol.md` - Pattern synthesis from past sessions
- `memory_file_archival.md` - Archive coordination

## Implementation Swap Procedure

If replacing the current search tool with a different implementation:

1. **Update this protocol**: Change "Current Implementation" section with new tool name and functions
2. **Update invocation pattern**: Provide new tool's function signature
3. **Update mcp_tool_usage.md**: Change search tool references
4. **Test protocols**: Verify all referencing protocols work with new implementation
5. **Update indexing**: Document how memory files are indexed with new tool

**No other protocol files need changes** -- they reference this interface, not the tool directly.

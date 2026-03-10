# MCP Tool Usage Protocol

## Purpose

Documents how to interact with MCP tools. All tools are called directly by name — no gateway required.

---

## cognitive-memory (`mcp__cognitive-memory__*`)

**Purpose:** Memory architecture operations — session notes, entities, context anchors, learning rituals.

**Tools:**
- `add_session_note` — Add note to current_session.md
- `read_entity` — Read entity from memory (people/, projects/, concepts/, etc.)
- `write_entity` — Write/update entity
- `list_entities` — List all entities or filter by prefix
- `deep_learn` — Bulk session-to-entity consolidation, resets session
- `learn` — Update me.md with validated behavioral patterns
- `synthesis_reflection` — Append to dream_journal.md

**Usage:**
```typescript
mcp__cognitive-memory__read_entity({ entity_path: "people/user-name" })
mcp__cognitive-memory__add_session_note({ note_type: "context", content: "..." })
```

---

## qmd (`mcp__qmd__*`)

**Purpose:** Semantic search across memory files.

**Tools:**
- `status` — Show index health, document counts, collection info
- `search` — Full-text BM25 keyword search
- `vector_search` — Meaning-based semantic search (requires vector index)
- `deep_search` — Hybrid: query expansion + BM25 + vector + re-ranking (requires vector index)
- `get` — Fetch single document by file path or docid
- `multi_get` — Fetch multiple documents by glob pattern or comma-separated list

**Usage:**
```typescript
mcp__qmd__search({ query: "what pattern applies here", collection: "memory" })
mcp__qmd__get({ file: "people/user-name.md" })
mcp__qmd__status()
```

**Vector index:** `vector_search` and `deep_search` require embeddings to be built:
```
qmd embed
```
First run downloads ~2GB of models to `~/.cache/qmd/models/` — subsequent runs use the cache.
Without this, only `search` (BM25) is available.
On machines without a GPU, prefix with `NODE_LLAMA_CPP_GPU=false` to skip GPU detection.

**Indexing new memory files:**
```
qmd update
```

---

## Anti-Patterns

### DON'T: Read large memory files directly

```typescript
// Risky — current_session.md can grow very large
Read({ file_path: "{{MEMORY_PATH}}/current_session.md" })
```

```typescript
// Correct — search semantically instead
mcp__qmd__search({ query: "what work was done on session notes", collection: "memory" })
```

### DON'T: Assume qmd tools work without checking

If `mcp__qmd__*` calls fail, verify qmd is running and accessible. Check `mcp__qmd__status()` first.

---

## When to Use Which

| Need | Tool |
|------|------|
| Take a session note | `mcp__cognitive-memory__add_session_note` |
| Read a known entity | `mcp__cognitive-memory__read_entity` |
| Search memory semantically | `mcp__qmd__deep_search` or `mcp__qmd__search` |
| Fetch a known memory file | `mcp__qmd__get` |
| Large file (too big to Read) | `mcp__qmd__search` to find relevant sections |

---

**Related Protocols:** identity-continuity.md, session-note-taking.md, semantic-search-interface.md

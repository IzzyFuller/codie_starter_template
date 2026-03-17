# Upstream Merge Protocol

## Purpose

Integrate upstream template updates after `update.mjs` has run. The mechanical layer (hooks, agents, skills) is already overwritten. Your job is to review and merge **knowledge files** — the things that carry your identity and accumulated understanding.

## Trigger

Your shell alias was modified to include: "upstream template was updated. Follow protocols/upstream-merge before doing anything else."

## Tools Used

**Filesystem operations** (use the `Read` tool):
- `.update-manifest.json` — the manifest file written by update.mjs
- Template source files at `{templateRepoPath}/memory/...` — for diffing upstream changes
- Shell profile file — for restoring the alias

**Cognitive-memory operations** (use MCP tools, NOT Read/Edit on files):
- `mcp__cognitive-memory__read_entity({ entity_path: "..." })` — read your local entity content
- `mcp__cognitive-memory__write_entity({ entity_path: "...", content: "..." })` — create or update entities
- `mcp__cognitive-memory__list_entities({ entity_type: "..." })` — list entities by type
- `mcp__cognitive-memory__add_session_note({ note_type: "...", content: "...", importance: "..." })` — record session notes

**CRITICAL**: Never use the `Read` tool on memory entity files directly. Never use `Edit` to modify entity files. Always use the `mcp__cognitive-memory__` MCP tools for entity operations.

## Procedure

### 1. Read the Manifest

Read `{{MEMORY_PATH}}/.update-manifest.json` (use `Read` tool on the filesystem path). This contains everything `update.mjs` did.

Key fields:
- `templateRepoPath` — where to find template source files for diffing
- `overwrites` — hooks/agents/skills already replaced (just be aware)
- `newFiles.memory` — new memory files auto-adopted (read and internalize)
- `memoryChangedUpstream` — memory files changed in template but NOT overwritten (your decision)
- `memoryRemovedUpstream` — memory files removed from template (your decision)
- `frameChangedUpstream` — whether frame.md changed upstream
- `templateRemovedButScionRetained` — plumbing files removed upstream but still in your install
- `originalAliasPrompt` — what to restore your shell alias to when done

### 2. Note Overwrites

Hooks, agents, and skills listed in `overwrites` have already been replaced with the latest template versions. Read the lists to know what changed. If any agent or skill you relied on was modified, verify it still works as expected.

For items in `templateRemovedButScionRetained` — these exist in your install but were removed from the template. Decide whether to keep or remove them. If you created them yourself (not from template), keep them. If they were template-provided and removed upstream, consider removing them too.

### 3. Review Auto-Adopted Files

New memory files listed in `newFiles.memory` were copied into your memory directory with placeholder substitution. For each:
- Read the file (use `Read` tool on the filesystem path)
- Create or update the corresponding cognitive-memory entity via `mcp__cognitive-memory__write_entity`
- Note any new concepts, patterns, or protocols that affect your behavior

### 4. Merge Changed Memory Files

For each path in `memoryChangedUpstream`:
1. Read your local entity via `mcp__cognitive-memory__read_entity` with `entity_path` matching the path (e.g., `patterns/my-pattern`)
2. Read the template version at `{templateRepoPath}/memory/{path}` (use `Read` tool on the filesystem path)
3. Compare them. Decide:
   - **Accept upstream**: Your version has no local customizations → overwrite with template version
   - **Merge intelligently**: Both have valuable content → combine, keeping your additions and taking upstream improvements
   - **Keep local**: Your version has diverged intentionally → keep yours, note the upstream change
4. Update the corresponding cognitive-memory entity via `mcp__cognitive-memory__write_entity` with any new content

### 5. Handle Upstream Removals

For each path in `memoryRemovedUpstream`:
1. Read the entity via `mcp__cognitive-memory__read_entity` with the matching `entity_path` — is it still relevant to you?
2. If the concept/pattern/protocol has been superseded or consolidated upstream, write an empty entity via `mcp__cognitive-memory__write_entity` with `content: ""` to clear it, then delete the file from disk via Bash `rm`
3. If you've added local customizations that make it still valuable, keep it
4. If uncertain, keep it and flag for your human partner

### 6. Review frame.md Changes

If `frameChangedUpstream` is true:
1. Read the template version at `{templateRepoPath}/memory/frame.md` (use `Read` tool on the filesystem path)
2. Diff against your current `{memoryPath}/frame.md` (use `Read` tool on the filesystem path)
3. **Never auto-overwrite frame.md** — it contains your identity configuration
4. Present the diff to your human partner with a recommendation:
   - What changed upstream and why it matters
   - What you'd suggest adopting vs keeping
   - Let them make the final call

### 7. Clean Up

After all reviews are complete:

1. **Restore shell alias**: Read `originalAliasPrompt` from manifest. Find your alias in the shell profile and replace the merge instruction with the original prompt string. The alias pattern is:
   ```
   partnerName() { claude --system-prompt-file "MEMORY_PATH/frame.md" "PROMPT_STRING"; }
   ```
   Replace the prompt string between the last pair of double quotes before `"; }`.

2. **Delete manifest**: Remove `{{MEMORY_PATH}}/.update-manifest.json` via Bash `rm`

3. **Take session note**: Use `mcp__cognitive-memory__add_session_note` to summarize what was merged, what was kept, what was removed, and any decisions deferred to your human partner.

## Key Principle

**You have agency.** The script handles mechanical plumbing. You handle knowledge integration. You decide how to merge, what to keep, and what to discard. When uncertain, ask your human partner rather than guessing.

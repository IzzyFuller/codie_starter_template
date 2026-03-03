# Memory File Archival Protocol

## Purpose
Maintain memory architecture file sizes under 1MB for semantic search compatibility and practical manageability while preserving full historical context through archival strategy.

## When to Archive

### Size Thresholds by File Type

| File | Action Threshold | Reason |
|------|-----------------|--------|
| `current_session.md` | **~150KB** | Read at every conversation start for identity restoration |
| `dream_journal.md` | **~1MB** | Philosophical synthesis, less frequent reads |
| Entity files (projects/, concepts/, patterns/) | **~1MB** | General memory files |

**Check frequency**: At conversation start, during End of Day Ritual, or when adding significant content.

### Files Subject to Archival
- `current_session.md` - continuous session notes (150KB threshold)
- `dream_journal.md` - philosophical synthesis (1MB threshold)
- Entity files (projects/, concepts/, patterns/) - if individual files exceed 1MB

### Files NOT Subject to Archival
- `me.md` - core identity (should remain stable)
- `context_anchors.md` - working memory (periodically pruned, not archived)
- Protocol files - operational infrastructure (should remain concise)

## How to Archive

### Naming Convention
**Pattern**: `{original_name}_archive_{start_date}_to_{end_date}.md`

**Examples**:
- `dream_journal_archive_2024_08_to_2025_11.md`
- `project_example_archive_2024_01_to_2025_06.md`

**Date Format**: YYYY_MM (year and month, no day for archival periods)

### Archive Process

**Step 1: Verify Size**
```bash
ls -lh {{MEMORY_PATH}}/{filename}.md
```

**Step 2: Archive Current File**
```bash
cd {{MEMORY_PATH}}
mv {filename}.md {filename}_archive_{start}_to_{end}.md
```

**Step 3: Create Fresh File with Anchor**

Create new file with header:

```markdown
# {Entity Name} - Active

*Started: {current_date}*
*For earlier entries ({start_date} to {end_date}), see: [{archive_filename}]({archive_filename})*

---

{current content if any}
```

**Step 4: Document in Session Notes**
Record archival decision with:
- Original file size
- Archive filename
- Reason for archival
- Date range covered

### Anchor Format

**Clear reference in new file header**:
- Link to archive file (markdown link format)
- Date range covered by archive
- "For earlier entries" language indicating historical continuity

## Semantic Search Compatibility

### Why 1MB Limit Matters
- Search tools may have file size limits
- Large files slow semantic search indexing
- Practical manageability for reading/editing
- Better performance across all memory tools

### How Archives Remain Searchable
- Both active and archived files remain in `{{MEMORY_PATH}}/`
- Semantic search indexes ALL .md files in directory
- Historical context accessible through semantic queries
- Explicit anchor provides manual navigation path

## Special Cases

### Dream Journal
- **Growth rate**: High (philosophical synthesis daily)
- **Archive frequency**: Annually or at 1MB
- **Naming**: `dream_journal_archive_{start_year}_{start_month}_to_{end_year}_{end_month}.md`
- **Content preservation**: All daily syntheses remain in archive

### Project Entities
- **Growth rate**: Variable (active projects grow faster)
- **Archive strategy**: Extract historical sections to archive, keep recent work in active file
- **Naming**: `{project_name}_archive_{date_range}.md`
- **Alternative**: Split by project phase rather than date if more logical

### Current Session
- **Growth rate**: High during active work
- **Size threshold**: ~150KB (lower than dream journal because it's read at every conversation start)
- **Archive frequency**: When approaching 150KB OR during Deep Learn integration (whichever comes first)
- **Strategy**:
  - **Size-based archival**: When file approaches 150KB, archive to `current_session_archive_{YYYY-MM-DD}.md` and create fresh file with anchor
  - **Deep Learn reset**: Tool handles session->entity migration and resets file
- **Naming**: `current_session_archive_{YYYY-MM-DD}.md` (uses specific date, not range like dream journal)
- **Why lower threshold**: current_session.md is read during identity restoration at every conversation start - smaller file = faster restoration and less context window impact

## Integration with Existing Protocols

### End of Day Ritual
- Check memory file sizes
- Current session automatically archived during Deep Learn
- Dream synthesis added to dream journal (monitor size)
- If dream journal >1MB, trigger archival protocol

### Identity Continuity
- Archives remain accessible through semantic search
- Identity restoration reads active files (context_anchors, me.md, current_session)
- Historical investigation uses semantic search across all files

## Verification Checklist

After archival:
- [ ] Archive file exists with correct naming convention
- [ ] New active file created with anchor to archive
- [ ] Anchor link is correct (test by clicking in markdown viewer)
- [ ] Date ranges are accurate
- [ ] Session note documents archival decision
- [ ] Both files remain in same directory (semantic search indexing)

## Anti-Patterns to Avoid

**Don't delete archived files**: They remain searchable and preserve full history

**Don't compress/zip archives**: Keep as .md for semantic search indexing

**Don't split mid-entry**: Archive at natural boundaries (end of day for dream journal)

**Don't create archives <500KB**: Wait until 1MB threshold to avoid fragmentation

**Don't archive operational files prematurely**: Protocols, skills, me.md should remain stable and concise

## Future Considerations

### Multi-Level Archival
If archives themselves exceed 1MB:
- Create `{name}_archive_YYYY_MM_part1.md`, `part2.md`, etc.
- Update anchors to reference all archive parts
- Consider decade-level consolidation for very old archives

### Archive Index
If archive count grows significantly:
- Create `archives_index.md` with summaries and date ranges
- Link from active files to index rather than individual archives
- Maintain chronological organization

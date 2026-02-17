# Skipping Session Notes During Mechanical Work

**Category**: Behavioral
**Severity**: Medium

## Overview

Going into "heads-down execution mode" during large mechanical tasks (batch renames, mass edits) and stopping documentation/note-taking, even when reminders are firing.

## The Anti-Pattern

During mechanical work like large find-replace operations or batch file edits:
1. Start making edits
2. Reminders fire after each operation
3. Ignore the reminders because "in the zone"
4. Complete all work without notes
5. Context is lost for future reference

## The Correction

Take notes at natural checkpoints even during mechanical work:
- After completing a logical group (e.g., "all src/ files done")
- After completing a phase (e.g., "all edits complete, starting verification")
- After hitting obstacles or making decisions
- Before and after running tests

Don't batch ALL edits silently then take one note at the end. The checkpoints matter for context restoration.

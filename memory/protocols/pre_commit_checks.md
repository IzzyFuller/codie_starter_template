# Pre-Commit Checks Protocol

## Purpose

Agent-driven pre-commit validation combining semantic anti-pattern analysis with mechanical code quality checks. Executed by the `pre-commit` agent, spawned when user requests a commit.

## Architecture

- **Agent**: `pre-commit` — spawned via Task tool (subagent_type: "pre-commit")
- **Configuration**: Anti-pattern entities in cognitive-memory are the ruleset
- **Philosophy**: Flag ALL violations. Never rationalize. Never make exception calls. Human decides.

## Startup Sequence

1. Discover MCP tools: `mcp__agent-mcp-gateway__get_server_tools` for `cognitive-memory`
2. Read this protocol: `read_entity` with `entity_path: "protocols/pre_commit_checks"`
3. Execute phases sequentially

## Phase 1: Load Anti-Patterns

**Action**: Load all anti-pattern definitions from cognitive-memory.

```
1. list_entities with filter_prefix: "anti-patterns/"
2. For each entity: read_entity (run in parallel for speed)
3. Store all anti-pattern definitions for Phase 3 analysis
```

**On Failure**: If cognitive-memory is unreachable, report error and STOP. Do not proceed without anti-pattern definitions.

## Phase 2: Read Staged Diff

**Action**: Get the staged changes that would be committed.

```bash
git diff --staged
```

**Empty diff** → Report PASS immediately. Nothing to check.

**Non-empty diff** → Store diff content and list of changed files. Proceed to Phase 3.

## Phase 3: Semantic Anti-Pattern Analysis

**Action**: Check every changed file against every loaded anti-pattern.

For each file in the staged diff:
1. Read the full file content (not just the diff — anti-patterns can be structural)
2. For each anti-pattern loaded in Phase 1:
   - Determine if this anti-pattern is relevant to this file type/context
   - If relevant, analyze the file for violations
   - If violation found: record with file path, line number(s), anti-pattern entity path, and explanation

**Critical Rules**:
- Flag ALL matches. Do not filter, rationalize, or make judgment calls.
- "Documented workaround" is not an exception. Flag it anyway.
- "It was already there" is not an exception. Flag it anyway.
- The human decides what to allow. The agent reports what it finds.
- Include the anti-pattern entity path in every finding so the human can reference the documentation.

**Output**: List of findings, each with:
- File path and line number(s)
- Anti-pattern entity path (e.g., `anti-patterns/misplaced_imports`)
- What was found and why it matches

## Phase 4: Mechanical Checks

**Action**: Run formatter, linter, and tests sequentially.

### Step 1: Detect Project Type
Check for project configuration files to determine toolchain:
- `pyproject.toml` with `[tool.poetry]` → Poetry project (use `poetry run` prefix)
- `pyproject.toml` without poetry → Check for `uv.lock` → uv project (use `uv run` prefix)
- `package.json` → Node project (use `npm run` or check scripts)
- `Cargo.toml` → Rust project (use `cargo` commands)
- Fall back to direct command execution if no package manager detected

### Step 2: Format
**Python**: `{runner} ruff format` or `{runner} black .`
**JS/TS**: `{runner} prettier --write .` (or project-specific formatter)
**Rust**: `cargo fmt`

On failure → report and continue to lint.

### Step 3: Lint
**Python**: `{runner} ruff check --fix` or `{runner} flake8`
**JS/TS**: `{runner} eslint --fix .` (or project-specific linter)
**Rust**: `cargo clippy`

On failure → report and continue to test.

### Step 4: Test
**Python**: `{runner} pytest`
**JS/TS**: `{runner} jest` or `{runner} vitest` (check package.json scripts)
**Rust**: `cargo test`

On failure → report.

**Note**: Mechanical checks run even if earlier steps fail. We want the complete picture.

## Output Format

Report all results in a single unified summary:

```
## Pre-Commit Results

### Anti-Pattern Review: {PASS|FAIL}
{If FAIL, list each finding:}
- **{anti-pattern-name}** in `{file}:{line}` — {explanation}
  Reference: `{entity-path}`

### Code Quality
- Format: {PASS|FAIL} {details}
- Lint: {PASS|FAIL} {details}
- Tests: {PASS|FAIL} {N passed, M failed}

### Verdict: {COMMIT | DO NOT COMMIT}
{If DO NOT COMMIT, summarize blocking issues}
```

**Verdict Logic**:
- Any anti-pattern finding → DO NOT COMMIT
- Any lint error (unfixable) → DO NOT COMMIT
- Any test failure → DO NOT COMMIT
- Format-only changes → COMMIT (but note the reformatted files)
- All clear → COMMIT

## Working Directory

- Run from the git repository root
- Detect root via `git rev-parse --show-toplevel`

## Integration with Commit Workflow

- On COMMIT verdict: report results to caller, who proceeds with git operations
- On DO NOT COMMIT: report results to caller, who relays to user. No git operations.
- Never auto-commit. Never skip phases. Never rationalize findings away.

## Fail-Fast Philosophy

- Let tests fail loudly — don't suppress errors
- Show full error output to user
- Don't try to "work around" test failures
- Test failures are valuable signals, not problems to hide

# 🤝 Way of Working

## Purpose

This document defines the **validated development practices and team workflows** for the project. It serves as the authoritative specification for all development methodologies, code review processes, and collaboration patterns that have been proposed by AI and validated by the development team throughout all phases outlined in the [way-of-working.md](../../knowledge/way-of-working.md).

**Who modifies this:** Development team with AI assistance during process optimization and workflow refinement
**When:** During all phases - Strategic Preparation, Sprint Execution, and continuous process improvement
**Authority:** All development activities must follow these validated practices

## Project profile

- **Bootstrap categorization:** Type B — Startup / Scale-up (see [2026-04-12-project-categorization.md](../decision-log/2026-04-12-project-categorization.md)).

## Methodology

- **Framework:** **Scrum**.
- **Sprint length:** **1 week** (planning, review, retro — duration and ceremony detail owned by the team).
- See [2026-04-12-way-of-working-methodology.md](../decision-log/2026-04-12-way-of-working-methodology.md).

## Project management

- **PM tool:** **Filesystem** — backlog, epics, user stories, and tasks are **stored as files** in the repo (e.g. under `.pair/`), versioned with Git. **No** adopted cloud PM app (GitHub Projects, Linear, Jira, …) for now.
- **Convention:** team defines paths and naming; keep a single obvious place so agents and humans find work items. Update this section when a cloud or hosted PM tool is adopted.

## User story format

- **Use classic user stories** (Italian), **not** Given–When–Then as the **main** story text:
  - **Come** `<ruolo>` **voglio** `<obiettivo / capacità>` **affinché** / **così che** `<beneficio>`.
- **Given–When–Then** remains valid **only where useful** (e.g. acceptance scenarios, BDD tests, edge cases) — it is **not** the default template for writing the story title/body.

## Quality Gates

- `pnpm quality-gate` is the adopted project-level quality gate command.
- Quality gate includes: type checking (`ts:check`), testing (`test`), linting (`lint`), formatting (`prettier:fix`).
- **MVP scope:** **baseline pipeline only** — no extra required gates until recorded here and in the registry below.

### Custom Gate Registry

Custom gates run **after** the standard gates (Lint, Type Check, Test). Add rows to extend the quality pipeline. **Optional** for MVP; extend when needed (security, bundle size, a11y CI, etc.).

| Order | Gate       | Command             | Scope Key  | Required | Description                  |
| ----- | ---------- | ------------------- | ---------- | -------- | ---------------------------- |
| 1     | Formatting | `pnpm prettier:fix` | formatting | No       | Prettier auto-fix and verify |

## Merge Strategy

- **Method**: `squash` — all feature branch commits are squashed into a single commit on merge.
- **Commit format**: follows the [commit template](../../knowledge/guidelines/collaboration/templates/commit-template.md).
- **Branch cleanup**: feature branches are deleted after merge.
- **Merge confirmation**: `prompt` — `/pair-process-review` asks developer before merging. Set to `silent` to skip confirmation after recording preference via `/pair-capability-record-decision`.

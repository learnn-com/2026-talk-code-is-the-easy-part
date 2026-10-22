# Decision: local patch of pair mirrors for Filesystem PM in pair-loop

## Date

2026-10-22

## Status

Active — remove when upstream fix ships

## Category

Process Decision

## Context

pair 0.5.1 `pair-loop`/`implement-batch` hardcode GitHub issues: `root` must be numeric (`autonomy-policy.mjs`), prompts run `gh issue view`. This project's PM tool is Filesystem (ids `IN-01`, `01-01-001`), so `pnpm pair run --root IN-01` HALTs `automation-policy-unresolved` yet the CLI reports success.

## Decision

Patch the generated mirrors locally:
- `.claude/skills/pair-workflow-cycle/scripts/autonomy-policy.mjs`: `root` accepts safe ids, not only digits.
- `.claude/workflows/pair-loop.js`, `pair-implement-batch.js`: issue reads go through the PM tool adopted in `way-of-working.md` (Filesystem: story file). PRs stay on GitHub.

`pair update` overwrites these files: re-apply or drop once upstream supports adopted PM tools.

## Consequences

Mirror drift vs pair-cli 0.5.1. Upstream bug filed in foomakers/pair.

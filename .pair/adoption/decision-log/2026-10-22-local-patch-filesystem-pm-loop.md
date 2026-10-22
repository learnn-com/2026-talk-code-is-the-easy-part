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

## Addendum — `filter: *`

Reserved literal `*` in `## Autonomy` = no label filter (all cards in scope). `autonomy-policy.mjs` accepts it; `pair-loop.js` omits `--filter` from `/pair-next`. `tech/automation.md` uses `filter: *` and has no `## Eligibility`. The pair-cli driver (not patchable) prints a harmless warning "declares no `## Eligibility`: automation is off"; `## Eligibility: *` is rejected by the driver, so do not add it.

## Addendum 2 — real `filesystem` PM adapter

- New `scripts/host/filesystem.mjs` (copied in the 6 workflow skills): PM side over `.pair/adoption/product/backlog/` — state = folder + `**Status**:`, labels = `**Labels**:` line, comments = marker blocks under `## Automation Comments`, closeAndCascade story→epic. Code side stubs throw; PRs stay on GitHub.
- `way-of-working.md`: `pm-tool: filesystem`, `code-host: github`.
- `cycle-prepare.mjs`, `cycle-merge.mjs`: `--story` accepts card ids (`01-01-001`), not only digits.
- `automation.md`: `prepare: never`. Gate semantics: `always` = a human prepares (unattended run skips Drafts), `never` = never hold, refine autonomously. Likewise `merge: never` = merge without holding.

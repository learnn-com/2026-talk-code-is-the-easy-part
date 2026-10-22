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

## Addendum 3 — `merge: never` waives `pair-explicit-approval`

`cycle-merge.mjs` (`decideMerge`): with `mergeGate.mode === 'never'` the explicit-approval check is not required at any tier (KB default: required at `risk:red`/untagged). The project opted out of every human hold. `pair-review` = success, head pin, CI green and the tier gate set stay mandatory. Re-apply after `pair update`, or set `merge: when; has: <escalation labels>` to restore holds.

## Addendum 4 — fix rounds 3 → 25

`maxFixRounds` default raised 3 → 25 in `cycle-state.mjs` (`PIPELINE_DEFAULTS`, fallbacks) and `pair-implement-batch.js`: the cycle keeps fix↔re-review until `pair-review` = success instead of escalating after 3 rounds. Per-run override: `pipeline.maxFixRounds`.

## Addendum 5 — headless background ceiling

`claude -p` kills background workflows 10 min after the last turn ("Background tasks still running 10m…; stopping them"), cutting the loop mid-card. `.claude/settings.local.json` (per-machine, git-ignored) sets `env.CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0` (wait indefinitely). Another machine/CI must set it too. `--iteration-timeout` (default 1800 s) still bounds each iteration.

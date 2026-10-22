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

## Addendum 6 — blocked ≠ durable failure (`pair-loop.js`)

A card whose `failed-implement` reason names a prerequisite/dependency is `blocked`: not recorded as durable, excluded only until the next merge of the run, then re-driven. The selection prompt defines `merged` strictly (PR MERGED and story Done / under `completed/`; review, parked, failed, missing or unreadable ⇒ false). Custody (`red-snapshot.mjs`) already exempts a PURE merge of the base; only hand-resolved conflicts are flagged — keep conflict resolution to one parent's blob (`--ours`/`--theirs`) when syncing a PR branch.

## Addendum 7 — reviewer must not end its turn on a composed skill's output

Run of 2026-10-22 17:51: the `verify:r1` agent ran 5 review passes (tier red), took `/pair-capability-assess-security`'s text block as its final answer and ended its turn; the harness forced a StructuredOutput with `INCOMPLETE… handoff NOT published, pr-state conclude NOT run`. The cycle asked `verify:r1` again → `failed-resume` (durable for the run). `BOUNDED_COMMANDS` (shared stage prompt, `pair-implement-batch.js` + `cycle-dispatch.mjs`, kept byte-equal) now says a composed capability's output is an input, never the final answer. Re-running resumes at `verify` (no handoff to supersede).

## Addendum 8 — early-ended stages are re-dispatched (`pair-implement-batch.js`)

After `dispatchStage()`, a result whose `next.detail` starts with `INCOMPLETE` (or a single-reviewer `verify` that came back `partial`) is re-dispatched up to 2 times with a resume note (continue from the first step that did not run; do not redo published steps) before the cycle state sees it. Replaces the durable `failed-resume` for this flake. Upstream: #572 item 24(b).

## Addendum 9 — a card with no run directory is `fresh`, not halted

`pair-loop.js` cross-run resume: the live-state agent may now report `fresh` (no or empty `.pair/working/runs/story-<id>/<id>`): the cycle never recorded a handoff, so the audit's failure was not durable and the card re-enters. Before, such ids were omitted and fail-safe excluded — every card blocked by a past prerequisite failure stayed excluded forever.

## Addendum 10 — no driver watchdog by default (pnpm patch)

`patches/@foomakers__pair-cli@0.5.1.patch` (pnpm `patchedDependencies`, survives `pnpm install`): `DEFAULT_ITERATION_TIMEOUT_SECONDS` 1800 → 2000000 (~23 days, under the setTimeout cap) — `pnpm pair run …` is no longer killed after 30 min. `--iteration-timeout` still bounds a run when passed. `pair:loop` no longer needs the flag. Drop the patch when pair ships #572 item 18 (no default timeout / inactivity guard). The `--help` text still says "default 1800" (help string not patched).

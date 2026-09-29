# Decision: Scrum (1-week sprints), local story tracking, baseline quality gates

## Date

2026-04-12

## Status

Active

## Category

Process Decision

## Context

During bootstrap the team needed to fix **delivery rhythm**, **where work items live**, and **CI/quality scope** for the Learnn MVP (Type B).

## Decision

1. **Methodology:** **Scrum** with **one-week sprints** (planning, review, and retrospective cadence aligned to 1 week — exact ceremony set by the team).
2. **Project management:** **Filesystem-based** — work items live as **files in the repository** (e.g. `.pair/`), not in a separate PM SaaS. **No** cloud PM tool adopted for now; revisit if the team moves to GitHub Projects, Linear, Jira, etc.
3. **Quality gates:** **Baseline only** for the current phase — use the standard project pipeline (`pnpm quality-gate` / typecheck, test, lint, format per [way-of-working.md](../tech/way-of-working.md)); **no additional required custom gates** until explicitly added.
4. **User story wording:** **Classic form** — *Come \<ruolo\> voglio \<obiettivo\> affinché \<beneficio\>* — **not** Given–When–Then as the primary story format (GWT allowed only for scenarios/tests where it helps).

## Alternatives Considered

- **Kanban:** Not chosen — preference for timeboxed **Scrum** sprints.
- **GitHub Projects / Linear / Jira:** Deferred — **file-based PM in repo** chosen for now.
- **Extra CI gates** (bundle size, security scan, a11y automation): Deferred — **basic gates** only.
- **Given–When–Then as default story format:** Not chosen — team prefers **user-story** phrasing; GWT optional for scenarios.

## Consequences

- Ceremonies and sprint boundaries must fit **1 week**; backlog refinement should stay lightweight enough for the team size.
- PM automation skills that assume GitHub/Linear APIs need **file-based** or manual workflows until a hosted tool is adopted.
- Quality expectations grow with **explicit** ADL/ADR when new gates are added.

## Adoption Impact

- `adoption/tech/way-of-working.md` — methodology, sprint length, PM approach, quality gate scope, **user story format**.

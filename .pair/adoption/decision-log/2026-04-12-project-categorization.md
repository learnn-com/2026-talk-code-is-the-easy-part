# Decision: Project categorization — Type B (Startup / Scale-up)

## Date

2026-04-12

## Status

Active

## Category

Process Decision

## Context

During `/pair-process-bootstrap`, the project needed an explicit profile (Pet/PoC vs Startup/Scale-up vs Enterprise) to align process depth, adoption documents, and expectations. The PRD describes Learnn as a subscription product (€9,99/mese), MVP webapp in-house, cloud-backed, with commercial KPIs (e.g. ≥2.500 abbonati paganti) and a time-bound delivery window for Fase 1.

## Decision

The project is categorized as **Type B — Startup / Scale-up**: growing product, moderate-to-growing complexity (integrations, scale, roadmap), not a minimal Pet/PoC and not a large enterprise program with heavy compliance procurement as the default profile.

## Alternatives Considered

- **Type A (Pet/PoC)**: Rejected — business model, KPI volume, and product ambition go beyond a throwaway PoC.
- **Type C (Enterprise)**: Rejected for now — no evidence in the PRD of enterprise-only constraints (e.g. large mandated team, multi-tenant compliance programs) as the primary driver.

## Consequences

Bootstrap and planning assume **Type B**: balanced documentation, iterative delivery, scaling concerns without enterprise-only ceremony unless later requirements demand it.

## Adoption Impact

- `adoption/tech/way-of-working.md` — add **Project profile** with Type B reference.
- `adoption/tech/architecture.md` — add **Project context** noting Type B for scale/process expectations (placeholder until detailed architecture is filled).

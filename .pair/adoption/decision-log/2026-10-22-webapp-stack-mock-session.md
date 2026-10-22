# Decision: Webapp stack (Vite, TypeScript, Vitest, React Router) and mock session in localStorage

## Date

2026-10-22

## Status

Active

## Category

Library Choice

## Context

Story 01-01-001 creates the webapp scaffold. `tech-stack.md` leaves React version and bundler to the webapp package; the real session strategy is left to a future Strapi ADR. AC6 needs a session that survives reload.

## Decision

1. **Workspace:** pnpm workspace `apps/webapp`; root `quality-gate` = `ts:check`, `test`, `lint`, `prettier:fix`.
2. **Stack:** Vite + React 19 + TypeScript (6.0, capped by the typescript-eslint peer range) + Tailwind 4 + shadcn/ui primitives; routing with `react-router-dom` (data router, guards with `replace` redirects).
3. **Tests:** Vitest + Testing Library (jsdom).
4. **Session (mock only):** opaque token stored in `localStorage` (`learnn.session`) behind the `AuthService` port; unreadable or malformed value = no session. Demo credentials live in the mock and the README, not secrets.
5. **Credentials error:** one message for unknown email and wrong password (no user enumeration).

## Alternatives Considered

- **Next.js / CRA:** Not chosen — SPA deployed statically on S3 + CloudFront, no SSR needed.
- **Jest:** Not chosen — Vitest shares the Vite pipeline.
- **sessionStorage / in-memory session:** Not chosen — does not survive reload (AC6).
- **httpOnly cookie:** Needs a real backend; deferred to the Strapi session ADR.

## Consequences

- `localStorage` token is XSS-exposed: acceptable for the mock only; the real strategy must be decided with Strapi and replace the mock behind `AuthService`.
- CloudFront needs an SPA fallback (403/404 to `/index.html`) for client-side routes.

## Adoption Impact

- `adoption/tech/tech-stack.md` — frontend: bundler, language, router, test stack.

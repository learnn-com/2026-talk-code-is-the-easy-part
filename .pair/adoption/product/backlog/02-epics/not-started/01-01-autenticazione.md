# Epic: Autenticazione

## Epic Information

**Epic ID:** EP-01-01  
**Initiative:** [IN-01 MVP webapp Learnn — Fase 1](../../01-initiatives/2026/mvp-webapp-fase-1.md)  
**Theme:** Membership (bounded context) — PRD Epic 1 (US 1.1)  
**Epic Owner:** Product Team (Omar, Gianluca)  
**Status:** Planning (Draft)  
**Priority:** P0  
**Target Release:** Sprint 1 (scope mock) → Fase 1

## Epic Statement

**Come** abbonato Learnn  
**voglio** entrare nell'app con le mie credenziali e uscirne quando voglio  
**così che** solo gli abbonati accedano ai contenuti e il mio account resti protetto

### Epic Context

Sottodominio Identity & Subscription. Sprint 1: login email + password e logout su servizio auth mock. Out of scope: reset password, provisioning da checkout, rate limiting (backend reale).

## Epic Breakdown

### User Stories (High-Level)

#### Must-Have Stories (P0)

- [ ] [01-01-001] Login con email e password
- [ ] [01-01-002] Avatar, menu e logout

### Epic Acceptance Criteria

- Lo stakeholder può entrare con un utente demo, vedere l'errore con credenziali errate e uscire con il logout.

## Technical Considerations

- Servizio mock dietro interfaccia del bounded context **Membership**, sostituibile con Strapi REST senza modificare la UI.
- DoD sprint: mobile-first (360px senza scroll orizzontale), WCAG 2.1 AA, `pnpm quality-gate` verde, build statica deployabile su S3 + CloudFront.

## Design & User Experience

- Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).
- Riferimenti visivi: [design-references](../../../design-references/README.md).

## Appendix

### Related Documentation

- [PRD](../../../PRD.md) · Brainstorm handoff `.pair/working/brainstorm-mvp-sprint-1-login-home.md`

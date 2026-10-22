# Epic: Notifiche in-app

## Epic Information

**Epic ID:** EP-01-03  
**Initiative:** [IN-01 MVP webapp Learnn — Fase 1](../../01-initiatives/2026/mvp-webapp-fase-1.md)  
**Theme:** Communications (bounded context) — PRD Epic 5 (US 5.1 AC2)  
**Epic Owner:** Product Team (Omar, Gianluca)  
**Status:** Planning (Draft)  
**Priority:** P0  
**Target Release:** Sprint 1 (scope mock) → Fase 1

## Epic Statement

**Come** abbonato Learnn  
**voglio** vedere dalla campanella le notifiche della sessione  
**così che** non perda le novità mentre uso l'app

### Epic Context

Sottodominio Notifications. Sprint 1: lista notifiche mock di sessione, non persistita (PRD P0.10). Out of scope: push reali / OneSignal, deep link verso l'overview.

## Epic Breakdown

### User Stories (High-Level)

#### Must-Have Stories (P0)

- [ ] [01-03-001] Campanella e notifiche in-app

### Epic Acceptance Criteria

- Lo stakeholder vede il badge delle non lette, apre il pannello, il badge si azzera e può segnare una notifica come letta.

## Technical Considerations

- Servizio mock dietro interfaccia del bounded context **Communications**, sostituibile con Strapi REST senza modificare la UI.
- DoD sprint: mobile-first (360px senza scroll orizzontale), WCAG 2.1 AA, `pnpm quality-gate` verde, build statica deployabile su S3 + CloudFront.

## Design & User Experience

- Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).
- Riferimenti visivi: [design-references](../../../design-references/README.md).

## Appendix

### Related Documentation

- [PRD](../../../PRD.md) · Brainstorm handoff `.pair/working/brainstorm-mvp-sprint-1-login-home.md`

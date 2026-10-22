# Epic: Home e discovery

## Epic Information

**Epic ID:** EP-01-02  
**Initiative:** [IN-01 MVP webapp Learnn — Fase 1](../../01-initiatives/2026/mvp-webapp-fase-1.md)  
**Theme:** Catalog & Publishing (bounded context) — PRD Epic 2 (US 2.1)  
**Epic Owner:** Product Team (Omar, Gianluca)  
**Status:** Planning (Draft)  
**Priority:** P0  
**Target Release:** Sprint 1 (scope mock) → Fase 1

## Epic Statement

**Come** abbonato Learnn  
**voglio** una Home in stile streaming con corsi, webinar e contenuti per tema  
**così che** trovi subito cosa guardare, come in un servizio di intrattenimento

### Epic Context

Sottodominio Catalog & Discovery. Sprint 1: slider dei contenuti a puntate e slider dei contenuti singoli per tema, dati mock presi dai mockup. Categoria = Tema (PRD). Out of scope: tap sulle card / overview (US 2.1 AC3), footer fisso, 'Vedi tutto'.

## Epic Breakdown

### User Stories (High-Level)

#### Must-Have Stories (P0)

- [ ] [01-02-001] Home: slider "Corsi e webinar"
- [ ] [01-02-002] Home: slider per tema

### Epic Acceptance Criteria

- Dopo il login lo stakeholder vede una Home con lo slider 'Corsi e webinar' e uno slider per ogni tema, card 4:5, stati di caricamento ed errore gestiti.

## Technical Considerations

- Servizio mock dietro interfaccia del bounded context **Catalog & Publishing**, sostituibile con Strapi REST senza modificare la UI.
- DoD sprint: mobile-first (360px senza scroll orizzontale), WCAG 2.1 AA, `pnpm quality-gate` verde, build statica deployabile su S3 + CloudFront.

## Design & User Experience

- Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).
- Riferimenti visivi: [design-references](../../../design-references/README.md).

## Appendix

### Related Documentation

- [PRD](../../../PRD.md) · Brainstorm handoff `.pair/working/brainstorm-mvp-sprint-1-login-home.md`

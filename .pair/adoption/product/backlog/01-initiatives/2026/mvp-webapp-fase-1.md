# Initiative: MVP webapp Learnn — Fase 1 in 90 giorni

## Initiative Information

**Initiative ID:** IN-01  
**Initiative Name:** MVP webapp Learnn — Fase 1  
**Initiative Owner:** Product Team (Omar, Gianluca)  
**Status:** Active  
**Priority:** Critical (P0)  
**Timeline:** 90 giorni da avvio sprint 1 (2026-10-06)  
**Quarter/Year:** Q4 2026 – Q1 2027

## Strategic Context

### Business Strategy Alignment

Coincide con l'obiettivo di prodotto del [PRD](../../../PRD.md) §4 Primary Goal 2: rilasciare l'MVP webapp mobile-first con le feature P0 di Fase 1.

### Strategic Objective

**We believe that** una webapp mobile-first in stile streaming, con le feature P0 di Fase 1  
**Will result in** abbonati Tier 1 che usano Learnn con continuità  
**As measured by** abbonati paganti (target ≥ 2.500), churn, sessioni e contenuti avviati (PRD §4 KPIs)

## Problem Statement & Opportunity

### Problem Statement

Vedi PRD §3: serve un'esperienza di fruizione con attrito minimo e qualità percepita all'altezza del prezzo, sotto pieno controllo di prodotto.

## Initiative Breakdown

### Epic Portfolio

#### High-Priority Epics (Must-Have)

- [ ] **01-01 Autenticazione** — entrare e uscire dall'app (sprint 1: login + logout, servizi mock)
- [ ] **01-02 Home e discovery** — Home in stile streaming con il catalogo (sprint 1: slider a puntate + slider per tema, dati mock)
- [ ] **01-03 Notifiche in-app** — novità della sessione dalla campanella (sprint 1: lista mock)

Le altre aree P0 di Fase 1 (area utente, fruizione, ricerca, My Learnn, progressi, note, coming soon) verranno aperte da discovery successive.

### Cross-Epic Dependencies

Lo scaffold della webapp nasce con la storia 01-01-001 (Login): tutte le altre storie dello sprint 1 dipendono da essa.

## Timeline & Milestones

### Initiative Phases

- **Sprint 1 (1 settimana):** prototipo production ready di Login + Home con servizi mock.
- **Sprint successivi:** restanti P0 di Fase 1, integrazione Strapi reale, deploy AWS.

## Risk Management

### Execution Risks

| Rischio | Mitigazione |
| ------- | ----------- |
| Scope Fase 1 troppo ampio per 90 giorni | Backlog Fase 1 congelato come da PRD; out of scope espliciti per sprint |
| Mock divergenti dalle API reali | Servizi mock dietro interfacce per bounded context, sostituibili con Strapi REST |

## Source

Brainstorm 2026-10-06 (Omar, Gianluca) — handoff `.pair/working/brainstorm-mvp-sprint-1-login-home.md`.

## Title

**[Communications] L'abbonato deve vedere dalla campanella le notifiche della sessione**

## Story Statement

**Come** abbonato Learnn **voglio** vedere dalla campanella le notifiche della sessione **così che** non perda le novità mentre uso l'app.

**Where**: webapp — header della Home

## Epic Context

**Parent Epic**: [EP-01-03 Notifiche in-app](../../02-epics/not-started/01-03-notifiche-in-app.md)
**Status**: Todo (Ready)
**Labels**: risk:yellow
**Priority**: P0 (Must-Have)
**PRD**: P0.10, US 5.1 AC2 (lista non persistente in sessione)

## Classification

`risk:yellow` · `cost:green`

<details>
<summary>Matrix — per dimension</summary>

| Dimension                  | Tier   | Source                                       | Note                                                      |
| -------------------------- | ------ | -------------------------------------------- | --------------------------------------------------------- |
| Service/domain criticality | yellow | KB default (no Criticality Table)            |                                                           |
| Change/diff risk           | yellow | story scope                                  | nuovi componenti UI + servizio mock, nessuno schema/infra |
| Business impact            | yellow | subdomain `notifications` = supporting       |                                                           |
| Security relevance         | green  | path heuristic                               | solo dati mock, nessun input utente né credenziali        |
| Coupling balance           | green  | `boundedcontext/communications.md`           | via interfaccia `Notifications`, stesso team/repo         |

Confidence: high

</details>

## Acceptance Criteria

### Functional Requirements

1. **Given** ci sono notifiche non lette **When** carico la Home **Then** l'header mostra la campanella con un badge col numero di non lette; **Given** non ce ne sono **Then** il badge non compare.
2. **Given** vedo la campanella **When** la tocco **Then** si apre un pannello (sheet su mobile, dropdown su desktop) con 3–5 notifiche mock, ognuna con titolo, testo, data relativa e stato letta/non letta.
3. **Given** il pannello si apre **When** è visibile **Then** il badge si azzera, mentre le singole notifiche restano non lette finché non le tocco.
4. **Given** il pannello è aperto **When** tocco una notifica **Then** diventa letta e non porta a nessuna schermata.
5. **Given** la lista è vuota **When** apro il pannello **Then** vedo "Nessuna notifica".
6. **Given** ho letto notifiche **When** ricarico la pagina **Then** le notifiche mock ripartono dallo stato iniziale (non salvate).

### Business Rules

- Servizio mock dietro interfaccia `Notifications` (Communications); payload con `courseId` già presente per il deep link futuro, non usato dalla UI.
- Notifiche mock citano contenuti del dataset mock dei mockup.
- Lista solo in memoria: nessuna persistenza (PRD US 5.1 AC2).
- Badge = numero di non lette all'ultimo istante prima dell'apertura; azzerato all'apertura, non all'apertura di ogni notifica.

### Edge Cases and Error Handling

- **Invalid Input**: nessun input utente.
- **System Errors**: servizio mock che fallisce = campanella senza badge e pannello "Nessuna notifica"; l'header resta visibile.
- **Boundary Conditions**: 360px senza scroll orizzontale; badge con 10+ non lette mostra "9+".
- **Exceptional Scenarios**: ricarica col pannello aperto = pannello chiuso, stato iniziale.

## Definition of Done Checklist

- [ ] AC 1–6 implementati e verificati
- [ ] Servizio mock dietro interfaccia `Notifications` (Communications)
- [ ] UI demo-ready per sprint review
- [ ] Mobile-first: 360px senza scroll orizzontale; desktop usabile
- [ ] WCAG 2.1 AA (label, focus visibile, contrasto, tastiera)
- [ ] Test automatici verdi; `pnpm quality-gate` verde
- [ ] Build statica deployabile su S3 + CloudFront
- [ ] Code review e merge

## Story Sizing and Sprint Readiness

**Final Story Points**: M (3)
**Confidence Level**: Medium
**Sizing Justification**: servizio mock, stato in sessione, campanella+badge, pannello responsive (sheet/dropdown), test; nessuno scaffold (da 01-01-001).
**Sprint Fit Assessment**: sì, sprint di 1 settimana. Nessuno split.

## Dependencies and Coordination

**Prerequisite Stories**: 01-01-001 (scaffold, Home, header; PR aperta).
**Dependent Stories**: nessuna.
**Shared Components**: header Home (condiviso con 01-01-002 avatar), `Notifications` service.
**External Dependencies**: nessuna (OneSignal/Strapi non cablati).

## Validation and Testing Strategy

**Testing Methods**: Vitest + Testing Library; test di componente per AC1, 3, 5; test d'integrazione header+pannello per AC2, 4; test servizio/provider per AC6 (stato iniziale a ogni mount).
**Test Data Requirements**: dataset JSON mock 3–5 notifiche; helper per lista vuota.
**Success Metrics**: demo in sprint review di badge, apertura pannello + azzeramento, lettura notifica, reload.

## Notes and Additional Context

**Refinement Session Insights**: riferimento visivo badge rosso in [header.png](../../../design-references/header.png); dark theme, sfondo nero, CTA bianche ([ux-ui.md](../../../../tech/ux-ui.md)).
Fuori scope: push reali / OneSignal, deep link verso l'overview, storico persistente, "segna tutte come lette", link Home / My Learnn del mockup.
Prepared autonomously under prepare: never (adoption) — ADR-028

## Technical Analysis

### Implementation Approach

**Technical Strategy**: React + Tailwind + shadcn/ui (per tech-stack.md, ux-ui.md); interfaccia `NotificationService` (Communications) con mock sostituibile da Strapi/OneSignal (per communications.md, ADR strapi-headless-cms-backend); stato in memoria in un `NotificationsProvider` (non persistito, per PRD US 5.1 AC2); pannello con Sheet (mobile) e Popover/DropdownMenu (desktop) shadcn.
**Key Components**: `NotificationService` + mock JSON, `NotificationsProvider` (lista, non lette, `markOpened`, `markRead`), `NotificationBell` (badge), `NotificationPanel`, integrazione in header Home.
**Data Flow**: provider al mount → `NotificationService.list` → stato in memoria → campanella/pannello; apertura → badge 0; tap → notifica letta.
**Integration Points**: nessuno oggi; futuro Strapi/OneSignal dietro la stessa interfaccia.
**Design**: not required — riferimento visivo design-references/header.png

### Technical Requirements

- Mobile-first, WCAG 2.1 AA: campanella con nome accessibile che include il numero di non lette, pannello navigabile da tastiera con focus trap ed Esc, focus visibile, contrasto su nero.
- Build statica per S3 + CloudFront.

### Technical Risks and Mitigation

| Risk                                              | Impact | Probability | Mitigation Strategy                                     |
| ------------------------------------------------- | ------ | ----------- | ------------------------------------------------------- |
| Interfaccia non adatta allo swap con Strapi/push  | Medium | Medium      | Tipi di dominio, nessun payload provider nella UI       |
| Conflitto sul header con 01-01-002 (avatar)       | Medium | Medium      | Campanella come componente isolato; rebase su 01-01-001 |
| Dipendenza da scaffold non ancora mergiato        | Medium | Medium      | Rebase su 01-01-001 prima dell'implementazione          |

## Task Breakdown

- [ ] **T-1**: Servizio `Notifications` + mock JSON + `NotificationsProvider` (stato in memoria)
- [ ] **T-2**: `NotificationBell` con badge (0 = nascosto, 9+)
- [ ] **T-3**: `NotificationPanel` (sheet mobile / dropdown desktop, lettura, vuoto)
- [ ] **T-4**: Integrazione in header Home + a11y, 360px, build statica

### Dependency Graph

    T-1 ──┬── T-2 ──┐
          └── T-3 ──┴── T-4

### AC Coverage

| AC                                   | Tasks      |
| ------------------------------------ | ---------- |
| AC-1 (campanella e badge)            | T-1, T-2   |
| AC-2 (pannello con notifiche)        | T-1, T-3   |
| AC-3 (badge azzerato all'apertura)   | T-1, T-2, T-3 |
| AC-4 (tap = letta, nessuna schermata)| T-1, T-3   |
| AC-5 (lista vuota)                   | T-3        |
| AC-6 (reload = stato iniziale)       | T-1        |

---

### T-1: Servizio Notifications, mock e provider

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Communications

**Type:** Feature Implementation

**Description:** Interfaccia `NotificationService.list()` con tipi di dominio (id, titolo, testo, data, `courseId`); mock con 4 notifiche JSON che citano contenuti del dataset mock; `NotificationsProvider` con lista in memoria, `unreadCount`/badge, `markOpened` (azzera badge), `markRead(id)`; errore del servizio = lista vuota.

**Acceptance Criteria:**

- Test unitari: caricamento, badge azzerato all'apertura senza leggere le notifiche, `markRead`, stato iniziale a ogni mount, errore = lista vuota.

**Implementation Approach:** `apps/webapp/src/communications/{notification-service,mock-notification-service,notifications-provider}.ts(x)`, `notifications.json`. Standard: tech-stack.md, communications.md.

**Dependencies:** 01-01-001 (scaffold).

### T-2: NotificationBell

**Priority:** P0 | **Estimated Hours:** 3h | **Bounded Context:** Communications

**Type:** Feature Implementation

**Description:** Pulsante campanella con badge rosso col numero di non lette ("9+" oltre 9), nascosto a 0; nome accessibile con il numero di non lette; focus visibile.

**Acceptance Criteria:**

- Test componente per AC1, AC3 (badge a 0 dopo apertura), "9+".

**Implementation Approach:** `apps/webapp/src/communications/notification-bell.tsx`, shadcn/Tailwind. Riferimento: header.png.

**Dependencies:** T-1.

### T-3: NotificationPanel

**Priority:** P0 | **Estimated Hours:** 5h | **Bounded Context:** Communications

**Type:** Feature Implementation

**Description:** Pannello Sheet (mobile) / dropdown (desktop, `md`); elenco con titolo, testo, data relativa, stato letta/non letta; tap = letta, nessuna navigazione; "Nessuna notifica" a lista vuota; apertura chiama `markOpened`; Esc e focus trap.

**Acceptance Criteria:**

- Test integrazione bell+pannello per AC2, AC3, AC4, AC5.

**Implementation Approach:** `apps/webapp/src/communications/notification-panel.tsx`, componenti shadcn Sheet/Popover.

**Dependencies:** T-1.

### T-4: Integrazione header e rifinitura

**Priority:** P1 | **Estimated Hours:** 3h | **Bounded Context:** Communications

**Type:** Configuration

**Description:** Campanella nell'header Home dentro `NotificationsProvider`; verifica 360px senza scroll orizzontale, tastiera, contrasto su nero; build statica.

**Acceptance Criteria:**

- Test Home: campanella presente, reload = stato iniziale (AC6); DoD soddisfatta; `pnpm quality-gate` verde; `pnpm --filter webapp build` ok.

**Implementation Approach:** `apps/webapp/src/{app,home-page}.tsx` e header; `apps/webapp/README.md`.

**Dependencies:** T-2, T-3.

## Assumptions

- **Notifiche mock**: 4, titoli/testi in italiano che citano contenuti del dataset mock dei mockup, date relative fisse rispetto a "adesso". Evidenza: AC2 (3–5), Initial Scope. Ribaltare: fornire dataset.
- **Pannello**: sheet su mobile e dropdown su desktop con breakpoint `md` di Tailwind, componenti shadcn. Evidenza: AC2, ux-ui.md. Ribaltare: indicare altro breakpoint.
- **Azzeramento badge**: all'apertura il badge va a 0 ma le notifiche restano "non lette" nel pannello finché toccate. Evidenza: AC3 e AC4 distinguono i due effetti.
- **Stato**: provider in memoria, ricreato a ogni reload. Evidenza: AC6, PRD US 5.1 AC2.
- **Badge 10+**: mostra "9+". Evidenza: nessun AC; scelta UI minima.
- **Errore servizio**: nessun badge e "Nessuna notifica", senza messaggio d'errore. Evidenza: nessun AC; funzione secondaria non bloccante.
- **Test**: Vitest + Testing Library. Evidenza: 01-01-001 e quality gate.

---

**Refinement Completed By**: AI (autonomo, prepare: never)
**Refinement Date**: 2026-10-22
**Review and Approval**: da confermare da un umano (vedi Assumptions)

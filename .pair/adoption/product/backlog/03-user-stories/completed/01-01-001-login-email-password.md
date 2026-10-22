## Title

**[Membership] L'abbonato deve poter accedere alla webapp con email e password**

## Story Statement

**Come** abbonato Learnn **voglio** accedere alla webapp con email e password **così che** solo gli abbonati usino i contenuti.

**Where**: webapp — schermata Login → Home

## Epic Context

**Parent Epic**: [EP-01-01 Autenticazione](../../02-epics/not-started/01-01-autenticazione.md)
**Status**: Done
**Labels**: risk:red
**Priority**: P0 (Must-Have)
**PRD**: US 1.1 AC1

## Classification

`risk:red` · `cost:green`

<details>
<summary>Matrix — per dimension</summary>

| Dimension                  | Tier | Source                                                         | Note                                       |
| -------------------------- | ---- | -------------------------------------------------------------- | ------------------------------------------ |
| Service/domain criticality | yellow | KB default (no Criticality Table)                            |                                            |
| Change/diff risk           | yellow | story scope                                                  | scaffold + più moduli, nessuno schema/infra |
| Business impact            | red  | subdomain `identity-subscription` = core                       |                                            |
| Security relevance         | red  | path heuristic                                                 | authn, gestione credenziali/sessione       |
| Coupling balance           | green | `boundedcontext/membership.md`                                | accoppiamento via interfaccia, stesso team/repo |

Confidence: high

</details>

## Acceptance Criteria

### Functional Requirements

1. **Given** sono sul Login **When** la schermata si carica **Then** vedo email, password (mascherata, icona "mostra") e "Accedi"; "Password dimenticata?" assente.
2. **Given** campi vuoti o email non valida **When** premo "Accedi" **Then** errore sotto il campo e nessuna chiamata al servizio.
3. **Given** verifica in corso **When** attendo **Then** "Accedi" mostra il caricamento ed è disabilitato (no doppio invio).
4. **Given** credenziali errate **When** invio **Then** "Email o password non corrette"; password svuotata, email conservata.
5. **Given** credenziali di un utente demo **When** invio **Then** arrivo alla Home con header e logo Learnn.
6. **Given** sono loggato **When** ricarico la pagina **Then** resto loggato.
7. **Given** nessuna sessione **When** apro la Home **Then** vado al Login; **Given** sessione attiva **When** apro il Login **Then** vado alla Home.

### Business Rules

- Email valida = formato `utente@dominio.tld`; password obbligatoria.
- Stesso messaggio per email sconosciuta e password errata (no user enumeration).
- 2 utenti demo documentati nel README; latenza simulata.

### Edge Cases and Error Handling

- **Invalid Input**: errore per campo, focus sul primo campo errato.
- **System Errors**: sessione persistita illeggibile/corrotta = nessuna sessione, torno al Login.
- **Boundary Conditions**: 360px senza scroll orizzontale.
- **Exceptional Scenarios**: "indietro" dalla Home dopo login non riporta al Login.

## Definition of Done Checklist

- [x] AC 1–7 implementati e verificati
- [x] Servizio mock dietro interfaccia Membership
- [x] UI demo-ready per sprint review
- [x] Mobile-first: 360px senza scroll orizzontale; desktop usabile
- [x] WCAG 2.1 AA (label, focus visibile, contrasto, tastiera)
- [x] Test automatici verdi; `pnpm quality-gate` verde
- [x] Build statica deployabile su S3 + CloudFront
- [x] README con utenti demo
- [x] Code review e merge

## Story Sizing and Sprint Readiness

**Final Story Points**: L (5)
**Confidence Level**: Medium
**Sizing Justification**: include scaffold webapp, routing protetto, servizio mock e test; UI minima (2 schermate).
**Sprint Fit Assessment**: sì, sprint di 1 settimana; header Home solo logo tiene lo scope stretto. Nessuno split.

## Dependencies and Coordination

**Prerequisite Stories**: nessuna.
**Dependent Stories**: 01-01-002 e storie EP-01-02 / EP-01-03 (usano scaffold e sessione).
**Shared Components**: AuthService (interfaccia Membership), layout Home.
**External Dependencies**: nessuna (Strapi non cablato).

## Validation and Testing Strategy

**Testing Methods**: Vitest + Testing Library; test di componente per AC1–4, test d'integrazione a livello router per AC5–7.
**Test Data Requirements**: 2 utenti demo del mock.
**Success Metrics**: demo in sprint review dei 3 flussi (errore, login, reload).

## Notes and Additional Context

**Refinement Session Insights**: UI di riferimento [login-screen.png](../../../design-references/login-screen.png); dark theme, sfondo nero, CTA bianche ([ux-ui.md](../../../../tech/ux-ui.md)).
Fuori scope: reset password, provisioning da checkout, rate limiting, deploy AWS e CI/CD, avatar e campanella.
Prepared autonomously under prepare: never (adoption) — ADR-028

## Technical Analysis

### Implementation Approach

**Technical Strategy**: SPA React + Tailwind + shadcn/ui (per tech-stack.md, ux-ui.md); react-router con rotte protette e solo-pubbliche; `AuthProvider` su interfaccia `AuthService` (Membership) con implementazione mock sostituibile da Strapi Users & Permissions (per ADR strapi-headless-cms-backend, membership.md).
**Key Components**: `AuthService` + mock, `AuthProvider`, `ProtectedRoute`/`PublicOnlyRoute`, `LoginPage`, `HomePage` + header.
**Data Flow**: form → `AuthService.login` → sessione (token) persistita → router.
**Integration Points**: nessuno oggi; futuro Strapi REST dietro la stessa interfaccia.
**Design**: not required — riferimento visivo design-references/login-screen.png

### Technical Requirements

- Mobile-first, WCAG 2.1 AA (critical flow), build statica per S3 + CloudFront.
- Script `ts:check`, `test`, `lint`, `prettier:fix` e `quality-gate` definiti.

### Technical Risks and Mitigation

| Risk                                         | Impact | Probability | Mitigation Strategy                                          |
| -------------------------------------------- | ------ | ----------- | ------------------------------------------------------------ |
| Interfaccia non adatta allo swap con Strapi  | Medium | Medium      | Tipi di dominio, nessun payload Strapi nella UI              |
| Token in localStorage (XSS) e demo in bundle | High   | Low         | Solo mock; strategia sessione reale decisa con Strapi (ADR) |
| Scaffold gonfia la storia                    | Medium | Medium      | Header solo logo; niente deploy/CI                           |

## Task Breakdown

- [ ] **T-1**: Scaffold webapp (Vite, React, TS, Tailwind, shadcn/ui dark, script gate)
- [ ] **T-2**: `AuthService` + mock + sessione persistita + `AuthProvider`
- [ ] **T-3**: `LoginPage` (form, validazione, mostra password, loading, errore)
- [ ] **T-4**: Routing protetto + `HomePage` con header logo
- [ ] **T-5**: README demo, a11y/360px, build statica

### Dependency Graph

    T-1 ──┬── T-2 ──┐
          └── T-3 ──┴── T-4 ── T-5

### AC Coverage

| AC                       | Tasks      |
| ------------------------ | ---------- |
| AC-1 (campi, no link)    | T-3        |
| AC-2 (validazione)       | T-3        |
| AC-3 (loading)           | T-2, T-3   |
| AC-4 (credenziali errate)| T-2, T-3   |
| AC-5 (Home + logo)       | T-2, T-4   |
| AC-6 (reload)            | T-2, T-4   |
| AC-7 (redirect)          | T-4        |

---

### T-1: Scaffold webapp

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Membership

**Type:** Configuration

**Description:** pnpm workspace `apps/webapp`, Vite + React + TS, Tailwind, shadcn/ui, tema dark nero, Vitest + Testing Library; script `ts:check`, `test`, `lint`, `prettier:fix`; `quality-gate` alla radice.

**Acceptance Criteria:**

- `pnpm quality-gate` verde su app vuota; `pnpm --filter webapp build` produce statico.

**Implementation Approach:** `apps/webapp/*`, `package.json` radice, `pnpm-workspace.yaml`. Standard: tech-stack.md, ux-ui.md.

**Dependencies:** nessuna.

### T-2: AuthService mock e sessione

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Membership

**Type:** Feature Implementation

**Description:** Interfaccia `AuthService` (`login`, `getSession`, `logout`) con tipi di dominio; mock con 2 utenti demo, latenza ~600 ms, errore unico; token in `localStorage`, sessione corrotta = assente; `AuthProvider`.

**Acceptance Criteria:**

- Test unitari: login ok/ko, persistenza, sessione corrotta.

**Implementation Approach:** `apps/webapp/src/membership/{auth-service,mock-auth-service,auth-provider}.ts(x)`.

**Dependencies:** T-1.

### T-3: LoginPage

**Priority:** P0 | **Estimated Hours:** 6h | **Bounded Context:** Membership

**Type:** Feature Implementation

**Description:** Form email + password (mostra/nascondi con nome accessibile), validazione senza chiamata, bottone con caricamento e disabilitato, errore credenziali con password svuotata, no "Password dimenticata?". Mobile-first, WCAG AA.

**Acceptance Criteria:**

- Test componente per AC1–4; focus visibile, label, 360px.

**Implementation Approach:** `apps/webapp/src/membership/login-page.tsx`, componenti shadcn.

**Dependencies:** T-1; usa `AuthService` (T-2) via provider.

### T-4: Routing e Home

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Membership

**Type:** Feature Implementation

**Description:** `ProtectedRoute` / `PublicOnlyRoute`; Home con solo logo Learnn; redirect dopo login senza "indietro" al Login.

**Acceptance Criteria:**

- Test d'integrazione router per AC5–7.

**Implementation Approach:** `apps/webapp/src/{app,routes}.tsx`, `home-page.tsx`, asset logo.

**Dependencies:** T-2, T-3.

### T-5: README e rifinitura

**Priority:** P1 | **Estimated Hours:** 2h | **Bounded Context:** Membership

**Type:** Documentation

**Description:** README con avvio, utenti demo, nota "mock"; verifica a 360px, tastiera e contrasto; build statica.

**Acceptance Criteria:**

- DoD checklist soddisfatta; `pnpm quality-gate` verde.

**Implementation Approach:** `README.md`, `apps/webapp/README.md`.

**Dependencies:** T-4.

## Assumptions

- **Bundler/lingua**: Vite + TypeScript. Evidenza: tech-stack.md rimanda la scelta al package webapp. Per ribaltare: modificare prima di plan-tasks.
- **Posizione**: pnpm workspace `apps/webapp`, `quality-gate` alla radice. Evidenza: CLAUDE.md usa `pnpm --filter`; package.json radice senza workspace. Ribaltare: indicare altro path.
- **Sessione**: token mock in `localStorage`. Evidenza: AC6 richiede persistenza al reload; strategia reale "per ADR" non ancora decisa (membership.md).
- **Validazione email**: controllo di formato lato client; messaggi in italiano. Evidenza: AC2.
- **Errore credenziali**: messaggio unico per email sconosciuta e password errata. Evidenza: AC4, sicurezza.
- **Latenza mock**: fissa ~600 ms, configurabile nei test. Evidenza: scope "latenza simulata", AC3.
- **Test**: Vitest + Testing Library. Evidenza: gate richiede `test`; nessuno stack adottato. Ribaltare: indicarne un altro.
- **Utenti demo**: 2, credenziali nel README (non segreti). Evidenza: Initial Scope.

---

**Refinement Completed By**: AI (autonomo, prepare: never)
**Refinement Date**: 2026-10-22
**Review and Approval**: da confermare da un umano (vedi Assumptions)

## Activity Log

- **2026-10-22** — PR: https://github.com/learnn-com/2026-talk-code-is-the-easy-part/pull/4

## Automation Comments

<!-- pair-merge-park:PR#4 -->
PR #4 is review-approved but was **not** merged automatically — it awaits human action:

- `ci-not-green` — CI checks not green on head 5a05a3185b70976656602384a92be83f83ec2fe6: GitGuardian Security Checks=failure — never merged over a failing or pending build
<!-- /pair-comment -->

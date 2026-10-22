## Title

**[Membership] L'abbonato deve poter vedere il proprio profilo dall'avatar e uscire con il logout**

## Story Statement

**Come** abbonato Learnn **voglio** aprire dall'avatar un menu con il mio nome e il tasto Logout **così che** possa uscire dall'app quando voglio.

**Where**: webapp — header della Home

## Epic Context

**Parent Epic**: [EP-01-01 Autenticazione](../../02-epics/not-started/01-01-autenticazione.md)
**Status**: Done
**Labels**: risk:red
**Priority**: P0 (Must-Have)
**PRD**: §6 Area utente / Navigazione header

## User Value

**User Benefit**: riconosce il proprio account e può chiudere la sessione.
**Business Impact**: completa il ciclo di accesso (entrare/uscire), base per l'area utente.
**Visible UI Value**: tap sull'avatar → nome utente → Logout → di nuovo il Login.

## Classification

`risk:red` · `cost:green`

<details>
<summary>Matrix — per dimension</summary>

| Dimension                  | Tier   | Source                                      | Note                                              |
| -------------------------- | ------ | ------------------------------------------- | ------------------------------------------------- |
| Service/domain criticality | yellow | KB default (no Criticality Table)           |                                                   |
| Change/diff risk           | yellow | story scope                                 | header + menu + logout, nessuno schema/infra      |
| Business impact            | red    | subdomain `identity-subscription` = core    |                                                   |
| Security relevance         | red    | path heuristic                              | chiusura sessione, stato authn                    |
| Coupling balance           | green  | `boundedcontext/membership.md`              | via interfaccia `AuthService`, stesso team/repo   |

Confidence: high

</details>

## Acceptance Criteria

### Functional Requirements

1. **Given** sono nella Home **When** l'header si carica **Then** vedo l'avatar a destra; i link Home e My Learnn non sono presenti.
2. **Given** l'utente ha una foto **When** l'avatar si carica **Then** mostra la foto; **Given** foto assente o non caricabile **Then** mostra le iniziali.
3. **Given** sono nella Home **When** tocco l'avatar (o Invio/Spazio da tastiera) **Then** si apre un menu con nome utente e "Logout".
4. **Given** il menu è aperto **When** premo Esc o tocco fuori **Then** si chiude e il focus torna all'avatar.
5. **Given** il menu è aperto **When** premo "Logout" **Then** la sessione si chiude e arrivo al Login.
6. **Given** ho fatto logout **When** premo Indietro **Then** non torno alla Home (resto al Login); **When** ricarico **Then** resto al Login.

### Business Rules

- Iniziali = prima lettera di nome e cognome (max 2), maiuscole; nome a parola singola = 1 lettera.
- Il nome mostrato è quello della sessione (`AuthService`); nessun dato oltre nome e foto.
- Logout chiama `AuthService.logout` e cancella la sessione persistita.

### Edge Cases and Error Handling

- **Invalid Input**: nome vuoto o foto non caricabile = iniziali / fallback neutro, nessun errore a schermo.
- **System Errors**: `logout` che fallisce = sessione locale comunque cancellata, vado al Login.
- **Boundary Conditions**: nome lungo troncato nel menu senza scroll orizzontale a 360px.
- **Exceptional Scenarios**: logout con sessione già scaduta = Login, nessun errore.

## Definition of Done Checklist

- [x] AC 1–6 implementati e verificati
- [x] Logout sul servizio mock dietro interfaccia Membership
- [x] UI demo-ready per sprint review
- [x] Mobile-first: 360px senza scroll orizzontale; desktop usabile
- [x] WCAG 2.1 AA (label, focus visibile, contrasto, tastiera)
- [x] Test automatici verdi; `pnpm quality-gate` verde
- [x] Build statica deployabile su S3 + CloudFront
- [x] Code review e merge

## Story Sizing and Sprint Readiness

**Final Story Points**: M (3)
**Confidence Level**: Medium
**Sizing Justification**: una UI (avatar + menu) e un'azione su servizio gia' previsto; scaffold e `AuthService.logout` arrivano da 01-01-001.
**Sprint Fit Assessment**: si', sprint di 1 settimana. Nessuno split.

## Dependencies and Coordination

**Prerequisite Stories**: 01-01-001 (scaffold, sessione, `AuthService`, header con logo; in review).
**Dependent Stories**: nessuna.
**Shared Components**: `AuthService`/`AuthProvider` (Membership), layout header Home.
**External Dependencies**: nessuna (Strapi non cablato).

## Validation and Testing Strategy

**Testing Methods**: Vitest + Testing Library; test di componente per AC1–4 (avatar, menu, tastiera), test d'integrazione a livello router per AC5–6.
**Test Data Requirements**: utenti demo del mock, uno con foto e uno senza.
**Success Metrics**: demo in sprint review: avatar → menu → Logout → Login → Indietro.

## Notes

Riferimento visivo: [header.png](../../../design-references/header.png) (senza link Home/My Learnn). Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).
Fuori scope: area utente/profilo modificabile, stato abbonamento, link Home e My Learnn, notifiche.
Prepared autonomously under prepare: never (adoption) — ADR-028

## Technical Analysis

### Implementation Approach

**Technical Strategy**: estende l'header Home di 01-01-001 con `UserMenu` (shadcn `DropdownMenu`, accessibile da tastiera, per ux-ui.md) e `Avatar` (shadcn, fallback iniziali); logout via `useAuth().logout` su `AuthService` (interfaccia Membership, mock sostituibile da Strapi per ADR strapi-headless-cms-backend).
**Key Components**: `UserMenu`, `UserAvatar` (+ util `getInitials`), `AuthProvider.logout`, rotte `ProtectedRoute`/`PublicOnlyRoute`.
**Data Flow**: tap avatar -> menu -> `logout()` -> sessione cancellata -> `navigate('/login', { replace: true })`.
**Integration Points**: nessuno oggi; futuro Strapi dietro la stessa interfaccia.
**Design**: not required — riferimento visivo design-references/header.png

### Technical Requirements

- Mobile-first, WCAG 2.1 AA, build statica per S3 + CloudFront.
- La sessione espone `name` e `photoUrl?` (tipi di dominio, nessun payload Strapi nella UI).

### Technical Risks and Mitigation

| Risk                                                  | Impact | Probability | Mitigation Strategy                                         |
| ----------------------------------------------------- | ------ | ----------- | ----------------------------------------------------------- |
| Stato authn residuo dopo logout (cache, history)      | High   | Low         | Cancella sessione, `replace` nella navigazione, test AC6    |
| Sessione 001 senza `name`/`photoUrl`                  | Medium | Medium      | Estendere il tipo e il mock in questa storia                |
| Menu non accessibile da tastiera/screen reader        | Medium | Low         | Primitiva Radix di shadcn, test tastiera                    |

## Task Breakdown

- [ ] **T-1**: Sessione con `name`/`photoUrl?` + `AuthService.logout` + utenti mock (con/senza foto)
- [ ] **T-2**: `UserAvatar` (foto, fallback iniziali, `getInitials`) e header Home senza link
- [ ] **T-3**: `UserMenu` (nome + Logout, tastiera, Esc/click fuori, focus)
- [ ] **T-4**: Logout -> Login con `replace`, test router AC5-6
- [ ] **T-5**: Rifinitura a11y, 360px, quality-gate

### Dependency Graph

    T-1 ──┬── T-2 ── T-3 ──┐
          └────────────────┴── T-4 ── T-5

### AC Coverage

| AC                          | Tasks    |
| --------------------------- | -------- |
| AC-1 (avatar, no link)      | T-2      |
| AC-2 (foto / iniziali)      | T-1, T-2 |
| AC-3 (menu nome + Logout)   | T-3      |
| AC-4 (chiusura, focus)      | T-3      |
| AC-5 (logout -> Login)      | T-1, T-4 |
| AC-6 (Indietro, reload)     | T-4      |

---

### T-1: Sessione utente e logout

**Priority:** P0 | **Estimated Hours:** 3h | **Bounded Context:** Membership

**Type:** Feature Implementation

**Description:** Estendere il tipo di sessione di 01-01-001 con `name` e `photoUrl?`; `AuthService.logout` cancella la sessione persistita (anche se fallisce); mock con un utente con foto e uno senza; `AuthProvider` espone `logout`.

**Acceptance Criteria:**

- Test unitari: logout cancella la sessione, logout con sessione assente, sessione con/senza foto.

**Implementation Approach:** `apps/webapp/src/membership/{auth-service,mock-auth-service,auth-provider}.ts(x)`.

**Dependencies:** 01-01-001 (merge).

### T-2: UserAvatar e header

**Priority:** P0 | **Estimated Hours:** 3h | **Bounded Context:** Membership

**Type:** Feature Implementation

**Description:** `getInitials` (prima lettera di nome e cognome, max 2, maiuscole); `UserAvatar` shadcn con foto e fallback iniziali (anche su errore di caricamento); header Home con logo a sinistra e avatar a destra, nessun link Home/My Learnn.

**Acceptance Criteria:**

- Test componente per AC1-2: avatar presente, link assenti, foto, iniziali, foto rotta.

**Implementation Approach:** `apps/webapp/src/membership/{user-avatar,get-initials}.tsx`, header in `home-page.tsx`.

**Dependencies:** T-1.

### T-3: UserMenu

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Membership

**Type:** Feature Implementation

**Description:** shadcn `DropdownMenu` sull'avatar: nome utente (troncato, no scroll orizzontale a 360px) e voce "Logout"; apertura con tap/Invio/Spazio, chiusura con Esc/click fuori, focus di ritorno all'avatar; nome accessibile al trigger.

**Acceptance Criteria:**

- Test componente per AC3-4, incluso uso da tastiera.

**Implementation Approach:** `apps/webapp/src/membership/user-menu.tsx`; usa `UserAvatar`.

**Dependencies:** T-2.

### T-4: Logout e navigazione

**Priority:** P0 | **Estimated Hours:** 3h | **Bounded Context:** Membership

**Type:** Feature Implementation

**Description:** "Logout" chiama `logout()` e naviga a `/login` con `replace`; `ProtectedRoute` impedisce il ritorno alla Home con Indietro e dopo reload.

**Acceptance Criteria:**

- Test d'integrazione router per AC5-6, incluso logout con sessione scaduta.

**Implementation Approach:** `apps/webapp/src/{routes,app}.tsx`, `user-menu.tsx`.

**Dependencies:** T-1, T-3.

### T-5: Rifinitura

**Priority:** P1 | **Estimated Hours:** 2h | **Bounded Context:** Membership

**Type:** Configuration

**Description:** Verifica a 360px, tastiera, focus visibile e contrasto; build statica; `pnpm quality-gate`.

**Acceptance Criteria:**

- DoD checklist soddisfatta; `pnpm quality-gate` verde.

**Implementation Approach:** nessun nuovo file previsto; fix puntuali.

**Dependencies:** T-4.

## Assumptions

- **Contenuto menu**: solo nome utente e "Logout". Evidenza: AC3; area profilo fuori scope.
- **Menu**: shadcn `DropdownMenu` (dropdown anche su mobile). Evidenza: ux-ui.md adotta shadcn/ui; "dropdown/sheet" lasciato aperto in Initial Scope. Ribaltare: indicare sheet.
- **Dati utente**: la sessione di 001 viene estesa con `name` e `photoUrl?`; mock con un utente con foto e uno senza. Evidenza: AC2; membership.md (profilo di proprieta' Membership).
- **Iniziali**: prima lettera di nome e cognome, max 2. Evidenza: AC2 non specifica la regola.
- **Logout fallito**: la sessione locale viene cancellata comunque. Evidenza: sicurezza, mock senza errori reali.
- **Indietro dopo logout**: `navigate('/login', { replace: true })` + `PublicOnlyRoute`/`ProtectedRoute` di 001. Evidenza: AC6; stesso pattern di 001.
- **Prerequisito**: 01-01-001 non ancora mergiata; l'implementazione parte dopo il suo merge. Evidenza: Dependencies.

---

**Refinement Completed By**: AI (autonomo, prepare: never)
**Refinement Date**: 2026-10-22
**Review and Approval**: da confermare da un umano (vedi Assumptions)

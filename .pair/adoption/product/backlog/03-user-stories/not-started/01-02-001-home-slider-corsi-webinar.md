## Title

**[Catalog] L'abbonato deve vedere in Home lo slider dei corsi e webinar a puntate**

## Story Statement

**Come** abbonato Learnn **voglio** vedere in Home uno slider di corsi e webinar divisi a puntate **così che** scopra subito i contenuti multipli del catalogo.

**Where**: webapp — Home

## Epic Context

**Parent Epic**: [EP-01-02 Home e discovery](../../02-epics/not-started/01-02-home-discovery.md)
**Status**: Todo (Ready)
**Labels**: risk:red
**Priority**: P0 (Must-Have)
**PRD**: US 2.1 AC1, AC2 (AC3 out of scope in questo sprint)

## Classification

`risk:red` · `cost:green`

<details>
<summary>Matrix — per dimension</summary>

| Dimension                  | Tier   | Source                                      | Note                                                  |
| -------------------------- | ------ | ------------------------------------------- | ----------------------------------------------------- |
| Service/domain criticality | yellow | KB default (no Criticality Table)           |                                                       |
| Change/diff risk           | yellow | story scope                                 | nuovi componenti UI + servizio mock, nessuno schema/infra |
| Business impact            | red    | subdomain `catalog-discovery` = core        |                                                       |
| Security relevance         | green  | path heuristic                              | solo lettura di dati mock pubblici, nessun input utente |
| Coupling balance           | green  | `boundedcontext/catalog-and-publishing.md`  | via interfaccia `Catalog`, stesso team/repo           |

Confidence: high

</details>

## Acceptance Criteria

### Functional Requirements

1. **Given** sono nella Home **When** la pagina si carica **Then** vedo lo slider "Corsi e webinar" con circa 8 card; **When** swipe su mobile o frecce su desktop **Then** scorre orizzontalmente.
2. **Given** lo slider è visibile **When** guardo una card **Then** vedo copertina 4:5, etichetta CORSO o WEBINAR, numero di puntate nell'angolo, titolo, "Professionista – Ruolo" e durata totale; nessuna pill HD/CC/AU/TX, nessun "Vedi tutto".
3. **Given** il catalogo mock **When** lo slider si popola **Then** dati e foto vengono dai mockup in design-references, riusati in combinazioni diverse.
4. **Given** il servizio sta rispondendo **When** attendo **Then** vedo card skeleton al posto delle card.
5. **Given** il servizio fallisce (errore simulato da configurazione) **When** la Home carica **Then** vedo "Non riusciamo a caricare i contenuti" e "Riprova", l'header resta visibile; **When** premo "Riprova" **Then** si ripete il caricamento.
6. **Given** un'immagine non si carica **When** la card si mostra **Then** vedo un fallback con il titolo.
7. **Given** vedo una card **When** la tocco **Then** non succede nulla: non è interattiva.

### Business Rules

- Dati via interfaccia `Catalog` (Catalog & Publishing); dataset JSON versionato, latenza simulata.
- Copertina 4:5 prevale sul mockup orizzontale (PRD US 2.1 AC2).
- Frecce solo su desktop; su mobile solo swipe.

### Edge Cases and Error Handling

- **Invalid Input**: nessun input utente.
- **System Errors**: errore servizio = messaggio + Riprova; errore immagine = fallback titolo, il resto dello slider resta intatto.
- **Boundary Conditions**: 360px senza scroll orizzontale della pagina; prima/ultima card = freccia corrispondente disabilitata.
- **Exceptional Scenarios**: lista vuota = nessuno slider, nessun errore.

## Definition of Done Checklist

- [ ] AC 1–7 implementati e verificati
- [ ] Servizio mock dietro interfaccia `Catalog`
- [ ] UI demo-ready per sprint review
- [ ] Mobile-first: 360px senza scroll orizzontale; desktop usabile
- [ ] WCAG 2.1 AA (label, focus visibile, contrasto, tastiera)
- [ ] Test automatici verdi; `pnpm quality-gate` verde
- [ ] Build statica deployabile su S3 + CloudFront
- [ ] Code review e merge

## Story Sizing and Sprint Readiness

**Final Story Points**: M (3)
**Confidence Level**: Medium
**Sizing Justification**: card, slider con frecce/swipe, servizio mock, 3 stati (skeleton, errore, fallback) e test; nessuno scaffold (da 01-01-001).
**Sprint Fit Assessment**: sì, sprint di 1 settimana. Nessuno split.

## Dependencies and Coordination

**Prerequisite Stories**: 01-01-001 (scaffold, Home protetta; PR aperta).
**Dependent Stories**: 01-02-002 (riusa card e servizio `Catalog`).
**Shared Components**: card 4:5, `Catalog` service.
**External Dependencies**: nessuna (Strapi non cablato).

## Validation and Testing Strategy

**Testing Methods**: Vitest + Testing Library; test di componente per AC2, 4–7; test slider per AC1 (frecce, disabilitate ai bordi); servizio mock per AC3.
**Test Data Requirements**: dataset JSON mock; flag di configurazione per errore e latenza.
**Success Metrics**: demo in sprint review di slider, skeleton, errore + Riprova, fallback immagine.

## Notes and Additional Context

**Refinement Session Insights**: riferimento visivo [card-catalogo-serie-slider.png](../../../design-references/card-catalogo-serie-slider.png) (senza pill, copertina 4:5); dark theme, sfondo nero ([ux-ui.md](../../../../tech/ux-ui.md)).
Fuori scope: tap sulla card / overview (US 2.1 AC3, US 3.1), footer fisso, "Vedi tutto".
Prepared autonomously under prepare: never (adoption) — ADR-028

## Technical Analysis

### Implementation Approach

**Technical Strategy**: React + Tailwind + shadcn/ui (per tech-stack.md, ux-ui.md); slider con scroll-snap nativo e frecce desktop; interfaccia `Catalog` con mock sostituibile da Strapi REST (per catalog-and-publishing.md, ADR strapi-headless-cms-backend).
**Key Components**: `CatalogService` + mock JSON, hook di caricamento (loading/error/retry), `CatalogCard`, `CardSkeleton`, `Slider`, sezione in `HomePage`.
**Data Flow**: Home → `CatalogService.listSeries` → stato → slider/skeleton/errore.
**Integration Points**: nessuno oggi; futuro Strapi REST dietro la stessa interfaccia.
**Design**: not required — riferimento visivo design-references/card-catalogo-serie-slider.png

### Technical Requirements

- Mobile-first, WCAG 2.1 AA (catalogo = critical flow): frecce con nome accessibile, scroll da tastiera, focus visibile, contrasto su nero.
- Errore e latenza simulabili da configurazione; build statica per S3 + CloudFront.

### Technical Risks and Mitigation

| Risk                                          | Impact | Probability | Mitigation Strategy                                      |
| --------------------------------------------- | ------ | ----------- | -------------------------------------------------------- |
| Interfaccia non adatta allo swap con Strapi   | Medium | Medium      | Tipi di dominio, nessun payload Strapi nella UI          |
| Foto dai mockup limitate (una sola)           | Low    | High        | Riuso in combinazioni diverse; fallback titolo           |
| Dipendenza da scaffold non ancora mergiato    | Medium | Medium      | Rebase su 01-01-001 prima dell'implementazione           |

## Task Breakdown

- [ ] **T-1**: Servizio `Catalog` + mock JSON (latenza, errore da config) + hook di caricamento
- [ ] **T-2**: `CatalogCard` 4:5 (etichetta, puntate, testi, fallback immagine) + `CardSkeleton`
- [ ] **T-3**: `Slider` orizzontale (swipe, frecce desktop, bordi)
- [ ] **T-4**: Sezione "Corsi e webinar" in Home (skeleton, errore + Riprova, lista vuota)
- [ ] **T-5**: a11y, 360px, build statica

### Dependency Graph

    T-1 ──┬── T-4 ── T-5
    T-2 ──┤
    T-3 ──┘

### AC Coverage

| AC                                   | Tasks      |
| ------------------------------------ | ---------- |
| AC-1 (slider, swipe/frecce)          | T-3, T-4   |
| AC-2 (contenuto card, niente pill)   | T-2        |
| AC-3 (dati/foto dai mockup)          | T-1, T-2   |
| AC-4 (skeleton)                      | T-2, T-4   |
| AC-5 (errore + Riprova)              | T-1, T-4   |
| AC-6 (fallback immagine)             | T-2        |
| AC-7 (card non interattive)          | T-2        |

---

### T-1: Servizio Catalog e mock

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Catalog & Publishing

**Type:** Feature Implementation

**Description:** Interfaccia `CatalogService.listSeries()` con tipi di dominio (id, tipo corso/webinar, titolo, professionista, ruolo, durata, puntate, copertina); mock con dataset JSON versionato (~8 elementi, foto dai mockup copiate negli asset), latenza simulata, errore attivabile da configurazione; hook `useSeries` (loading/error/retry).

**Acceptance Criteria:**

- Test unitari: lista ok, errore simulato, retry, dataset ~8 elementi.

**Implementation Approach:** `apps/webapp/src/catalog/{catalog-service,mock-catalog-service,use-series}.ts`, `series.json`, asset in `public`. Standard: tech-stack.md, catalog-and-publishing.md.

**Dependencies:** 01-01-001 (scaffold).

### T-2: CatalogCard e CardSkeleton

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Catalog & Publishing

**Type:** Feature Implementation

**Description:** Card non interattiva: copertina 4:5, etichetta CORSO/WEBINAR, numero puntate nell'angolo, titolo, "Professionista – Ruolo", durata totale; nessuna pill; fallback con titolo su errore immagine; skeleton 4:5 equivalente.

**Acceptance Criteria:**

- Test componente per AC2, 4 (skeleton), 6, 7.

**Implementation Approach:** `apps/webapp/src/catalog/{catalog-card,card-skeleton}.tsx`, Tailwind/shadcn. Riferimento: card-catalogo-serie-slider.png.

**Dependencies:** 01-01-001 (scaffold).

### T-3: Slider orizzontale

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Catalog & Publishing

**Type:** Feature Implementation

**Description:** Contenitore scroll-snap orizzontale generico (children), swipe nativo su mobile, frecce precedente/successiva solo desktop con nome accessibile, disabilitate ai bordi; scroll da tastiera.

**Acceptance Criteria:**

- Test componente: frecce scorrono, disabilitate ai bordi, frecce assenti su mobile.

**Implementation Approach:** `apps/webapp/src/catalog/slider.tsx`.

**Dependencies:** 01-01-001 (scaffold).

### T-4: Sezione Home "Corsi e webinar"

**Priority:** P0 | **Estimated Hours:** 4h | **Bounded Context:** Catalog & Publishing

**Type:** Feature Implementation

**Description:** Sezione con titolo "Corsi e webinar" nella `HomePage`: skeleton durante il caricamento, slider con card, errore "Non riusciamo a caricare i contenuti" + "Riprova" (header visibile), lista vuota = nessuno slider.

**Acceptance Criteria:**

- Test d'integrazione Home per AC1, 4, 5 e lista vuota.

**Implementation Approach:** `apps/webapp/src/catalog/series-section.tsx`, integrazione in `home-page.tsx`.

**Dependencies:** T-1, T-2, T-3.

### T-5: Rifinitura a11y, 360px, build

**Priority:** P1 | **Estimated Hours:** 2h | **Bounded Context:** Catalog & Publishing

**Type:** Configuration

**Description:** Verifica a 360px senza scroll orizzontale di pagina, focus visibile, contrasto su nero, tastiera; build statica; README: come simulare l'errore.

**Acceptance Criteria:**

- DoD checklist soddisfatta; `pnpm quality-gate` verde; `pnpm --filter webapp build` ok.

**Implementation Approach:** `apps/webapp/README.md`, correzioni agli stili.

**Dependencies:** T-4.

## Assumptions

- **Foto**: ritaglio della foto in card-catalogo-serie-slider.png (e altri mockup) copiato in asset della webapp, riusato su più card. Evidenza: AC3 ("riusata in combinazioni diverse"); design-references contiene 3 PNG. Ribaltare: indicare altre immagini.
- **Slider**: scroll-snap nativo, nessuna libreria carousel. Evidenza: tech-stack.md non ne adotta; AC1 (swipe/frecce). Ribaltare: indicare una libreria.
- **Numero card**: 8 elementi, mix CORSO/WEBINAR con puntate e durate inventate ma plausibili. Evidenza: AC1 "circa 8". Ribaltare: fornire dataset.
- **Simulazione errore**: flag di configurazione (env/costante) letto dal mock. Evidenza: AC5 "da configurazione".
- **Test**: Vitest + Testing Library. Evidenza: 01-01-001 e quality gate.
- **Lista vuota**: nessuno slider, senza errore. Evidenza: nessun AC; scelta minima.
- **Card non interattive**: niente link/bottone, quindi fuori dall'ordine di tab. Evidenza: AC7.

---

**Refinement Completed By**: AI (autonomo, prepare: never)
**Refinement Date**: 2026-10-22
**Review and Approval**: da confermare da un umano (vedi Assumptions)

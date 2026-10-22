## Title

**[Catalog] L'abbonato deve vedere in Home uno slider di contenuti singoli per ogni tema**

## Story Statement

**Come** abbonato Learnn **voglio** vedere in Home i contenuti singoli divisi per tema **così che** trovi rapidamente ciò che mi interessa per argomento.

**Where**: webapp — Home, sotto lo slider "Corsi e webinar"

## Epic Context

**Parent Epic**: [EP-01-02 Home e discovery](../../02-epics/not-started/01-02-home-discovery.md)
**Status**: Todo (Ready)
**Labels**: risk:red
**Priority**: P0 (Must-Have)
**PRD**: US 2.1 AC1 (righe per categoria), US 2.2 AC3 (temi dinamici)

## Classification

`risk:red` · `cost:green`

<details>
<summary>Matrix — per dimension</summary>

| Dimension                  | Tier   | Source                                      | Note                                                  |
| -------------------------- | ------ | ------------------------------------------- | ----------------------------------------------------- |
| Service/domain criticality | yellow | KB default (no Criticality Table)           |                                                       |
| Change/diff risk           | yellow | story scope                                 | estensione servizio mock + sezione UI, nessuno schema/infra |
| Business impact            | red    | subdomain `catalog-discovery` = core        |                                                       |
| Security relevance         | green  | path heuristic                              | solo lettura di dati mock pubblici, nessun input utente |
| Coupling balance           | green  | `boundedcontext/catalog-and-publishing.md`  | via interfaccia `Catalog`, stesso team/repo           |

Confidence: high

</details>

## Acceptance Criteria

### Functional Requirements

1. **Given** sono nella Home **When** la pagina si carica **Then** sotto "Corsi e webinar" vedo uno slider per ognuno dei 4 temi mock, titolato con il nome del tema e nell'ordine restituito dal servizio.
2. **Given** uno slider di tema è visibile **When** guardo una card **Then** vedo la stessa card 4:5 di "Corsi e webinar" con titolo, "Professionista – Ruolo" e durata; nessun numero di puntate, nessuna pill, nessun "Vedi tutto".
3. **Given** un tema senza contenuti **When** la Home carica **Then** il suo slider non è mostrato e non compare alcun errore.
4. **Given** il servizio sta rispondendo **When** attendo **Then** vedo card skeleton negli slider dei temi; **Given** il servizio fallisce (errore simulato da configurazione) **When** la Home carica **Then** vedo "Non riusciamo a caricare i contenuti" e "Riprova", l'header resta visibile; **When** premo "Riprova" **Then** si ripete il caricamento; **Given** un'immagine non si carica **Then** la card mostra il fallback con il titolo.
5. **Given** il catalogo mock **When** gli slider si popolano **Then** dati e foto vengono dai mockup in design-references, riusati in combinazioni diverse.
6. **Given** vedo una card **When** la tocco **Then** non succede nulla: non è interattiva (out of scope in questo sprint).

### Business Rules

- Glossario: Categoria = Tema (PRD; bounded context Catalog & Publishing). Dati via interfaccia `Catalog`; temi e contenuti singoli dal servizio mock, mai hardcoded nella UI (US 2.2 AC3: temi dinamici).
- Ordine dei temi = ordine restituito dal servizio.
- Card e slider riusati da 01-02-001, senza duplicazione.
- Frecce solo su desktop; su mobile solo swipe.

### Edge Cases and Error Handling

- **Invalid Input**: nessun input utente.
- **System Errors**: errore servizio = messaggio + Riprova; errore immagine = fallback titolo, il resto dello slider resta intatto.
- **Boundary Conditions**: 360px senza scroll orizzontale della pagina; prima/ultima card = freccia corrispondente disabilitata.
- **Exceptional Scenarios**: tutti i temi vuoti = nessuno slider tema, nessun errore; tema senza contenuti = nascosto, gli altri restano.

## Definition of Done Checklist

- [ ] AC 1–6 implementati e verificati
- [ ] Servizio mock dietro interfaccia `Catalog` (temi ordinati + contenuti singoli per tema)
- [ ] UI demo-ready per sprint review
- [ ] Mobile-first: 360px senza scroll orizzontale; desktop usabile
- [ ] WCAG 2.1 AA (label, focus visibile, contrasto, tastiera)
- [ ] Test automatici verdi; `pnpm quality-gate` verde
- [ ] Build statica deployabile su S3 + CloudFront
- [ ] Code review e merge

## Story Sizing and Sprint Readiness

**Final Story Points**: S (2)
**Confidence Level**: Medium
**Sizing Justification**: card, slider e stati di 01-02-001 riusati; restano estensione del servizio mock (temi + contenuti singoli), variante card senza puntate/etichetta, sezione per tema, test. Se 01-02-001 non è mergiata, card e slider nascono qui e la stima sale a M (3).
**Sprint Fit Assessment**: sì, sprint di 1 settimana. Nessuno split.

## Dependencies and Coordination

**Prerequisite Stories**: 01-01-001 (scaffold, Home protetta); 01-02-001 (card, slider, servizio `Catalog`, stati) — se non ancora fatta, card e slider nascono qui e 01-02-001 li riusa.
**Dependent Stories**: nessuna.
**Shared Components**: card 4:5, `Slider`, `CardSkeleton`, `Catalog` service.
**External Dependencies**: nessuna (Strapi non cablato).

## Validation and Testing Strategy

**Testing Methods**: Vitest + Testing Library; test di servizio mock per AC1, 3, 5; test di componente/Home per AC2, 3, 4, 6.
**Test Data Requirements**: dataset JSON mock con 4 temi (uno vuoto per il test di AC3 tramite fixture); flag di configurazione per errore e latenza (stessi di 01-02-001).
**Success Metrics**: demo in sprint review di 4 slider per tema, tema vuoto nascosto, skeleton, errore + Riprova, fallback immagine.

## Notes and Additional Context

**Refinement Session Insights**: riferimento visivo [card-catalogo-serie-slider.png](../../../design-references/card-catalogo-serie-slider.png) (senza pill, copertina 4:5); dark theme, sfondo nero ([ux-ui.md](../../../../tech/ux-ui.md)).
Fuori scope: tap sulla card / overview (US 2.1 AC3, US 3.1), ricerca e filtri per tema (US 2.2 AC1–2), "Vedi tutto", footer fisso.
Prepared autonomously under prepare: never (adoption) — ADR-028

## Technical Analysis

### Implementation Approach

**Technical Strategy**: React + Tailwind + shadcn/ui (per tech-stack.md, ux-ui.md); estendere l'interfaccia `Catalog` con `listThemes()` (ordinati) e contenuti singoli per tema, mock JSON (per catalog-and-publishing.md, ADR strapi-headless-cms-backend); riuso di `CatalogCard`, `CardSkeleton`, `Slider` di 01-02-001; sezione per tema in `HomePage` sotto "Corsi e webinar".
**Key Components**: estensione `CatalogService` + dataset JSON, hook di caricamento (loading/error/retry, condiviso con 01-02-001), variante `CatalogCard` per contenuto singolo, sezione `ThemeSections`.
**Data Flow**: Home → `CatalogService.listThemes` / contenuti per tema → stato → slider per tema (vuoti omessi) / skeleton / errore.
**Integration Points**: nessuno oggi; futuro Strapi REST (temi = tassonomia dinamica) dietro la stessa interfaccia.
**Design**: not required — riferimento visivo design-references/card-catalogo-serie-slider.png

### Technical Requirements

- Mobile-first, WCAG 2.1 AA (catalogo = critical flow): frecce con nome accessibile, titolo tema come heading, scroll da tastiera, focus visibile, contrasto su nero.
- Errore e latenza simulabili da configurazione; build statica per S3 + CloudFront.

### Technical Risks and Mitigation

| Risk                                                   | Impact | Probability | Mitigation Strategy                                           |
| ------------------------------------------------------ | ------ | ----------- | ------------------------------------------------------------- |
| 01-02-002 parte prima del merge di 01-02-001           | Medium | Medium      | Rebase su 01-02-001; se assente, card/slider nascono qui e 01-02-001 li riusa |
| Interfaccia non adatta allo swap con Strapi            | Medium | Medium      | Tipi di dominio (Tema, ContenutoSingolo), nessun payload Strapi nella UI |
| Foto dai mockup limitate (una sola)                    | Low    | High        | Riuso in combinazioni diverse; fallback titolo                |

## Task Breakdown

- [ ] **T-1**: Estensione servizio `Catalog` (temi ordinati + contenuti singoli per tema) + mock JSON + hook di caricamento
- [ ] **T-2**: Variante `CatalogCard` per contenuto singolo (senza puntate/etichetta/pill)
- [ ] **T-3**: Sezione temi in Home (slider per tema, vuoti nascosti, skeleton, errore + Riprova)
- [ ] **T-4**: a11y, 360px, build statica

### Dependency Graph

    T-1 ──┬── T-3 ── T-4
    T-2 ──┘

### AC Coverage

| AC                                            | Tasks      |
| --------------------------------------------- | ---------- |
| AC-1 (4 slider per tema, nome e ordine)       | T-1, T-3   |
| AC-2 (card 4:5 senza puntate/pill)            | T-2        |
| AC-3 (tema vuoto nascosto)                    | T-1, T-3   |
| AC-4 (skeleton, errore + Riprova, fallback)   | T-2, T-3   |
| AC-5 (dati/foto dai mockup)                   | T-1, T-2   |
| AC-6 (card non interattive)                   | T-2        |

---

### T-1: Estensione servizio Catalog

**Priority:** P0 | **Estimated Hours:** 3h | **Bounded Context:** Catalog & Publishing

**Type:** Feature Implementation

**Description:** Aggiungere a `CatalogService` `listThemes()` (temi ordinati) e i contenuti singoli per tema (id, titolo, professionista, ruolo, durata, copertina); dataset JSON mock con 4 temi popolati (foto dai mockup riusate), stessi flag di latenza/errore di 01-02-001; hook `useThemeSections` (loading/error/retry) che restituisce solo i temi non vuoti.

**Acceptance Criteria:**

- Test unitari: ordine temi, contenuti per tema, errore simulato, retry, tema vuoto escluso.

**Implementation Approach:** `apps/webapp/src/catalog/{catalog-service,mock-catalog-service,use-theme-sections}.ts`, `themes.json`. Standard: tech-stack.md, catalog-and-publishing.md.

**Dependencies:** 01-01-001 (scaffold); 01-02-001 (servizio `Catalog`, flag errore/latenza).

### T-2: Variante card contenuto singolo

**Priority:** P0 | **Estimated Hours:** 2h | **Bounded Context:** Catalog & Publishing

**Type:** Feature Implementation

**Description:** Riusare `CatalogCard` di 01-02-001 con variante per contenuto singolo: copertina 4:5, titolo, "Professionista – Ruolo", durata; nessun numero di puntate, etichetta o pill; fallback con titolo su errore immagine; non interattiva.

**Acceptance Criteria:**

- Test componente per AC2, 6 e fallback immagine (AC4).

**Implementation Approach:** `apps/webapp/src/catalog/catalog-card.tsx` (estensione, nessuna duplicazione).

**Dependencies:** 01-02-001 (card).

### T-3: Sezione temi in Home

**Priority:** P0 | **Estimated Hours:** 3h | **Bounded Context:** Catalog & Publishing

**Type:** Feature Implementation

**Description:** `ThemeSections` sotto "Corsi e webinar" in `HomePage`: uno `Slider` (riuso) per tema con titolo come heading e card di T-2; skeleton durante il caricamento, errore "Non riusciamo a caricare i contenuti" + "Riprova" (header visibile), temi vuoti omessi, nessun slider se tutti vuoti.

**Acceptance Criteria:**

- Test d'integrazione Home per AC1, 3, 4.

**Implementation Approach:** `apps/webapp/src/catalog/theme-sections.tsx`, integrazione in `home-page.tsx`.

**Dependencies:** T-1, T-2; `Slider` e `CardSkeleton` di 01-02-001.

### T-4: Rifinitura a11y, 360px, build

**Priority:** P1 | **Estimated Hours:** 2h | **Bounded Context:** Catalog & Publishing

**Type:** Configuration

**Description:** Verifica a 360px senza scroll orizzontale di pagina, focus visibile, contrasto su nero, tastiera; build statica.

**Acceptance Criteria:**

- DoD checklist soddisfatta; `pnpm quality-gate` verde; `pnpm --filter webapp build` ok.

**Implementation Approach:** correzioni agli stili; README se serve.

**Dependencies:** T-3.

## Assumptions

- **Nomi dei 4 temi**: inventati ma plausibili (es. marketing, vendite, AI, produttività), nell'ordine del dataset. Evidenza: AC1 "4 temi mock", PRD tema = vocabolario controllato. Ribaltare: fornire elenco e ordine.
- **Tema vuoto per demo/test**: il dataset ha 4 temi popolati; il caso "tema vuoto" è coperto da fixture di test. Evidenza: AC3 vuole nascondere i vuoti, AC1 vuole 4 slider visibili. Ribaltare: aggiungere un quinto tema vuoto al dataset.
- **Contenuti per tema**: 6–8 contenuti singoli, foto dai mockup riusate. Evidenza: AC5, 01-02-001 (~8 card). Ribaltare: fornire dataset.
- **Etichetta CORSO/WEBINAR**: assente sulle card per tema (contenuti singoli, non serie). Evidenza: AC2 elenca solo titolo, "Professionista – Ruolo", durata. Ribaltare: indicare un'etichetta (es. LEZIONE).
- **Un contenuto in un solo tema**: nessun contenuto ripetuto tra temi nel dataset. Evidenza: nessun AC lo richiede; scelta minima.
- **Stati globali**: un solo caricamento per sezione temi (skeleton/errore/Riprova a livello sezione, non per slider). Evidenza: AC4 stati "valgono anche per questi slider"; stessa semantica di 01-02-001.
- **Card non interattive**: niente link/bottone, fuori dall'ordine di tab. Evidenza: AC6.

---

**Refinement Completed By**: AI (autonomo, prepare: never)
**Refinement Date**: 2026-10-22
**Review and Approval**: da confermare da un umano (vedi Assumptions)

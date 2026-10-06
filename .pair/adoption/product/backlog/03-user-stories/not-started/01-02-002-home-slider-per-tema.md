## Title

**[Catalog] L'abbonato deve vedere in Home uno slider di contenuti singoli per ogni tema**

## Story Statement

**Come** abbonato Learnn **voglio** vedere in Home i contenuti singoli divisi per tema **così che** trovi rapidamente ciò che mi interessa per argomento.

**Where**: webapp — Home, sotto lo slider "Corsi e webinar"

## Epic Context

**Parent Epic**: [EP-01-02 Home e discovery](../../02-epics/not-started/01-02-home-discovery.md)
**Status**: Todo (Draft)
**Priority**: P0 (Must-Have)
**PRD**: US 2.1 AC1 (righe per categoria), US 2.2 AC3 (temi dinamici)

## User Value

**User Benefit**: esplora il catalogo per argomento.
**Business Impact**: aumenta la profondità percepita del catalogo.
**Visible UI Value**: sotto lo slider "Corsi e webinar" compaiono gli slider dei 4 temi; quelli vuoti sono nascosti.

## Acceptance Criteria (condivisi in brainstorm)

1. Sotto "Corsi e webinar" la Home mostra uno slider per ogni tema mock (4), titolato con il nome del tema e nell'ordine restituito dal servizio.
2. Ogni card usa la stessa card 4:5 con titolo, "Professionista – Ruolo" e durata, senza numero di puntate e senza pill.
3. Lo slider di un tema senza contenuti non viene mostrato.
4. Gli stati di caricamento (skeleton), errore (messaggio + "Riprova") e fallback immagine valgono anche per questi slider.
5. Dati e foto provengono dai mockup in design-references.
6. Tap sulle card: **out of scope** in questo sprint.

## Initial Scope

### Likely In Scope

- Estensione del servizio catalogo mock: lista temi (ordinata) e contenuti singoli per tema.
- Riuso di card e slider della storia 01-02-001.

### Likely Out of Scope

- Ricerca e filtri per tema (US 2.2), "Vedi tutto", tap sulle card.

### Open Questions

- Nessuna aperta dal brainstorm.

## Definition of Done Expectations

- [ ] Funzionalità implementata e funzionante con servizio mock dietro interfaccia del bounded context
- [ ] **UI dimostra il valore** (demo-ready per sprint review)
- [ ] Mobile-first: a 360px nessuno scroll orizzontale; desktop usabile
- [ ] WCAG 2.1 AA (label, focus visibile, contrasto, tastiera)
- [ ] Test automatici scritti e verdi; `pnpm quality-gate` verde
- [ ] Build statica deployabile su S3 + CloudFront
- [ ] Code review e merge

## Dependencies

**Story Dependencies**: 01-01-001 (scaffold). Se 01-02-001 non è ancora fatta, card e slider nascono qui e 01-02-001 li riusa.
**Epic Dependencies**: nessuna.

## Notes

Glossario: **Categoria = Tema** (PRD, bounded context Catalog & Publishing). Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).

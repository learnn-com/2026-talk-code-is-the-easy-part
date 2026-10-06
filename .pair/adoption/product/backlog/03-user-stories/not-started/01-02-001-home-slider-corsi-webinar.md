## Title

**[Catalog] L'abbonato deve vedere in Home lo slider dei corsi e webinar a puntate**

## Story Statement

**Come** abbonato Learnn **voglio** vedere in Home uno slider di corsi e webinar divisi a puntate **così che** scopra subito i contenuti multipli del catalogo.

**Where**: webapp — Home

## Epic Context

**Parent Epic**: [EP-01-02 Home e discovery](../../02-epics/not-started/01-02-home-discovery.md)
**Status**: Todo (Draft)
**Priority**: P0 (Must-Have)
**PRD**: US 2.1 AC1, AC2 (AC3 out of scope in questo sprint)

## User Value

**User Benefit**: trova contenuti in un'esperienza tipo streaming.
**Business Impact**: primo assaggio di discovery; base per la percezione di qualità del catalogo.
**Visible UI Value**: la Home mostra le card a puntate prese dai mockup, con skeleton, errore + Riprova e fallback immagine.

## Acceptance Criteria (condivisi in brainstorm)

1. La Home mostra lo slider "Corsi e webinar" (circa 8 elementi), che scorre con lo swipe su mobile e con le frecce su desktop.
2. Ogni card ha copertina 4:5, etichetta CORSO/WEBINAR, numero di puntate nell'angolo, titolo, "Professionista – Ruolo" e durata totale; non ci sono pill HD/CC/AU/TX né "Vedi tutto".
3. Tutti i dati e le foto delle card provengono dai mockup in design-references (la card del mockup come riferimento, riusata in combinazioni diverse).
4. Durante il caricamento lo slider mostra card skeleton.
5. Se il servizio fallisce compare "Non riusciamo a caricare i contenuti" con il bottone "Riprova"; l'header resta visibile. L'errore si può simulare da configurazione.
6. Se un'immagine non si carica, la card mostra un fallback con il titolo.
7. Tap sulle card: **out of scope** in questo sprint; le card non sono interattive.

## Initial Scope

### Likely In Scope

- Servizio catalogo mock (interfaccia Catalog) con dataset JSON versionato, latenza simulata ed errore simulabile.
- Componente card 4:5 riusabile e componente slider orizzontale.

### Likely Out of Scope

- Tap sulla card / overview (US 2.1 AC3, US 3.1) — out of scope, refinement futuro, nessuna card.
- Footer fisso, "Vedi tutto".

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

**Story Dependencies**: 01-01-001 (scaffold, Home protetta).
**Epic Dependencies**: nessuna.

## Notes

PRD prevale sul mockup: copertina 4:5 anziché orizzontale. Riferimento visivo: [card-catalogo-serie-slider.png](../../../design-references/card-catalogo-serie-slider.png). Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).

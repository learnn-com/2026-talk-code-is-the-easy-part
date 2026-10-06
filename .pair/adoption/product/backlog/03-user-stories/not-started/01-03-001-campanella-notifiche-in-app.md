## Title

**[Communications] L'abbonato deve vedere dalla campanella le notifiche della sessione**

## Story Statement

**Come** abbonato Learnn **voglio** vedere dalla campanella le notifiche della sessione **così che** non perda le novità mentre uso l'app.

**Where**: webapp — header della Home

## Epic Context

**Parent Epic**: [EP-01-03 Notifiche in-app](../../02-epics/not-started/01-03-notifiche-in-app.md)
**Status**: Todo (Draft)
**Priority**: P0 (Must-Have)
**PRD**: P0.10, US 5.1 AC2 (lista non persistente in sessione)

## User Value

**User Benefit**: vede subito le novità.
**Business Impact**: base per l'engagement su nuove uscite.
**Visible UI Value**: badge con le non lette → apro il pannello → il badge si azzera → tap su una notifica e diventa letta.

## Acceptance Criteria (condivisi in brainstorm)

1. L'header della Home mostra la campanella con un badge con il numero di notifiche non lette; se non ce ne sono, il badge non compare.
2. Il tap sulla campanella apre un pannello (sheet su mobile, dropdown su desktop) con 3–5 notifiche mock; ognuna ha titolo, testo, data relativa e stato letta/non letta.
3. All'apertura del pannello il badge si azzera.
4. Il tap su una notifica la segna come letta e non porta a nessuna schermata.
5. Con la lista vuota compare "Nessuna notifica".
6. Dopo un reload della pagina le notifiche mock ripartono dallo stato iniziale (non vengono salvate).

## Initial Scope

### Likely In Scope

- Servizio notifiche mock (interfaccia Communications); payload con `courseId` già presente per il deep link futuro.
- Notifiche che citano contenuti del dataset mock (dai mockup).

### Likely Out of Scope

- Push reali / OneSignal, deep link verso l'overview, storico persistente.

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

**Story Dependencies**: 01-01-001 (scaffold, header).
**Epic Dependencies**: nessuna.

## Notes

Riferimento visivo: badge rosso in [header.png](../../../design-references/header.png). Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).

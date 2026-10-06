## Title

**[Membership] L'abbonato deve poter vedere il proprio profilo dall'avatar e uscire con il logout**

## Story Statement

**Come** abbonato Learnn **voglio** aprire dall'avatar un menu con il mio nome e il tasto Logout **così che** possa uscire dall'app quando voglio.

**Where**: webapp — header della Home

## Epic Context

**Parent Epic**: [EP-01-01 Autenticazione](../../02-epics/not-started/01-01-autenticazione.md)
**Status**: Todo (Draft)
**Priority**: P0 (Must-Have)
**PRD**: §6 Area utente / Navigazione header

## User Value

**User Benefit**: riconosce il proprio account e può chiudere la sessione.
**Business Impact**: completa il ciclo di accesso (entrare/uscire), base per l'area utente.
**Visible UI Value**: tap sull'avatar → nome utente → Logout → di nuovo il Login.

## Acceptance Criteria (condivisi in brainstorm)

1. L'header della Home mostra l'avatar a destra; i link Home e My Learnn non sono presenti.
2. L'avatar mostra la foto dell'utente; se la foto manca mostra le iniziali.
3. Il tap sull'avatar apre un menu con il nome dell'utente e il tasto "Logout".
4. Il Logout chiude la sessione e porta al Login; con il tasto Indietro non si torna alla Home.

## Initial Scope

### Likely In Scope

- Avatar nell'header (foto o iniziali) e menu (dropdown/sheet) accessibile da tastiera.
- Logout sul servizio auth mock (interfaccia Membership).

### Likely Out of Scope

- Area utente / profilo modificabile, stato abbonamento.
- Link Home e My Learnn nell'header.

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

**Story Dependencies**: 01-01-001 (scaffold, login, header con logo).
**Epic Dependencies**: nessuna.

## Notes

Riferimento visivo: [header.png](../../../design-references/header.png) (senza link Home/My Learnn). Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).

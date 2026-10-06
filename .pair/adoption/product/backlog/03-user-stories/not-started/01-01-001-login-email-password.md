## Title

**[Membership] L'abbonato deve poter accedere alla webapp con email e password**

## Story Statement

**Come** abbonato Learnn **voglio** accedere alla webapp con email e password **così che** solo gli abbonati usino i contenuti.

**Where**: webapp — schermata Login → Home

## Epic Context

**Parent Epic**: [EP-01-01 Autenticazione](../../02-epics/not-started/01-01-autenticazione.md)
**Status**: Todo (Draft)
**Priority**: P0 (Must-Have)
**PRD**: US 1.1 AC1

## User Value

**User Benefit**: entra nell'app in modo semplice e sicuro.
**Business Impact**: protegge i contenuti per soli abbonati; abilita tutte le altre storie (contiene lo scaffold della webapp).
**Visible UI Value**: credenziali errate → messaggio di errore; credenziali corrette → Home con logo; reload → resto loggato; Home senza login → Login.

## Acceptance Criteria (condivisi in brainstorm)

1. La schermata Login mostra il campo email, il campo password (mascherato, con icona "mostra") e il bottone "Accedi"; il link "Password dimenticata?" non è presente.
2. Se invio con campi vuoti o email in formato non valido, compare l'errore sotto il campo e non parte nessuna chiamata.
3. Durante la verifica il bottone "Accedi" mostra il caricamento e non si può premere una seconda volta.
4. Con credenziali errate compare "Email o password non corrette"; la password viene svuotata, l'email resta.
5. Con le credenziali di un utente demo arrivo alla Home, che mostra l'header con il logo Learnn.
6. Dopo un reload della pagina resto loggato.
7. Se apro la Home senza sessione vengo rimandato al Login; se apro il Login già loggato vengo rimandato alla Home.

## Initial Scope

### Likely In Scope

- Scaffold webapp React + Tailwind + shadcn/ui (dark theme), routing con rotte protette.
- Servizio auth mock (interfaccia Membership) con 2 utenti demo documentati nel README e latenza simulata.
- Sessione mock (token) persistita tra i reload.
- Header Home con il solo logo (avatar e campanella arrivano con le rispettive storie).

### Likely Out of Scope

- Reset password / "Password dimenticata?".
- Provisioning utenza da checkout, rate limiting (backend reale).
- Deploy AWS e pipeline CI/CD.

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

**Story Dependencies**: nessuna (prima storia dello sprint).
**Epic Dependencies**: abilita EP-01-02 ed EP-01-03.

## Notes

Riferimento visivo: [login-screen.png](../../../design-references/login-screen.png). Dark theme, sfondo nero, CTA bianche, shadcn/ui + Tailwind ([ux-ui.md](../../../../tech/ux-ui.md)).

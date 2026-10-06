# Brainstorm handoff — MVP sprint 1 (Login + Home)

- **State:** consumed (albero scritto in .pair/adoption/product/backlog/ il 2026-10-06)
- **Theme:** primo sprint MVP Learnn (1 settimana) — Login + Home, dati mock
- **Level:** broad · **Orientation:** functional · **Writer:** /pair-process-plan-epics
- **Parent:** non risolto — backlog vuoto, nessuna iniziativa (HALT "no parent"; remedy: /pair-process-plan-initiatives)

## Decisioni
- Header: logo + campanella + avatar. Link Home/My Learnn esclusi.
- Avatar → menu (nome utente + Logout). Campanella → pannello notifiche mock di sessione.
- Notifiche: 3–5 mock, badge non lette azzerato all'apertura, tap = segna letta (no deep link), "Nessuna notifica", non persistite.
- Login: email+password, validazione client, loading, errore generico "Email o password non corrette", sessione persiste al reload, rotte protette, 2 utenti demo.
- Slider "Corsi e webinar": card 4:5 (PRD prevale su mockup orizzontale), label CORSO/WEBINAR, n. puntate, titolo, professionista – ruolo, durata; no pill HD/CC/AU/TX, no "Vedi tutto".
- Slider per tema (Categoria = Tema PRD): 4 temi mock, ordine da servizio, vuoti nascosti, stessa card senza puntate.
- Stati Home: skeleton, errore + Riprova (simulabile da config), fallback immagine, avatar iniziali.
- Dati/foto: solo dai mockup design-references (card mockup come riferimento, combinazioni).
- DoD: mobile-first 360px, WCAG 2.1 AA, mock dietro interfacce Membership/Catalog/Communications, pnpm quality-gate verde, build statica S3+CloudFront; scaffold webapp nella storia Login.

## Out of scope (niente card)
Tap card/overview, footer fisso, reset password, push reali/OneSignal, deploy AWS + CI/CD, link Home/My Learnn in header.

## AC condivisi
Vedi transcript sessione (AC 1–27 + DoD), riportati nelle storie al momento della scrittura.

## Fase 2 — placement
- Subdomain toccati (già catalogati, nessun delta): identity-subscription, catalog-discovery, notifications.
- Bounded context: Membership, Catalog & Publishing, Communications.
- context-map.md assente → load/check/update inline saltati (nota). Nessun conflitto.

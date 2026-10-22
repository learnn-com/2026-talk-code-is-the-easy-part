# Webapp Learnn

SPA React + Vite + Tailwind + shadcn/ui, tema dark. Auth **mock** dietro l'interfaccia `AuthService` (Membership): lo swap con Strapi Users & Permissions non tocca la UI.

## Avvio

```bash
pnpm install
pnpm --filter webapp dev       # http://localhost:5173
pnpm --filter webapp build     # statico in apps/webapp/dist
pnpm quality-gate              # ts:check, test, lint, prettier:fix
```

## Utenti demo (mock, non sono segreti)

| Email                 | Password      |
| --------------------- | ------------- |
| `abbonato@learnn.com` | `password!42` |
| `demo@learnn.com`     | `Demo2026!`   |

- `abbonato@learnn.com` ha una foto profilo (SVG inline), `demo@learnn.com` no (mostra le iniziali).
- Header Home: avatar a destra, menu con nome utente e Logout; il logout cancella sempre la sessione locale, anche se il servizio fallisce.
- Latenza simulata: 600 ms.
- Sessione mock: token in `localStorage` (`learnn.session`); illeggibile o corrotta = nessuna sessione.
- Email sconosciuta e password errata danno lo stesso errore.

## Catalogo mock (slider Home "Corsi e webinar" e per tema)

Dati dietro l'interfaccia `CatalogService` (Catalog & Publishing); dataset JSON versionato `src/catalog/series.json` (8 elementi, foto dai mockup in `public/covers`). Sotto lo slider, uno slider per tema: `listThemes()` (ordine del servizio) e `listThemeContents(themeId)`, dataset `src/catalog/themes.json` (4 temi, 6-8 contenuti singoli ciascuno, foto riusate). Un tema senza contenuti non viene mostrato.

| Variabile (`.env.local`)       | Effetto                                                           |
| ------------------------------ | ----------------------------------------------------------------- |
| `VITE_CATALOG_FAIL=true`       | simula errore del servizio (messaggio + Riprova, per ogni blocco) |
| `VITE_CATALOG_LATENCY_MS=2000` | latenza simulata (default 600 ms), vedi skeleton                  |

Frecce precedente/successiva solo da 768px in su; su mobile solo swipe. Le card non sono interattive.

## Notifiche in-app (campanella nell'header Home)

Dati dietro l'interfaccia `NotificationService` (Communications); dataset JSON versionato `src/communications/notifications.json` (4 notifiche che citano contenuti di `series.json`, date relative a "adesso", `courseId` già nel payload per il futuro deep link, oggi non usato dalla UI).

- Badge rosso col numero di non lette ("9+" da 10), nascosto a 0; azzerato all'apertura del pannello, le notifiche restano non lette finché toccate (tap = letta, nessuna navigazione).
- Pannello: sheet su mobile, dropdown da 768px in su; Esc chiude, focus intrappolato nel pannello.
- Stato solo in memoria (`NotificationsProvider`): a ogni ricarica si riparte dallo stato iniziale. Servizio che fallisce = nessun badge, "Nessuna notifica".

## Deploy statico (S3 + CloudFront)

Routing lato client (`/login`, `/`): CloudFront deve rispondere `index.html` (custom error 403/404 → `/index.html`, 200).

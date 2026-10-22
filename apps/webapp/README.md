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

- Latenza simulata: 600 ms.
- Sessione mock: token in `localStorage` (`learnn.session`); illeggibile o corrotta = nessuna sessione.
- Email sconosciuta e password errata danno lo stesso errore.

## Deploy statico (S3 + CloudFront)

Routing lato client (`/login`, `/`): CloudFront deve rispondere `index.html` (custom error 403/404 → `/index.html`, 200).

# ADR: Strapi as headless CMS and API backend (single tenant)

## Status

Accepted

## Date

2026-04-12

## Context

- Learnn MVP needs a **webapp** (mobile-first, shipped separately) and a **backend** that provides **authentication** and **structured content** for the catalog and learning experience.
- The team wants **one deployable backend** (not microservices for MVP) and **independent release cadence** for the webapp vs backend.
- Media (video/audio assets, thumbnails) must stay **inside the backend boundary** for MVP — no separate transcoding/CDN ownership split as its own service yet.
- **Single-tenant** product: one Learnn product instance, no multi-tenant SaaS isolation requirement at architecture level.

## Options Considered

### Option 1: Custom Node/Express API + separate headless CMS

- **Description**: Hand-rolled REST API for app concerns; a CMS only for editorial workflows, synced or duplicated.
- **Pros**: Full control over API shape; minimal coupling to a product.
- **Cons**: Higher build cost; auth + content + media duplicated or integrated twice; slower MVP.

### Option 2: Strapi as headless CMS + API (chosen)

- **Description**: **Strapi** hosts admin, content types, **Users & Permissions** for auth, REST (and optional GraphQL) for the webapp; **single deployment unit** for CMS + API; webapp is a **separate build and deploy**.
- **Pros**: One stack for content + auth + media plugins; fits “CMS + backend” must-have; clear separation from React SPA.
- **Cons**: Coupling to Strapi upgrade cycle; advanced video workflows may later need complementary services (out of scope for MVP boundary).

### Option 3: Microservices from day one

- **Description**: Dedicated services for auth, catalog, media, etc.
- **Rejected for MVP**: conflicts with Type B timeline and “single backend deploy” requirement.

## Decision

Adopt **Strapi** as the **only backend deploy** for MVP: **headless CMS**, **authentication** (built-in users/roles as agreed in implementation), and **content APIs** consumed by the **React webapp**, which is **built and released independently**. **Media and upload flows** remain **inside Strapi** (plugins/storage as configured in infrastructure). **Tenancy:** **single tenant** (one product / one logical dataset).

## Consequences

### Benefits

- One place for editors and API contracts; faster MVP alignment with PRD.
- Clear deploy boundary: Strapi (backend) vs static/SSR webapp (frontend).

### Trade-offs and Limitations

- Heavy lifting for video at scale may require future ADRs (CDN, encoding, DRM) without changing the “webapp separate” rule.
- Strapi major upgrades must be planned; content types and migrations are first-class work items.

## Adoption Impact

- `adoption/tech/architecture.md` — system overview, deployment model, boundaries, tenancy.
- `adoption/tech/tech-stack.md` — Strapi listed under backend/CMS with version pinned when the app is scaffolded.

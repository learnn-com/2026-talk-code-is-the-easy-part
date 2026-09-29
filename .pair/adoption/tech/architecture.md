# Architecture

## Purpose

This document contains the **validated architectural decisions** for the project. It serves as the authoritative reference for all architectural patterns, system boundaries, and design principles that have been proposed by AI and validated by the development team during the **Strategic Preparation** phase outlined in the [way-of-working.md](../../knowledge/way-of-working.md).

**Who modifies this:** Development team with AI assistance (🤖🤝👨‍💻) during Strategic Preparation  
**When:** During PRD creation, bounded context definition, and architectural decision processes  
**Authority:** All architectural implementations must follow these adopted standards

## Project context

- **Profile (bootstrap):** Type B — Startup / Scale-up — see [2026-04-12-project-categorization.md](../decision-log/2026-04-12-project-categorization.md).

## System overview

- **Product:** Learnn — subscription learning webapp (see PRD).
- **Client:** Webapp (**React**, mobile-first, **separate release** from backend).
- **Server:** **Single backend deployment** — **Strapi** ([ADR: Strapi headless CMS + API](adr/2026-04-12-strapi-headless-cms-backend.md)): headless CMS, **authentication**, and **content APIs** for the webapp.
- **Tenancy:** **Single tenant** — one Learnn product instance; no multi-tenant isolation layer in MVP.

## Deployment and release model

- **Backend:** one deployable unit (Strapi: CMS + API + auth).
- **Frontend:** webapp **released independently** (own pipeline/versioning).
- **Rationale:** decouple UI iteration from content/API changes while keeping one server-side codebase for MVP.
- **Production infra (AWS):** Strapi on **ECS**, webapp static on **S3 + CloudFront**, **VOD** on AWS; **single production environment** in the cloud — details in [infrastructure.md](infrastructure.md) and [ADR: AWS topology](adr/2026-04-12-aws-ecs-s3-cloudfront-vod.md).

## Boundaries and responsibilities

| Boundary | Responsibility |
| -------- | ---------------- |
| **Webapp (React)** | UI, discovery, playback shell, calls Strapi APIs; no direct DB access. |
| **Strapi** | Users/auth, content types, editorial/admin, REST/GraphQL APIs, **uploads and media metadata** (integrate storage/plugins with **AWS** per `infrastructure.md`). |
| **AWS (VOD / CDN)** | **Playback and distribution** for video (e.g. S3 origins, CloudFront, encoding services as adopted) — no second *application* codebase for MVP. |

There is **no separate media orchestration microservice**: Strapi remains the app boundary; **VOD delivery** uses **AWS** services as in [infrastructure.md](infrastructure.md).

## Non-goals (MVP)

- Microservices split beyond the webapp vs Strapi boundary.
- Multi-tenant SaaS data isolation.
- A dedicated non-AWS media stack or a second custom service only for CMS (beyond Strapi + AWS VOD path).

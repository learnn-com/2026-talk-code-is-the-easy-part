# 🛠️ Technology Stack

## Purpose

This document defines the **validated technology stack decisions** for the project. It serves as the authoritative reference for all technology choices (version included) that have been proposed by AI and validated by the development team during the **Strategic Preparation** and **Strategic Initiatives** phases outlined in the [way-of-working.md](../../knowledge/way-of-working.md).

**Who modifies this:** Development team with AI assistance (🤖🤝👨‍💻)  
**When:** During Strategic Preparation phase and when technology decisions are made  
**Authority:** All technology choices must be documented here before implementation

## Backend / CMS

- **Strapi** — headless CMS + Node API: content model, admin, **authentication** (Users & Permissions), **REST** APIs for the webapp. Media and uploads handled **inside Strapi** (storage/plugins per `infrastructure.md` when wired).
- **Version:** pin when the Strapi application is created (track current Strapi major; lock in `package.json`).

## Frontend (webapp)

- **React** — SPA/responsive webapp, **deployed separately** from Strapi. Exact React version and bundler are pinned in the webapp package when added.
- **Styling / UI:** **Tailwind CSS** + **shadcn/ui** (see [ux-ui.md](ux-ui.md)).
- **Video player:** **Video.js** — version pinned in the webapp package when integrated.
- **Hosting (prod):** static build on **Amazon S3** + **Amazon CloudFront** ([infrastructure.md](infrastructure.md)).

## Cloud (production)

- **Amazon Web Services (AWS)** — Strapi on **ECS**, webapp **S3 + CloudFront**, **VOD** on AWS; **production-only** cloud environment for MVP. See [infrastructure.md](infrastructure.md).

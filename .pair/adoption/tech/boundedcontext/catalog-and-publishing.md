# Catalog & Publishing Context

> Type: **Core**

## Subdomains Covered

- [Catalog & Discovery](../../product/subdomain/catalog-discovery.md)
- [Content Administration & Editorial](../../product/subdomain/content-administration.md)

## Business Scope and Purpose

Owns **what can be watched** and **how it is merchandised**: authoritative content model (courses, lessons, webinars), taxonomy (themes, tags), editorial workflows in Strapi admin, and consumer-facing discovery APIs (home, search, coming soon). Groups editorial and catalog consumption in one context because MVP ships as a **single Strapi content model** with admin + public API surfaces.

## Relationships Between Bounded Context and Sub Domains

- **Catalog & Discovery** — consumer APIs and UX contracts: sections, search, filters, previews.
- **Content Administration** — CRUD, scheduling, FAQ, metadata; same aggregates as discovery, different roles/permissions.
- **Provides to:** Learning Engagement (content metadata and lesson lists), Communications (content IDs for campaigns), Media Platform (asset references).
- **Depends on:** Media Platform for cover/trailer URLs and storage keys.

## Integration Patterns

- **Synchronous:** REST/GraphQL from webapp for catalog and search; Strapi admin for editors.
- **Asynchronous:** Optional cache invalidation or CDN purge hooks when content publishes (implementation-specific).
- **ACL:** Public read models vs authenticated-only previews where required; editorial roles in admin only.

## Data Ownership

Content types, taxonomies, schedules, FAQ, editorial metadata, search-relevant indexes (or Strapi query patterns).

## Team Alignment

Product + content collaborate on content types; engineers own APIs and performance. Single codebase area in **Strapi** for models and policies; **React** for discovery UI.

## Ubiquitous Language

| Term | Definition |
| ---- | ---------- |
| Catalog item | Addressable course, lesson, or webinar with metadata |
| Theme | Controlled vocabulary required on courses/lessons per PRD |
| Coming soon | Scheduled preview of not-yet-available content |

## Quality Attributes

- **Performance:** Fast catalog reads; cache-friendly listing endpoints; mobile-friendly payloads.
- **Scalability:** Read-heavy; CDN for static metadata where applicable.
- **Reliability:** Published content consistency; avoid broken references to removed media.

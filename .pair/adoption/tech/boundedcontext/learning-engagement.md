# Learning Engagement Context

> Type: **Core**

## Subdomains Covered

- [Playback & Learning Experience](../../product/subdomain/playback-learning.md)
- [Progress, Notes & Saved Items](../../product/subdomain/progress-engagement.md)

## Business Scope and Purpose

Owns the **learning session**: in-app playback experience (Video.js, formats, autoplay rules) and **learner state** — progress, manual completion, per-lesson notes, My Learnn saves. Playback and progress are grouped because they share the same user–content session lifecycle and APIs are co-evolved for MVP.

## Relationships Between Bounded Context and Sub Domains

- **Playback** — overview pages, player shell, format tabs (Fase 1), integration with media URLs.
- **Progress & engagement** — started courses, lesson completion, notes, saved lists.
- **Consumes from:** Membership (authorized user), Catalog (content identity and ordering), Media Platform (stream URLs).
- **Provides to:** Catalog (optional “continue” signals for home).

## Integration Patterns

- **Synchronous:** REST calls for progress/note/save writes and reads; player loads URLs from API responses.
- **Asynchronous:** Optional analytics events (non-blocking).
- **ACL:** Map catalog IDs to learner-owned rows; no cross-user leakage.

## Data Ownership

Per-user progress flags, completion events, notes (1:1 user–lesson), saved course/lesson references.

## Team Alignment

Primary **React** surface (player, overview) plus **Strapi** custom APIs or content types for learner data. Owned end-to-end by the squad delivering P0 learning epics.

## Ubiquitous Language

| Term | Definition |
| ---- | ---------- |
| Started course | Course with at least one lesson play in Fase 1 |
| Lesson note | Single editable note text per user per lesson |
| My Learnn | User’s saved courses and lessons (Fase 1) |

## Quality Attributes

- **Performance:** Responsive player startup; debounced note saves.
- **Scalability:** Per-user state grows linearly; index by user and content IDs.
- **Reliability:** Idempotent completion toggles; optimistic UI with server reconciliation for notes.

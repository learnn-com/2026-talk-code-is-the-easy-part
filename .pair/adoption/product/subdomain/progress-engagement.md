# Progress, Notes & Saved Items (Core Subdomain)

> Classification: **Core**

**Business Purpose:**
Persist learning state: courses started, manual lesson completion, per-lesson notes, and My Learnn saved courses/lessons — lightweight personalization without full recommendation engine in Fase 1.

**Key Capabilities:**

- Mark course as started when first lesson plays; surface “in progress” on home (without resume timestamp in Fase 1)
- Manual “lesson completed” action and visible progress in course UI
- One text note per user per lesson with edit and optional character limit
- My Learnn: saved courses vs saved lessons (Fase 1 scope)

**Strategic Importance:**
Core — habit and return visits; differentiates from passive video catalogs and supports ROI narrative for learners.

**Complexity Assessment:**
Medium — straightforward data model but must stay consistent across devices and handle concurrency on notes.

**Data Ownership:**
Progress flags, completion records, notes, saved-item lists per user.

**Dependencies:**

- Depends on: identity-subscription (user id), catalog-discovery / playback-learning (content references)
- Provides to: catalog-discovery (e.g. “continue” sections when wired)

**Team Recommendations:**
Backend API design for idempotent writes; frontend state sync with optimistic UI for notes.

**Implementation Priority:**
High — P0 features in PRD epics 4.

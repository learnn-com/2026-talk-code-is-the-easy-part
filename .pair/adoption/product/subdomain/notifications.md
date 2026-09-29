# Notifications & Outreach (Supporting Subdomain)

> Classification: **Supporting**

**Business Purpose:**
Drive re-engagement via push notifications (e.g. OneSignal) with deep links to content, and ephemeral in-app notification list during a session — plus baseline “day of release” communication where applicable in Fase 1.

**Key Capabilities:**

- Register web push / SDK, send segmented or campaign payloads with IDs for deep linking
- In-app non-persistent notification list when app is open (per PRD)
- Coordinate with coming soon for release-day messaging where applicable

**Strategic Importance:**
Supporting — increases activation and return rate but not the core learning differentiator; can be phased if timeline tight.

**Complexity Assessment:**
Medium — third-party integration, payload contracts, permission UX on web.

**Data Ownership:**
Device/subscription records in push provider, campaign definitions minimal in MVP; avoid persistent notification history in app per PRD.

**Dependencies:**

- Depends on: identity-subscription (user/device binding), catalog-discovery (target content IDs)
- Provides to: playback-learning / catalog-discovery (deep links)

**Team Recommendations:**
Engineer with push/web SDK experience; align payloads with frontend routing.

**Implementation Priority:**
Medium — P0 in PRD but can be sequenced after core playback if needed; confirm in sprint planning.

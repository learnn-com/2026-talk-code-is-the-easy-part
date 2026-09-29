# Playback & Learning Experience (Core Subdomain)

> Classification: **Core**

**Business Purpose:**
Deliver lesson consumption: course/content overview, multi-format playback (video, audio, text via tabs in Fase 1), player controls, and autoplay to next — the core “watch/learn” promise.

**Key Capabilities:**

- Course/content overview with trailer, metadata, tabs (lessons, instructor, similar), CTAs
- Video/audio/text consumption with Fase 1 constraints (tab switch without cross-format timestamp sync)
- Player controls (seek ±15s, progress bar, manual quality in Fase 1 per PRD), autoplay next with cancel
- FAQ display (read-only) at content level

**Strategic Importance:**
Core — product is judged on playback quality and friction vs Netflix-like expectations; differentiates from slide-only courses.

**Complexity Assessment:**
High — player integration (Video.js), adaptive streaming, format switching UX, integration with media URLs and CDN.

**Data Ownership:**
Playback session concerns (client-side), references to media asset URLs, lesson ordering within course, completion signals emitted to progress subdomain.

**Dependencies:**

- Depends on: identity-subscription (authorized user), catalog-discovery (navigation in), media-delivery (streams)
- Provides to: progress-engagement (start/complete events)

**Team Recommendations:**
Frontend-heavy with streaming and mobile browser expertise; coordination with infrastructure for signed URLs and CDN behavior.

**Implementation Priority:**
High — central P0 epic for MVP.

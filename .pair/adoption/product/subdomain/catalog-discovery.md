# Catalog & Discovery (Core Subdomain)

> Classification: **Core**

**Business Purpose:**
Present the content library in a streaming-style experience: home sections, search, themes, tags, and pathways to course/content overview — the primary merchandising surface competing with entertainment apps.

**Key Capabilities:**

- Configurable home rows (continue watching, new, popular, categories, upcoming)
- Search across courses, lessons, webinars with grouped results; dynamic theme list from API
- Tagging model on lessons; mandatory themes on courses/lessons per PRD
- Coming soon previews and filters (webinar vs course) for anticipation

**Strategic Importance:**
Core — discovery quality drives watch starts, retention, and perceived catalog depth; central to Learnn’s positioning vs generic course marketplaces.

**Complexity Assessment:**
High — many read paths, SEO/cache considerations, editorial-driven configuration, performance on mobile networks.

**Data Ownership:**
Catalog metadata (titles, descriptions, covers, durations), taxonomy (themes, tags), search indexes or query contracts, home section configuration, coming-soon scheduling data.

**Dependencies:**

- Depends on: content-administration (authoritative content and taxonomy), media-delivery (thumbnails, trailers)
- Provides to: playback-learning (entry points), notifications (content references)

**Team Recommendations:**
Full-stack with strong frontend performance and UX; close collaboration with editorial on Strapi content types.

**Implementation Priority:**
High — P0 alongside identity; defines main user journeys after login.

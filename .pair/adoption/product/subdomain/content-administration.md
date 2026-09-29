# Content Administration & Editorial (Supporting Subdomain)

> Classification: **Supporting**

**Business Purpose:**
Author and configure content, taxonomy, and editorial rules in Strapi (or equivalent): CRUD themes, tags, metadata, FAQ, coming-soon scheduling, and notification triggers — minimum admin surface described in PRD.

**Key Capabilities:**

- Content CRUD for courses, lessons, webinars; mandatory themes; tags on lessons
- FAQ management; coming soon scheduling and previews
- Tools to trigger or integrate notification sends (e.g. via OneSignal) as per technical design
- Editorial workflows sufficient for practitioner-led production

**Strategic Importance:**
Supporting — necessary to feed the catalog and keep content fresh; competitive edge is in curation and quality, but the *admin product* is enabler not end-user differentiator alone.

**Complexity Assessment:**
Medium — mostly Strapi configuration and roles; grows with workflow and approvals later.

**Data Ownership:**
Authoritative content entities, taxonomy, schedules, editorial metadata; source of truth for catalog-discovery and playback.

**Dependencies:**

- Depends on: media-delivery (asset attachment and URLs)
- Provides to: catalog-discovery, playback-learning, notifications

**Team Recommendations:**
Product + content ops with Strapi training; developers model content types and permissions carefully early.

**Implementation Priority:**
High for launch — parallel to consumer features; blocks realistic catalog population.

# Media Delivery & VOD (Generic Subdomain)

> Classification: **Generic**

**Business Purpose:**
Store, protect, and deliver video/audio assets and static media via cloud infrastructure (AWS: S3, CloudFront, encoding/transcoding as adopted) — commodity plumbing with strong reliability requirements.

**Key Capabilities:**

- Object storage for masters and derivatives; CDN distribution; signed or tokenized access where required
- Integration with Strapi upload plugins and public/signed URLs consumed by the webapp player
- VOD path aligned with PRD (AWS for video/CDN)

**Strategic Importance:**
Generic — widely available capabilities; differentiation is in UX and content, not custom CDN invention. Still critical for uptime and cost.

**Complexity Assessment:**
Medium to High — operational (encoding pipelines, cache, costs); MVP may start simple and evolve.

**Data Ownership:**
Blob storage keys, CDN configuration, playback URL policies; not business rules of catalog content.

**Dependencies:**

- Depends on: AWS account and adopted infra ADRs
- Provides to: content-administration (upload targets), playback-learning (stream URLs), catalog-discovery (thumbnails)

**Team Recommendations:**
DevOps/SRE collaboration; security for URL signing and hotlink prevention.

**Implementation Priority:**
High — required before public playback at scale; can use simplified path for early internal tests.

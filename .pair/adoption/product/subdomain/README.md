# Subdomain Catalog Index

This folder contains the strategic subdomain definitions for the **Learnn** product. Each file specifies a business subdomain for Domain-Driven Design and delivery alignment.

**Initiatives:** no separate initiative files were present in adoption; this catalog was derived from [PRD.md](../PRD.md) (see skill graceful degradation).

## Subdomain List

### Core Subdomains

| Subdomain | File |
| --------- | ---- |
| Identity & Subscription | [identity-subscription.md](identity-subscription.md) |
| Catalog & Discovery | [catalog-discovery.md](catalog-discovery.md) |
| Playback & Learning Experience | [playback-learning.md](playback-learning.md) |
| Progress, Notes & Saved Items | [progress-engagement.md](progress-engagement.md) |

### Supporting Subdomains

| Subdomain | File |
| --------- | ---- |
| Content Administration & Editorial | [content-administration.md](content-administration.md) |
| Notifications & Outreach | [notifications.md](notifications.md) |

### Generic Subdomains

| Subdomain | File |
| --------- | ---- |
| Media Delivery & VOD | [media-delivery.md](media-delivery.md) |

## Subdomain Relationship Matrix

High-level data/control flow (MVP). Arrow direction: **From → To** means “provides to / consumed by”.

| From | To | Relationship Type | Data/Knowledge Flow | Coordination Level |
| ---- | -- | ----------------- | ------------------- | ------------------ |
| content-administration | catalog-discovery | upstream feed | Authoritative content, taxonomy, schedules | Tight |
| content-administration | playback-learning | upstream feed | Lesson/course entities, FAQ | Tight |
| media-delivery | content-administration | storage | Uploads, asset URLs | Tight |
| media-delivery | catalog-discovery | read | Thumbnails, trailers | Medium |
| media-delivery | playback-learning | read | Stream URLs, signed access | Tight |
| identity-subscription | catalog-discovery | gate | Authenticated requests | Tight |
| identity-subscription | playback-learning | gate | Authorized playback | Tight |
| identity-subscription | progress-engagement | identity | User-scoped state | Tight |
| identity-subscription | notifications | identity | User/device targeting | Medium |
| catalog-discovery | playback-learning | navigation | Entry to overview/player | Tight |
| catalog-discovery | notifications | references | Content IDs in payloads | Medium |
| playback-learning | progress-engagement | events | Start/complete signals | Tight |
| progress-engagement | catalog-discovery | feedback | Continue / in-progress (when surfaced) | Medium |

---

For details on each subdomain, see the linked files above. Next recommended step: `/pair-process-map-contexts`.

# Media Platform Context

> Type: **Infrastructure**

## Subdomains Covered

- [Media Delivery & VOD](../../product/subdomain/media-delivery.md)

## Business Scope and Purpose

Owns **storage and delivery** of video/audio and static assets: AWS S3, CloudFront, transcoding as adopted, signed URL policy, and Strapi upload plugin configuration. Treated as infrastructure context — commodity capabilities with strict operational requirements, distinct from editorial meaning in Catalog.

## Relationships Between Bounded Context and Sub Domains

- **Media Delivery** — blob lifecycle, CDN behavior, playback URL generation for the player.
- **Provides to:** Catalog & Publishing (thumbnails, trailers), Learning Engagement (streams), Content Administration (upload targets in admin).
- **Depends on:** AWS account and [infrastructure.md](../infrastructure.md) decisions.

## Integration Patterns

- **Synchronous:** URL signing or short-lived token endpoints from Strapi/backend before playback.
- **Asynchronous:** Encoding/transcoding jobs when applicable (queue, status polling).
- **ACL:** Signed URLs; no public listing of private buckets; hotlink protection as required.

## Data Ownership

Object keys, bucket policies, CDN distribution IDs, encoding job references — not business taxonomy (owned by Catalog).

## Team Alignment

DevOps/SRE and backend collaboration; changes coordinated with player and catalog releases.

## Ubiquitous Language

| Term | Definition |
| ---- | ---------- |
| Origin | S3 bucket or equivalent holding master/derivative assets |
| Signed URL | Time-limited URL granting read access to a private object |

## Quality Attributes

- **Performance:** Low TTFB for manifests and segments via CDN; regional caching.
- **Scalability:** Horizontal CDN scale; storage lifecycle policies for cost.
- **Reliability:** Multi-AZ storage; monitor 5xx from edge and origin.

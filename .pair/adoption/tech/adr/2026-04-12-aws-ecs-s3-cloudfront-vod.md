# ADR: AWS production topology — ECS (Strapi), S3 + CloudFront (webapp), VOD on AWS

## Status

Accepted

## Date

2026-04-12

## Context

- **Architecture:** Strapi as single backend deploy; React webapp released separately ([ADR: Strapi headless CMS](2026-04-12-strapi-headless-cms-backend.md)).
- **Product:** Learnn needs **VOD** (video-on-demand) distribution; PRD points to **AWS** for cloud and content delivery.
- **Operational scope:** Team wants **no separate staging stack** in AWS for MVP — **production only** in the cloud (local/dev machines remain for development).

## Options Considered

### Option 1: Multi-environment AWS (dev/staging/prod)

- **Pros**: Safer releases, parity testing.
- **Cons**: Cost and ops overhead; rejected for MVP — **only prod** in AWS.

### Option 2: Production-only AWS + local development (chosen)

- **Description**: One **production** footprint in AWS; developers run Strapi/webapp locally or via ad-hoc preview as needed, without a dedicated **staging** AWS account/stack for MVP.

### Webapp hosting

- **S3 + CloudFront** vs single-region S3: **S3 origin + CloudFront** chosen for global edge, HTTPS, and caching aligned with streaming UX expectations.

### Strapi hosting

- **ECS** vs serverless-only vs VMs: **ECS** chosen for containerized Strapi with predictable ops and scaling path on AWS.

### VOD

- **AWS-native** stack for video storage and delivery (origins, CDN, and transcoding as needed) — details evolve with content pipeline; **not** delegated to non-AWS cloud for MVP.

## Decision

1. **Cloud:** **AWS** for all production workloads, including **VOD** pipeline and delivery.
2. **Strapi (backend):** run on **ECS** (task/service definition and Fargate vs EC2 left to implementation; default preference: **Fargate** unless constraints require EC2).
3. **Webapp (React build):** static assets on **S3**, fronted by **CloudFront**.
4. **Environments:** **Single production environment** in AWS for MVP — **no dedicated staging** environment in AWS. Local development is out of band from this ADR.

## Consequences

### Benefits

- Clear cost and ops boundary for MVP; matches “solo prod” constraint.
- Standard AWS patterns for SPA + API + media.

### Trade-offs and Limitations

- Releases to production must rely on strong local/CI checks and quality gates — no AWS staging for soak tests unless added later.
- VOD specifics (e.g. MediaConvert vs external encoder, DRM) may require follow-up ADRs.

## Adoption Impact

- `adoption/tech/infrastructure.md` — AWS, ECS, S3/CloudFront, VOD on AWS, prod-only.
- `adoption/tech/architecture.md` — optional cross-link in deployment summary (if not redundant).

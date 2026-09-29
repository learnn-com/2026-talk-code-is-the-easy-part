# 🚀 Infrastructure

## Purpose

This document defines the **validated infrastructure and deployment decisions** for the project. It serves as the authoritative specification for all DevOps practices, deployment strategies, and infrastructure patterns that have been proposed by AI and validated by the development team during the **Strategic Preparation** and **Continuous Value Delivery** phases outlined in the [way-of-working.md](../../knowledge/way-of-working.md).

**Who modifies this:** Development team with AI assistance (🤖🤝👨‍💻) during infrastructure planning and deployment optimization  
**When:** During Strategic Preparation, Sprint Execution, and infrastructure evolution  
**Authority:** All deployment and infrastructure implementations must follow these adopted standards

## Cloud provider

- **AWS** for production workloads, including **VOD** (storage, encoding, and delivery as implemented). See [ADR: AWS topology](adr/2026-04-12-aws-ecs-s3-cloudfront-vod.md).

## Environments

- **Production (AWS):** single managed production footprint for MVP — **no dedicated staging stack** in AWS.
- **Local / developer:** Strapi and webapp run on developer machines (and optional ephemeral previews); not a formally adopted second AWS environment for MVP.

## Webapp (React)

- **Build output:** static assets deployed to **Amazon S3**.
- **Delivery:** **Amazon CloudFront** distribution in front of the bucket (HTTPS, caching, global edge).

## Backend (Strapi)

- **Runtime:** **Amazon ECS** — Strapi runs as a containerized service (implementation chooses task sizing, **Fargate vs EC2** launch type; **Fargate** is the default preference unless requirements dictate otherwise).
- **Data:** database and secrets per ECS task/service pattern (engine choice recorded when DB is selected — e.g. RDS).

## VOD and media

- **VOD** uses **AWS** services for origin storage, packaging/transcoding as needed, and **CDN** distribution (aligned with CloudFront and S3 usage). Strapi continues to own **upload and metadata** inside the app; large-file and playback URLs integrate with this AWS media path.

## Observability

- **To be pinned** with implementation: structured logs, metrics, and tracing for ECS and CloudFront (see observability guidelines when adopted).

## CI/CD

- **To be pinned:** pipeline(s) that build container image for Strapi → ECS, and build webapp → S3/CloudFront invalidation; quality gates from [way-of-working.md](way-of-working.md).

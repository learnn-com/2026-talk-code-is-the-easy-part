# Cost Assessment Guidelines

## Purpose

Defines when AI should flag potential cost impacts during code review vs. when human evaluation is mandatory. The goal is to prevent unbudgeted cost increases while avoiding unnecessary blocking of low-risk changes.

## Core Principle

**AI identifies cost patterns → Humans decide on cost acceptability.**

AI can detect _structural patterns_ that typically introduce or change costs. It cannot assess business justification, budget headroom, or acceptable cost/value trade-offs — those require human judgment.

## Cost Impact Classification

### 🟢 LOW — AI handles, no human escalation needed

Changes that are unlikely to introduce meaningful new costs:

- Bug fixes or refactors within existing services (no new API calls added)
- Performance optimizations that reduce resource usage
- UI-only changes with no backend/infra footprint
- Internal service calls between already-provisioned resources
- Test-only changes
- Configuration changes to existing (already-paying) services that don't change pricing tier

**AI action**: Note in review that no significant cost impact detected. Proceed.

### 🟡 MEDIUM — AI flags, human awareness required (non-blocking by default)

Changes that _may_ introduce costs but are bounded or predictable:

- New calls to already-integrated paid APIs (same vendor, same tier, bounded volume)
- Adding new DB indexes or queries on existing DB instance
- New cron/scheduled jobs using existing infra
- Increased caching with existing cache service
- New feature behind a feature flag (cost deferred)

**AI action**: Flag in review with a cost note. Developer should confirm impact is within expected budget. Does not block merge unless cost signal is ambiguous.

### 🔴 HIGH — AI flags, **human evaluation mandatory before merge**

Changes that introduce new cost vectors or significantly change existing ones:

| Pattern                                   | Examples                                                  |
| ----------------------------------------- | --------------------------------------------------------- |
| New paid third-party API integration      | OpenAI, Twilio, SendGrid, Stripe, Mapbox, Algolia         |
| New AI/LLM calls                          | Any model inference (token cost, per-request)             |
| New cloud resource provisioning           | New DB, queue, storage bucket, CDN distribution           |
| New data pipeline or ETL                  | Large-scale data processing, Spark jobs, BigQuery queries |
| Significant scaling of existing API calls | 10x+ increase in call frequency to paid service           |
| New background job processing large data  | Batch jobs over user/content datasets                     |
| New media processing                      | Video transcoding, image processing at scale              |
| New logging/monitoring integrations       | Paid observability tools per-event pricing                |
| New email/SMS/push notification sends     | Per-message pricing services                              |

**AI action**: HALT merge. Post cost flag in review report. Request human sign-off with explicit cost acknowledgment.

## How AI Should Evaluate During Review

### Step 1: Scan for cost signals

Look for these patterns in changed files:

```
- New SDK imports (openai, stripe, twilio, sendgrid, aws-sdk, @google-cloud/*, etc.)
- New environment variables referencing API keys for external paid services
- New HTTP calls to external paid APIs
- New infrastructure provisioning code (Terraform, CDK, Pulumi)
- New database creation or table definitions at scale
- New scheduled/cron job definitions
- New queue producers with high-volume patterns
- New calls to AI/ML model endpoints
```

### Step 2: Classify the impact

Use the classification above (GREEN/YELLOW/RED). When in doubt, escalate to YELLOW or RED.

### Step 3: Report in review

Always include a **Cost Assessment** section in the review report:

```
## Cost Assessment
**Classification**: 🟢 LOW / 🟡 MEDIUM / 🔴 HIGH
**Cost signals detected**: [list patterns found, or "none"]
**Human review required**: Yes / No
**Notes**: [any relevant context]
```

## Human Evaluation Checklist (for RED signals)

When AI flags a HIGH cost impact, a human must answer these before approving merge:

- [ ] Cost estimate documented (monthly/annual projection)
- [ ] Budget approval obtained or cost is within existing budget
- [ ] Pricing tier and limits understood (e.g., rate limits, free tier thresholds)
- [ ] Cost monitoring/alerting configured for new resource
- [ ] Cost-per-feature value judgment made explicit

## Common Cost Gotchas

- **AI APIs**: Token costs scale with usage; a feature that seems cheap in dev can be expensive at scale
- **Email/SMS**: Per-send pricing — batch sends, digest emails vs. individual are different cost profiles
- **Database reads at scale**: Queries that hit every row or lack indexes can drive up compute costs
- **CDN egress**: High-bandwidth features (video, large downloads) have significant egress costs
- **Background jobs**: Jobs that run frequently on large datasets can consume significant compute
- **Logging verbosity**: Shipping verbose logs to paid observability tools (Datadog, Sentry) adds per-event costs

# Communications Context

> Type: **Supporting**

## Subdomains Covered

- [Notifications & Outreach](../../product/subdomain/notifications.md)

## Business Scope and Purpose

Owns **outbound engagement**: web push (e.g. OneSignal), payload contracts for deep links, and in-session notification UI (non-persistent per PRD). Separated as a supporting context to isolate third-party SDKs and campaign rules from core learning models.

## Relationships Between Bounded Context and Sub Domains

- **Notifications** — device registration, push sends, deep link routing to catalog/learning routes.
- **Consumes from:** Membership (user keys), Catalog (content identifiers in payloads).
- **Provides to:** Learning Engagement / Catalog (navigation targets only — no content ownership).

## Integration Patterns

- **Synchronous:** REST to provider APIs from backend; SDK in webapp for permission and inbox UI.
- **Asynchronous:** Provider callbacks or batch sends for campaigns (as designed).
- **ACL:** Translate internal IDs to stable deep-link routes; sanitize payloads.

## Data Ownership

Provider-specific device/subscription identifiers; minimal campaign metadata in Learnn for MVP; no long-lived in-app notification history per PRD.

## Team Alignment

Small vertical slice: one owner for push contracts and E2E smoke on key devices/browsers.

## Ubiquitous Language

| Term | Definition |
| ---- | ---------- |
| Deep link | URL/route embedded in push to open a course or content screen |
| Session inbox | Ephemeral list while app is open (not stored long-term) |

## Quality Attributes

- **Performance:** Non-blocking registration; avoid push storms in QA.
- **Scalability:** Provider scales delivery; backend rate-limits outbound API calls.
- **Reliability:** At-least-once send acceptable with idempotent user actions on open.

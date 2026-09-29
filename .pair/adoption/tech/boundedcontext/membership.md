# Membership Context

> Type: **Core**

## Subdomains Covered

- [Identity & Subscription](../../product/subdomain/identity-subscription.md)

## Business Scope and Purpose

Owns **who can use Learnn** and **profile + subscription snapshot**: authentication, password lifecycle, user profile fields, and read-only subscription state synchronized from external checkout. This context is the security and billing-truth boundary for all learner-facing features.

## Relationships Between Bounded Context and Sub Domains

- **Identity & Subscription** defines the full scope: login, reset, profile edits, subscription display, and integration hooks for account creation after payment.
- **Consumes from:** external payment/checkout (webhook or sync — anti-corruption at integration layer).
- **Provides to:** Catalog, Learning Engagement, Communications (user identity and authorization); Media (optional user-scoped policies for signed URLs).

## Integration Patterns

- **Synchronous:** Strapi Users & Permissions REST/GraphQL for login and profile; JWT or session strategy per ADR.
- **Asynchronous:** Checkout/billing webhooks → provisioning or subscription updates (queue or idempotent handler as implemented).
- **Anti-corruption layer:** Map external provider payloads into internal user/subscription fields; never expose provider internals to the webapp.

## Data Ownership

User accounts, hashed credentials, profile attributes, subscription status fields mirrored from billing, password-reset tokens.

## Team Alignment

Owned by the core product team; high autonomy for auth rules. MVP: implemented inside the **Strapi** codebase (plugins/custom controllers) with **React** login/settings UI calling APIs.

## Ubiquitous Language

| Term | Definition |
| ---- | ---------- |
| Subscriber | User with an active paid plan allowing catalog access |
| Subscription snapshot | Read-only state in Learnn mirroring billing (dates, tier) |
| Learner profile | Editable user fields shown in app settings |

## Quality Attributes

- **Performance:** Fast login and token validation; rate limiting on auth endpoints.
- **Scalability:** Stateless API tier suitable for horizontal ECS scaling.
- **Reliability:** Strong consistency for “can access premium” checks; idempotent webhook processing.

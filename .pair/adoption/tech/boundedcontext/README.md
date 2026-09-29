# Bounded Context Catalog (Learnn)

Grouped bounded contexts for a **small team** and **single Strapi backend + separate React webapp** ([architecture.md](../architecture.md)). Contexts express **logical** boundaries and ownership; MVP implements them mainly as **modules** inside Strapi and **feature areas** in the webapp, not as separate deployables.

## Contexts and subdomain mapping

| Bounded context | Type | Subdomains covered | File |
| --------------- | ---- | ------------------ | ---- |
| Membership | Core | Identity & Subscription | [membership.md](membership.md) |
| Catalog & Publishing | Core | Catalog & Discovery; Content Administration | [catalog-and-publishing.md](catalog-and-publishing.md) |
| Learning Engagement | Core | Playback; Progress / notes / salvati | [learning-engagement.md](learning-engagement.md) |
| Communications | Supporting | Notifications | [communications.md](communications.md) |
| Media Platform | Infrastructure | Media Delivery & VOD | [media-platform.md](media-platform.md) |

## Integration overview

| Pattern | Usage |
| ------- | ----- |
| **Synchronous REST** | Webapp → Strapi APIs across all core contexts; primary integration style for MVP. |
| **Async webhooks / jobs** | Checkout → Membership; optional encoding/transcoding → Media Platform; push provider callbacks → Communications. |
| **ACL** | External payment, OneSignal, AWS media — mapped at boundaries; no leak of provider models to UI. |

**Deployment note:** All **Strapi-backed** contexts share one **ECS** service; **React** implements UI for Membership, Catalog, Learning, Communications clients. Media Platform spans **AWS** + Strapi upload configuration.

## Subdomain index

See [subdomain catalog](../../product/subdomain/README.md).

## Next step

`/pair-process-plan-epics` (epic breakdown; backlog on filesystem per [way-of-working.md](../way-of-working.md)).

# Identity & Subscription (Core Subdomain)

> Classification: **Core**

**Business Purpose:**
Ensure only paying subscribers access Learnn, manage credentials and profile data, and surface read-only subscription state — the trust boundary between checkout (external) and the learning product.

**Key Capabilities:**

- Email/password authentication, session or JWT-based API access, password reset
- User profile (name, email, password, image, social links, profession) aligned with PRD area utente
- Read-only subscription status and expiry; deep links to external site for billing changes (no in-app payment)

**Strategic Importance:**
Core — access control and subscription truth directly affect revenue protection and compliance with the “abbone-only content” model; poor execution erodes trust and legal posture.

**Complexity Assessment:**
Medium — standard auth patterns plus webhook/checkout integration for account provisioning; must stay aligned with external payment provider.

**Data Ownership:**
User identity records, credentials (hashed), profile attributes, subscription snapshot fields synchronized from billing, password-reset tokens.

**Dependencies:**

- Depends on: external payment/checkout (outside bounded system), email delivery for reset
- Provides to: catalog-discovery, playback-learning, progress-engagement, notifications (user targeting)

**Team Recommendations:**
Backend-focused engineers familiar with Strapi Users & Permissions and secure API design; security review for auth flows.

**Implementation Priority:**
High — P0 for MVP; blocks all authenticated experiences.

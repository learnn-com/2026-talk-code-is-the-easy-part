# Decision: Avatar/menu on Radix primitives; logout always clears local session

## Date

2026-10-22

## Status

Active

## Category

Library Choice

## Context

Story 01-01-002 adds avatar + user menu to the Home header. `ux-ui.md` adopts shadcn/ui; the primitives live in the app (`components/ui`).

## Decision

1. **Menu/avatar:** shadcn-style `DropdownMenu` and `Avatar` over `@radix-ui/react-dropdown-menu` and `@radix-ui/react-avatar` (keyboard, Esc, outside click, focus return handled by Radix).
2. **Session shape:** `User.photoUrl?` (domain type, no Strapi payload); a persisted session without it stays valid, a non-string value is treated as corrupted.
3. **Logout:** `AuthProvider.logout` swallows a failing `AuthService.logout` and always drops the in-memory session; the route guard then redirects to `/login` with `replace`.
4. **Mock photo:** inline SVG data URI for one demo user (no network).

## Alternatives Considered

- **Plain `<img>` with onError fallback:** Not chosen — Radix Avatar also covers the loading state and matches shadcn.
- **Explicit `navigate('/login')` in the menu:** Not chosen — `ProtectedRoute` already redirects with `replace` once the session is null; a second navigation would race it.

## Consequences

- If the real service logout fails, the server-side session may outlive the local one: the Strapi implementation must handle token revocation/expiry.

## Adoption Impact

- `adoption/tech/tech-stack.md` — none beyond the Radix packages already implied by shadcn/ui.

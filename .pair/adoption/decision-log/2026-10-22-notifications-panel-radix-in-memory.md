# Decision: Notification panel on Radix Popover/Dialog; in-memory state, badge zeroed on open

## Date

2026-10-22

## Status

Active

## Category

Library Choice

## Context

Story 01-03-001 adds the header bell with a panel: sheet on mobile, dropdown on desktop (`ux-ui.md` adopts shadcn/ui, primitives in `components/ui`).

## Decision

1. **Panel:** shadcn-style `Sheet` over `@radix-ui/react-dialog` (mobile) and `Popover` (modal) over `@radix-ui/react-popover` (desktop); switch via the existing `useDesktop` (`min-width: 768px`). Radix gives focus trap, Esc and focus return.
2. **State:** `NotificationsProvider` keeps list and read ids in memory only (PRD US 5.1 AC2); every mount restarts from the service's initial state.
3. **Badge:** `badge = opened ? 0 : unread`; `markOpened` never touches read state, `markRead(id)` only the tapped notification.
4. **Service:** `NotificationService.list()` with domain type (`courseId` kept for the future deep link, unused by the UI); a failing or throwing service = empty list, no error message.
5. **Mock:** `notifications.json` stores `minutesAgo`; `createdAt` is computed at call time so dates are always relative to "now".

## Alternatives Considered

- **`DropdownMenu` for the desktop panel:** Not chosen — menu semantics (`menuitem`, typeahead) do not fit a notification list.
- **Persisting read state in `localStorage`:** Not chosen — contradicts AC6 / PRD.

## Consequences

- Real Strapi/OneSignal push must map to `AppNotification` behind the same interface; read-state persistence is a future story.

## Adoption Impact

- `adoption/tech/tech-stack.md` — none beyond the Radix packages already implied by shadcn/ui.

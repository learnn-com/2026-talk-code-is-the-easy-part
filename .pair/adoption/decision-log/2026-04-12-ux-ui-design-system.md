# Decision: Webapp UX — shadcn/ui, dark theme, WCAG 2.1 AA, Video.js

## Date

2026-04-12

## Status

Active

## Category

Library Choice

## Context

The Learnn webapp targets a **streaming-style**, mobile-first experience. The team needed a **design system** approach, a **visual theme** aligned with the brand, **accessibility** expectations, and a **video player** for VOD.

## Decision

1. **Component library:** **shadcn/ui** (React + **Tailwind CSS**) for UI primitives and patterns.
2. **Theme:** **Dark only** for MVP — **screen background black** (#000 or equivalent), **primary CTAs** white (buttons/links as designed); no light theme requirement for MVP.
3. **Accessibility:** **WCAG 2.1 Level AA** as the **minimum** target on **critical user flows** (auth, navigation, playback, checkout-related paths as defined in stories).
4. **Video player:** **Video.js** for in-app playback (HLS/DASH and sources as wired to AWS VOD).

## Alternatives Considered

- **MUI / Chakra:** Not chosen — team preference for **shadcn/ui** and Tailwind-based styling.
- **Other players (Mux Player, native HLS):** Not chosen — **Video.js** selected for MVP.

## Consequences

- Webapp package must include Tailwind + shadcn setup; tokens must reflect **dark-only** palette.
- QA and design reviews must check **AA** on critical flows; components from shadcn may need contrast checks.
- **Video.js** skinning should align with dark UI and CTA rules.

## Adoption Impact

- `adoption/tech/ux-ui.md` — design system, theme, a11y, player.
- `adoption/tech/tech-stack.md` — shadcn, Tailwind, Video.js under frontend.

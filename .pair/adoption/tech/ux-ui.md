# 🎨 UX/UI

## Purpose

This document defines the **validated user experience and interface design decisions** for the project. It serves as the authoritative specification for all UX/UI patterns, design systems, and user interaction principles that have been proposed by AI and validated by the development team during the **Customer-Facing Iterations** phase outlined in the [way-of-working.md](../../knowledge/way-of-working.md).

**Who modifies this:** Development team with AI assistance (🤖🤝👨‍💻) during Epic breakdown and User Story refinement  
**When:** During customer-facing iterations, user story creation, and UX validation sessions  
**Authority:** All user interface implementations must follow these adopted standards

## Design system

- **shadcn/ui** — React components built on **Tailwind CSS**; follow project conventions when adding or customizing components. See [2026-04-12-ux-ui-design-system.md](../decision-log/2026-04-12-ux-ui-design-system.md).

## Theme and visual language

- **Dark theme only** for MVP (no light theme requirement).
- **Screen background:** black.
- **Primary CTAs:** white (foreground on dark surfaces — keep contrast consistent with **WCAG 2.1 AA**).

## Accessibility

- **Minimum standard:** **WCAG 2.1 Level AA** on **critical flows** (authentication, main navigation, catalog/discovery, playback, subscription-related flows).

## Video

- **Video.js** for the in-app video player; styling and controls should match the dark UI and accessibility expectations.

## References

- [Accessibility guidelines](../../knowledge/guidelines/quality-assurance/accessibility/README.md) (project KB)
- [PRD](../product/PRD.md) for product experience goals
- [Design references (screenshots MVP)](../product/design-references/README.md) — login, header, card catalogo (allineamento visivo alle user story)

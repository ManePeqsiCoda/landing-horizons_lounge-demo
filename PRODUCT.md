# PRODUCT.md

## Product
Horizons Lounge Aruba — luxury sunset lounge at Amsterdam Manor Beach Resort, Eagle Beach.

## Platform
web

## Mode (home)
Persuade + Experience — photography-led landing; visitor decides to reserve or explore.

## Users
Resort guests and leisure travelers (often mature / senior-friendly legibility), discovering the Sunset Ritual online before booking a terrace table.

## Positioning
The daily golden-hour ritual on Eagle Beach: cocktails, culinary, live energy — not a generic beach bar.

## Voice
Warm, sensory, restrained luxury. Short sentences over long essays. No SaaS marketing tone.

## Anti-references
- Slideshow / deck / "one full-bleed slide per wheel tick" — every section must use a different composition grammar
- Generic purple SaaS gradients, Inter, card grids of icon+title+text
- Dense admin chrome on the public site
- Serif/script font stacks (Playfair, Billa Mount, PerfectGirl) — removed 2026-08-29

## Constraints (pinned by team — updated 2026-08-29, supersedes previous font/color pins)
- **Mono-family typography: Satoshi** (300/400/500/700) for the whole public site, used at extreme scale contrast like Amsterdam Manor uses DM Sans. Display: weight 500, tight tracking (-0.07em…-0.09em), line-height 0.9–0.94. Labels: uppercase, tracking 0.08em, ✦ eyebrow marker.
- **Ecosystem grammar from Amsterdam Manor:** saturated color blocks per section, 1px hairlines, radius 8px buttons / 16px media / 99px floating pills, 3-state glass header, reservation bar docked in the hero, GSAP scroll motion, sunflower scroll-progress bar.
- **Horizons' own identity lives in:** the sunset palette (ivory → sunflower/amber → dusk → teal-night blocks), the horizon line-art motif, the Sunset Ritual narrative, and the double daily Happy Hour (5:30–6:30 PM and 9:00–10:00 PM).
- Home must use **normal continuous scroll**, not reel/snap "diapositivas". No section may repeat the previous section's composition scheme.
- Body text minimum 18px, labels minimum 13px, WCAG AA contrast (text-safe palette variants).

## Evidence
Live photography and `cinematic.mp4` in `/public`. Prototype CTAs: internal `/reserve`; OpenTable is demo-only toast. Client-pending data marked `TODO_CLIENTE` in `src/data/contact.ts`.

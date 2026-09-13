# Spark StaySphere — Product Page

Editorial product page / case study for **Spark StaySphere**, the white-label direct-booking
front end for independent hotels. Built to read as a continuation of the live booking
experience at https://spark-staysphere.spark-staysphere-demo.workers.dev/ (demo property: Asteria Cove).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 (same React + Tailwind approach as the StaySphere build).

## Design system (extracted from the live StaySphere CSS)

| Token | Value |
| --- | --- |
| Canvas / ink | `#f3f1ec` / `#161616` |
| Stone, border | `#e9e5dd`, `#ddd9d0` |
| Muted text | `#66665f` |
| Accent (clay) | `#b8603a` |
| Tints | clay `#f4e6dd`, sand `#efe7d3`, sage `#e2e9de`, rose `#f1e2e0` |
| Radii | cards 28px, tiles 20px, pills `rounded-full` |
| Shadows | `shadow-soft`, `shadow-soft-lg` (same values as the product) |

Typography, as shipped in the product:

- UI/display stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, …` (Inter woff2 self-hosted as the cross-platform face)
- Headings carry no italic accent word and no numbered eyebrow: one plain statement per section
- Display: `.text-display` — weight 700, letter-spacing −0.028em, line-height 1.05
- Headings h1–h3: weight 700, letter-spacing −0.022em
- Hero wordmark: Jost 900 (self-hosted woff2), uppercase, line-height 0.915 — the oversized two-line "STAY / SPHERE" in the hero card
- Body: 15–18px, `leading-relaxed`; small labels 12–14px, uppercase eyebrows tracked +0.12–0.14em

All tokens live in `src/index.css` and are exposed to Tailwind through `@theme inline`.

## Hero

The page opens on a dark inset card (`.hero-card`, `src/components/Hero.tsx`): header row on top
(wordmark, one pill per section, CTA), the property photography edge to edge below it, the product
name as an oversized two-line wordmark, and a glass slide card (index, label, prev/next) bottom right.
Geometry is expressed in container units so the composition keeps its proportions at any viewport.
On load the card grows out of a header-height strip, the header fills in left to right, the photo
un-blurs, the title rises line by line, then the slide card — all skipped under `prefers-reduced-motion`.
The floating light nav (`Nav.tsx`) stays hidden until the hero header scrolls out of view.

## Structure

```
src/
  App.tsx                    page composition
  index.css                  tokens, fonts, utilities, reveal + device styles
  lib/links.ts               external URLs
  lib/nav.ts                 section anchors shared by both headers
  lib/menu.ts                mobile menu context
  lib/useReveal.ts           IntersectionObserver scroll reveal
  components/
    ui.tsx                   Reveal, Button, Shot, Chip
    MenuProvider.tsx         mobile menu state
    Nav.tsx                  floating compact nav (appears after the hero)
    HeroHeader.tsx  Hero.tsx  hero card: header row, photo slider, wordmark
    ProjectIntro.tsx  BookingFlow.tsx
    RoomShowcase.tsx  RoomDetails.tsx  ServicesSection.tsx  EndToEnd.tsx
    ProductPrinciples.tsx  Pricing.tsx  FinalCTA.tsx  Footer.tsx
public/
  ui/       real UI captures from the live demo (desktop 1440 @2x, mobile 390 @3x)
  photos/   property photography from the demo
  fonts/    Inter (woff2, as served by the product) + Jost (hero wordmark)
  brand/    Spark logo SVGs
```

## Screenshots

Every product visual is a capture of the live demo, taken with Playwright over the real
booking flow (search → rooms → room → extras → guest → payment → review → confirmation).
No UI was mocked. Guest data in the captures is placeholder demo data.

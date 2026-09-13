# Spark StaySphere — Design System

The token source of truth is [`src/index.css`](src/index.css). Everything below is either defined
there or is a convention the page consistently follows. Tokens are declared as CSS custom
properties in `:root` and exposed to Tailwind through `@theme inline`, so every token has a
matching utility class. **There is no `tailwind.config.js`** — Tailwind v4 is configured in CSS.

---

## 1. Color

Warm, paper-like neutrals with muted earth tints. No pure black, no pure grey.

### Core

| Token | Value | Tailwind | Use |
| --- | --- | --- | --- |
| `--ink` | `#161616` | `bg-ink` `text-ink` | Primary text, dark surfaces, primary buttons |
| `--canvas` | `#f3f1ec` | `bg-canvas` | Page background |
| `--stone` | `#e9e5dd` | `bg-stone` | Secondary surface, neutral chips, hover fill |
| `--card` | `#ffffff` | `bg-card` | Raised cards |
| `--border` | `#ddd9d0` | `border-border` | Hairlines, dividers |
| `--muted-text` | `#66665f` | `text-muted-foreground` | Body copy, captions |
| `--primary-foreground` | `#f7f5f0` | `text-primary-foreground` | Text on ink |
| `--primary-hover` | `#2b2b2b` | `hover:bg-primary-hover` | Primary button hover |

### Accent & status

| Token | Value | Tailwind | Use |
| --- | --- | --- | --- |
| `--accent` | `#b8603a` | `text-accent` | Clay accent, used sparingly |
| `--accent-strong` | `#9a4e2c` | `bg-accent-strong` | Accent text on light tints |
| `--accent-soft` | `#f4e6dd` | `bg-accent-soft` | Accent surface |
| `--glass-tint` | `#f7f5f0` | `bg-glass-tint` | Frosted light surface |
| `--success` | `#2e7d5b` | `text-success` | Confirmation, positive stats |

### Tints

Each tint is a surface paired with its own readable ink. **Always use them as a pair** — never a
tint surface with `--ink`, never a tint ink on `--canvas`.

| Tint | Surface | Ink | Tailwind |
| --- | --- | --- | --- |
| Clay | `#f4e6dd` | `#9a4e2c` | `bg-tint-clay` `text-tint-clay-ink` |
| Sand | `#efe7d3` | `#7f6a35` | `bg-tint-sand` `text-tint-sand-ink` |
| Sage | `#e2e9de` | `#4c6a4e` | `bg-tint-sage` `text-tint-sage-ink` |
| Rose | `#f1e2e0` | `#93565a` | `bg-tint-rose` `text-tint-rose-ink` |

### Hero-only darks

The hero card is its own dark environment and intentionally sits outside the token set
(`src/index.css`, `.hero-*`): card `#0f0f0f`, text `#e4e4e2`, photo backdrop `#17110c`,
slide label `#f1efe9`, glass `rgb(22 17 12 / 0.42)`. Do not reuse these elsewhere.

---

## 2. Typography

### Families

| Token | Stack | Tailwind |
| --- | --- | --- |
| `--font-ui-stack` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, "Helvetica Neue", Arial, sans-serif` | `font-sans` |
| `--font-display-stack` | same as UI stack | `font-display` |
| `--font-hero-stack` | `Jost, Futura, "Avenir Next", "Century Gothic", …` | `font-hero` |

Inter and Jost are self-hosted variable woff2 (`public/fonts/`), both preloaded in
[`index.html`](index.html). The UI stack puts the OS face first so macOS/iOS render SF and
everything else falls back to Inter.

### Type scale

**Fixed 10-step scale. Minimum 12px, maximum 64px, even values only.**

| px | rem | Class | Source |
| --- | --- | --- | --- |
| 12 | 0.75 | `text-xs` | Tailwind default |
| 14 | 0.875 | `text-sm` | Tailwind default |
| **16** | 1 | `text-base` | Tailwind default — body default |
| 18 | 1.125 | `text-lg` | Tailwind default |
| 24 | 1.5 | `text-2xl` | Tailwind default |
| 28 | 1.75 | `text-3xl` | **overridden** (was 30) |
| 32 | 2 | `text-4xl` | **overridden** (was 36) |
| 48 | 3 | `text-5xl` | Tailwind default |
| 56 | 3.5 | `text-6xl` | **overridden** (was 60) |
| 64 | 4 | `text-7xl` | **overridden** (was 72) |

Overrides live in the `@theme inline` block of [`src/index.css`](src/index.css) as `--text-3xl`,
`--text-4xl`, `--text-6xl`, `--text-7xl` with their `--line-height` companions.

Rules:

- **Never write an arbitrary size** (`text-[15px]`, `text-[11px]`). If a size feels missing, the
  answer is the nearest step, not a new value.
- `text-xl` (20px) is **not** part of the scale — the scale jumps 18 → 24. Don't use it.
- Fluid/container-relative sizes are allowed **only** in the hero (`.hero-title`,
  `.hero-slide-index`, `.hero-slide-label`), where the composition must hold its proportions at
  any viewport. Those use `cqw/cqh` and `clamp()` by design.

### Weights, tracking, leading

| Role | Treatment |
| --- | --- |
| `.text-display` (utility) | weight 700, tracking `-0.028em`, leading `1.05` |
| `h1`–`h3` (base layer) | display stack, weight 700, tracking `-0.022em` |
| Body | weight 400, `leading-relaxed` |
| Nav links (hero header and floating nav — one shared style) | `font-medium`, sentence case, no tracking; the group sits in a `bg-stone/60 p-1` track, the active/hover link is a white pill with `shadow-soft` |
| Eyebrows / step labels | `text-xs`, uppercase, `tracking-[0.05em]` → `sm:tracking-[0.12em]` |
| Hero wordmark | Jost 900, uppercase, leading `0.915`, tracking `-0.012em` |

### Hierarchy

Every piece of text on the page belongs to exactly one level. Match a level rather than inventing
a size — if nothing fits, the level is missing, not the size.

| Level | Role | Size | Classes |
| --- | --- | --- | --- |
| **H1** | Hero wordmark, once per page | fluid | `.hero-title` (Jost 900, container units) |
| **H2** | Section heading | 32 → 48 → 56 | `text-display text-4xl sm:text-5xl lg:text-6xl` |
| **H2°** | Closing CTA only — the one climax | 32 → 48 → 64 | `…lg:text-7xl` |
| **H3** | Block heading, card title | 24 | `text-2xl font-semibold tracking-tight` |
| **H4** | Tile title, list-item title, FAQ question | 18 | `text-lg font-semibold tracking-tight` |
| **H5** | Footer column, wordmark, dense label | 16 | `text-base font-semibold tracking-tight` |
| **Lede** | Section intro paragraph | 18 | `text-lg leading-relaxed text-muted-foreground` |
| **Body** | Paragraph and list copy | 16 | `text-base leading-relaxed` |
| **Body-sm** | Copy inside dense tiles | 14 | `text-sm leading-relaxed text-muted-foreground` |
| **Meta** | Captions, secondary values, footer links | 14 | `text-sm` |
| **Micro** | Chips, badges, eyebrows, fine print | 12 | `text-xs font-medium` (uppercase + tracking for eyebrows) |
| **Numeral** | Prices, step numbers | 32 → 48 | `text-display text-4xl sm:text-5xl` |
| **Numeral, hero stat** | The intro section's four drop-counters only | 48 → 64 | `text-5xl font-light tracking-[-0.03em] lg:text-7xl` — the one light-weight numeral; its unit/suffix is a step down in `text-accent` |

### Three rules that keep it honest

1. **Nothing outranks its section.** No element may be larger than the H2 at the same breakpoint —
   H1 is the only exception. Most numerals cap at 48 to sit clearly under the 56 of the heading
   above them. The intro's stat counters are the single exception (64 at `lg`): that section has
   no display H2 to outrank — its heading is a two-tone `text-4xl` statement — so the numerals are
   the largest thing in it by design, and they are set light (300) so the size reads as air, not
   shout.
2. **Text scales with its container, not with the viewport.** A grid that goes 1 → 2 → 4 columns
   makes its cards *narrower* as the screen grows, so titles inside it are flat (`text-2xl`, no
   `sm:` bump). Only full-width elements that genuinely get wider — section headings — scale up.
3. **A heading is always a full step above the text it heads.** Never differentiate a heading from
   its own body by weight alone.

Editorial rule carried over from the product: **one plain statement per section** — no numbered
eyebrows, no italic accent word, no kicker line above the heading. The intro is the one editorial
exception: it uses dot-eyebrows (`● ABOUT STAYSPHERE`, `● THE DIFFERENCE IN NUMBERS`) and a
two-tone statement (muted context line, ink claim) — a magazine opener, not a section heading.

---

## 3. Layout & spacing

### Container

Two fixed horizontal padding tiers, applied flat (no responsive step):

| Tier | Padding | Where |
| --- | --- | --- |
| Content | `32px` (`px-8`) | `.container-site` — the standard section container, the floating nav, and the hero (`--hero-pad` is an alias of the same value) |
| Narrow | `48px` (`px-12`) | `.container-narrow` — text-heavy/single-column sections |

`.container-site` and `.container-narrow` are **flat `padding-inline`, no `max-width`** — content
runs full-bleed at every viewport width, so the inset is exactly the padding value and nothing
else (no auto-margin from a width cap stacking on top of it). The floating nav and the hero header
use the same `px-8` directly (no wrapping `max-w-*`), so both read as one header at any width.

### Vertical rhythm

| Step | Classes | px |
| --- | --- | --- |
| Section top padding | `pt-24 sm:pt-32 lg:pt-40` | 96 → 128 → 160 |
| Heading → lede | `mt-6` | 24 |
| Heading → content block | `mt-14` (also `mt-12`/`mt-16`/`mt-20`) | 56 |
| Card padding | `p-7` | 28 |
| Grid gap | `gap-4` (cards), `gap-3`/`sm:gap-5`/`lg:gap-7` (rails) | |

Sections pad from the **top only** (`pt-*`, never `py-*`) so the spacing between two sections is
owned by exactly one of them.

### Breakpoints

Tailwind defaults. The three that matter: `sm` 40rem/640px, `lg` 64rem/1024px, `xl` 80rem/1280px.
CSS in `index.css` uses the same values in the modern form: `@media (width >= 64rem)`.

### Grids

`grid gap-4 sm:grid-cols-2 lg:grid-cols-4` is the standard card grid. Horizontal rails use
`snap-x snap-mandatory` below `lg` and a transform-driven track from `lg` up.

---

## 4. Radii, elevation, surfaces

| Token | Value | Tailwind | Use |
| --- | --- | --- | --- |
| `--radius-card` | 28px | `rounded-card` | Cards, panels, mobile menu |
| `--radius-tile` | 20px | `rounded-tile` | Small tiles, inner shots |
| — | full | `rounded-full` | Every button, pill, chip, icon button |

> Always use `rounded-card` / `rounded-tile`, never the literal `rounded-[28px]` / `rounded-[20px]`
> — the whole codebase is standardized on the tokens now, so a new literal is a regression, not a
> style choice. Small text badges/chips use `rounded-full` like every other pill, never a bespoke
> small radius (e.g. `rounded-[5px]`).

Hero and device frames carry their own geometry: hero card 32px → 44px at `lg`, phone frame 44px
(screen 36px), desktop frame 22px (screen 16px).

### Shadows

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-soft` | `0 1px 2px #1616160a, 0 12px 32px -16px #16161629` | Resting cards |
| `--shadow-soft-lg` | `0 2px 4px #1616160d, 0 28px 60px -28px #1616163d` | Hover, floating nav, screenshots |
| `--shadow-soft-xl` | `0 2px 4px #1616160d, 0 40px 90px -30px #16161652` | Device frames |

All three are long, low-opacity, ink-tinted — never grey or black. Card hover lifts
`shadow-soft → shadow-soft-lg` over `duration-300`.

### Screenshot surfaces

`.shot` renders a product capture as a layout element, not a pasted image: full width,
`--radius-card`, `--shadow-soft-lg`, white backing. Modifiers `.shot-tile` (tile radius, soft
shadow) and `.shot-flat` (no shadow).

---

## 5. Motion

Shared easing: `ease = [0.22, 1, 0.36, 1]`, exported from
[`src/components/motion.tsx`](src/components/motion.tsx). Use it for anything new.

| Pattern | Where | Behaviour |
| --- | --- | --- |
| `.reveal` | `useReveal()` + `<Reveal>` | 18px rise + fade, 0.9s, staggered via `--reveal-delay` |
| `.split-heading` | `<AnimatedHeading>` | Words rise `0.9em`, un-blur from `10px`, 45ms stagger, plays once at 20% visibility |
| `<FadeIn>` | motion.tsx | y 24 → 0, 0.9s, `once: true`, `-10%` viewport margin |
| `<Panel>` | motion.tsx | Scroll-linked: opacity 0.18 → 1, scale 0.965 → 1, y 32 → 0 |
| `<Parallax>` | motion.tsx | ±40px drift against scroll |
| `<Magnetic>` | Magnetic.tsx | Cursor pull, strength 0.3, spring 260/20/0.6 |
| Card hover | inline | `whileHover={{ y: -6 }}` + shadow step |
| Hero intro | CSS keyframes | Card fades in as a header-height strip then grows down (0.75s) |
| Smooth scroll | Lenis | `lerp: 0.1`, anchors routed through Lenis at 1.2s |

**Reduced motion is non-negotiable.** Every pattern above has a `prefers-reduced-motion: reduce`
escape: CSS animations collapse to their end state, Lenis is never instantiated, `useReducedMotion()`
disables magnetic and hover transforms. Anything new must do the same.

---

## 6. Components

Shared primitives live in [`src/components/ui.tsx`](src/components/ui.tsx).

### `<Button>`

Pill, `font-semibold`, `transition-colors duration-200`, icon gap 2.

| Size | Classes |
| --- | --- |
| `md` (default) | `min-h-11 px-5 text-sm` |
| `lg` | `min-h-12 px-6 text-base` |

| Variant | Treatment |
| --- | --- |
| `primary` | ink fill, light text |
| `secondary` | white card, soft shadow, stone hover |
| `inverse` | `#F7F5F0` fill, ink text — for dark sections |
| `ghost` | transparent, stone hover |
| `ghost-inverse` | frosted outline for photography/ink backgrounds |

### Others

- **`<Reveal as delay>`** — wraps children in the scroll-reveal container.
- **`<Shot src alt tile flat>`** — product screenshot as a layout surface.
- **`<Chip tone>`** — `stone` | `sage` | `clay` | `sand` | `rose`, `text-xs font-medium`, pill.
- **`<ArrowRight>` / `<ArrowUpRight>`** — 20-grid strokes, `1.6` width, round caps, `size-4`.
- **`<AnimatedHeading as id className text delay stagger>`** — the standard section heading.
- **`<Magnetic strength>`** — cursor-following wrapper for CTAs.

Icons are inline SVG only, no icon library: 20-grid strokes at `1.6` for UI, 24-grid **filled**
shapes with even-odd holes for decorative marks.

---

## 7. UX principles

The four principles the product page itself argues for — they apply to this page too:

1. **Direct** — the hotel owns the guest journey. No redirect, no marketplace between guest and property.
2. **Clear** — one question per screen, the total always in view, confident decisions.
3. **Flexible** — white-label; brand changes are token changes (colour, type, imagery), not code changes.
4. **Conversion-focused** — remove friction between discovering a room and confirming a stay.

### Accessibility contract

- Skip link is the first focusable element ([`src/App.tsx`](src/App.tsx)).
- Every `<section>` has an `id` and `aria-labelledby` pointing at its heading's `id`.
- `<AnimatedHeading>` renders the full string in an `.sr-only` span and marks the animated words
  `aria-hidden` — screen readers get one clean sentence.
- Interactive targets are at least 44px (`min-h-11`, `size-10`+).
- Hidden chrome is truly hidden: the floating nav is `inert` and `pointer-events-none` while out.
- Menus close on `Escape`, expose `aria-expanded` / `aria-controls`.
- Stepper labels carry `aria-current="step"`; focus rings use `focus-visible` with real offset.
- Images are either meaningfully described or `aria-hidden` if decorative.

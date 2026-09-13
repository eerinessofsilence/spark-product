import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { STAYSPHERE_URL } from '../lib/links'
import { AnimatedHeading } from './AnimatedHeading'
import { FadeIn } from './motion'
import { ArrowUpRight, Shot } from './ui'

type Tone = 'sage' | 'stone' | 'sand' | 'clay' | 'rose'
type Tag = { label: string; tone: Tone; key: 'sea' | 'king' | 'suite' | 'balcony' | 'available' }

const tags: Tag[] = [
  { label: 'Sea view', tone: 'sage', key: 'sea' },
  { label: 'King bed', tone: 'stone', key: 'king' },
  { label: 'Suite', tone: 'sand', key: 'suite' },
  { label: 'Private balcony', tone: 'clay', key: 'balcony' },
  { label: 'Hide fully booked', tone: 'rose', key: 'available' },
]

// Same dates as the rest of the demo links on this page.
const STAY_QUERY = 'checkIn=2026-11-05&checkOut=2026-11-08&adults=2&children=0'

/** The eight room cards from the demo, with the facts the filters look at.
    slug is the room's own page in the demo, not the search results list. */
const cards = [
  { n: 1, slug: 'corner-suite', name: 'Corner Suite', sea: true, king: true, suite: true, balcony: true, available: true },
  { n: 3, slug: 'coastal-twin', name: 'Coastal Twin', sea: false, king: false, suite: false, balcony: false, available: false },
  { n: 2, slug: 'deluxe-sea', name: 'Deluxe Sea View', sea: true, king: true, suite: false, balcony: true, available: true },
  { n: 4, slug: 'sea-view-room', name: 'Sea View Room', sea: true, king: false, suite: false, balcony: true, available: true },
  { n: 5, slug: 'cove-studio', name: 'Cove Studio', sea: false, king: false, suite: false, balcony: true, available: true },
  { n: 6, slug: 'pool-terrace', name: 'Pool Terrace Room', sea: false, king: true, suite: false, balcony: false, available: false },
  { n: 7, slug: 'asteria-penthouse', name: 'Asteria Penthouse', sea: true, king: true, suite: true, balcony: true, available: true },
  { n: 8, slug: 'two-bedroom-residence', name: 'Two-Bedroom Sea Residence', sea: true, king: true, suite: false, balcony: false, available: true },
].map((c) => ({ ...c, src: `/ui/d-roomcard-${c.n}.webp`, href: `${STAYSPHERE_URL}rooms/${c.slug}?${STAY_QUERY}` }))

/** How many of the eight cards match each facet, shown in its chip — same idea as
    a marketplace's "Villas · 14 available", scaled to this demo's eight rooms. */
const tagCounts: Record<Tag['key'], number> = Object.fromEntries(tags.map((t) => [t.key, cards.filter((c) => c[t.key]).length])) as Record<Tag['key'], number>

const idle: Record<Tone, string> = {
  stone: 'bg-stone text-[#5f5e58]',
  sage: 'bg-tint-sage text-tint-sage-ink',
  clay: 'bg-tint-clay text-tint-clay-ink',
  sand: 'bg-tint-sand text-tint-sand-ink',
  rose: 'bg-tint-rose text-tint-rose-ink',
}
const on: Record<Tone, string> = {
  stone: 'bg-ink text-primary-foreground',
  sage: 'bg-tint-sage-ink text-white',
  clay: 'bg-tint-clay-ink text-white',
  sand: 'bg-tint-sand-ink text-white',
  rose: 'bg-tint-rose-ink text-white',
}

/**
 * The product's filter chips, made real: they tumble in one by one, then a
 * short demo switches them on in sequence and the rail below narrows with
 * them, as if a guest were closing in on a room. The first click hands
 * control to the visitor.
 */
function FilterTags({ active, onToggle, onEnter }: { active: number[]; onToggle: (i: number) => void; onEnter: () => void }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className="flex flex-wrap items-center gap-2" onViewportEnter={onEnter} viewport={{ once: true, amount: 0.6 }} role="group" aria-label="Room filters">
      {tags.map((t, i) => {
        const isOn = active.includes(i)
        const rot = (i % 2 ? 1 : -1) * (5 + i)
        return (
          <motion.button
            key={t.key}
            type="button"
            layout
            aria-pressed={isOn}
            onClick={() => onToggle(i)}
            initial={reduce ? false : { opacity: 0, y: 18, rotate: rot, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20, delay: i * 0.07 }}
            className={`inline-flex cursor-pointer items-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-300 select-none ${isOn ? on[t.tone] : idle[t.tone]}`}
          >
            <AnimatePresence initial={false}>
              {isOn && (
                <motion.span
                  key="check"
                  initial={{ width: 0, opacity: 0, marginRight: 0 }}
                  animate={{ width: 12, opacity: 1, marginRight: 6 }}
                  exit={{ width: 0, opacity: 0, marginRight: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                  className="inline-flex overflow-hidden"
                  aria-hidden
                >
                  <svg viewBox="0 0 12 12" className="size-3 shrink-0" fill="none">
                    <path d="m2.5 6.2 2.3 2.3 4.7-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
            {t.label} <span className={isOn ? 'opacity-70' : 'opacity-60'}>· {tagCounts[t.key]}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

export function RoomShowcase() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number[]>([])
  const [started, setStarted] = useState(false)
  const [auto, setAuto] = useState(true)

  // Demo: switch the first three filters on one at a time, hold, clear, repeat.
  // Three is the sweet spot: the rail visibly narrows (8 → 5 → 4 → 3 cards) but
  // never collapses to a couple of cards and a field of empty track.
  const DEMO_STEPS = 3
  useEffect(() => {
    if (!started || !auto || reduce) return
    let step = 0
    const t = setInterval(() => {
      step = (step + 1) % (DEMO_STEPS + 3)
      setActive(step === 0 ? [] : tags.slice(0, Math.min(step, DEMO_STEPS)).map((_, i) => i))
    }, 1300)
    return () => clearInterval(t)
  }, [started, auto, reduce])

  const toggle = (i: number) => {
    // The demo may already have some tags lit when the visitor clicks: that
    // state was never chosen by them, so a first manual click replaces it
    // rather than toggling on top of it (which used to silently combine the
    // demo's current filters with whatever the visitor meant to pick alone).
    setActive((a) => (auto ? [i] : a.includes(i) ? a.filter((k) => k !== i) : [...a, i]))
    setAuto(false)
  }

  const visible = cards.filter((c) => active.every((i) => c[tags[i].key]))

  // Native horizontal scroll with snap (wheel, trackpad, touch, keyboard all
  // work for free) instead of a drag-only track; it re-centres to the start
  // whenever the filtered set changes.
  const list = useRef<HTMLUListElement>(null)
  useEffect(() => {
    list.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }, [visible.length])

  return (
    <section id="rooms" className="pt-24 sm:pt-32 lg:pt-40" aria-labelledby="rooms-heading">
      <div className="container-site flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <div className="max-w-xl">
          <AnimatedHeading id="rooms-heading" className="text-display max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl" text="Rooms that sell the experience." />
          <FadeIn delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Twenty rooms, one card format. Each answers what it looks like, how big it is and what it costs tonight.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.2}>
          <a href={`${STAYSPHERE_URL}rooms?${STAY_QUERY}`} target="_blank" rel="noreferrer" className="group inline-flex shrink-0 items-center gap-2 text-base font-semibold text-ink">
            See all 20 rooms
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-stone text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-primary-foreground"><ArrowUpRight /></span>
          </a>
        </FadeIn>
      </div>

      {/* Filters for the rail below: grouped with it, not with the heading */}
      <div className="container-site mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-3">
        <span className="text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase">Filter</span>
        <FilterTags active={active} onToggle={toggle} onEnter={() => setStarted(true)} />
        <span className="ml-auto text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {visible.length} of {cards.length} rooms
        </span>
      </div>

      {/* Rail of real room cards, edge-to-edge like the product's room rails. Native
          scroll + snap: wheel, trackpad, touch and keyboard all work, not drag-only. */}
      <ul
        ref={list}
        className="mt-6 flex snap-x snap-proximity gap-5 overflow-x-auto px-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((c, i) => (
            <motion.li
              key={c.src}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.86, y: 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26, delay: i * 0.03 }}
              className="w-[240px] shrink-0 snap-start sm:w-[280px]"
            >
              <motion.a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -8, rotate: -0.6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group relative block"
                aria-label={`${c.name}: open in StaySphere`}
              >
                {/* Clipping lives on a non-animating wrapper: rounding + overflow-hidden on the same
                    element that also carries the hover transform lets the tile's box-shadow bleed
                    past the rounded corners mid-rotation in Chromium, so the transform is kept here
                    on the outer <a> instead. */}
                <div className="relative overflow-hidden rounded-tile">
                  <Shot src={c.src} alt={`Room card: ${c.name}`} width={498} height={572} className="pointer-events-none select-none" tile />
                  <span aria-hidden className="pointer-events-none absolute inset-0 rounded-tile bg-ink/0 transition-colors duration-300 group-hover:bg-ink/[0.06]" />
                  {/* Sits over the photo, clear of the room name and rate baked into the lower part of the capture */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-3 right-3 inline-flex -translate-y-2 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-primary-foreground opacity-0 shadow-soft transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    Open in StaySphere <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </motion.a>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  )
}

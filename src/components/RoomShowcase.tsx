import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BOOKING_URL } from '../lib/links'
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

/** The eight room cards from the demo, with the facts the filters look at. */
const cards = [
  { n: 1, name: 'Corner Suite', sea: true, king: true, suite: true, balcony: true, available: true },
  { n: 3, name: 'Coastal Twin', sea: false, king: false, suite: false, balcony: false, available: false },
  { n: 2, name: 'Deluxe Sea View', sea: true, king: true, suite: false, balcony: true, available: true },
  { n: 4, name: 'Sea View Room', sea: true, king: false, suite: false, balcony: true, available: true },
  { n: 5, name: 'Cove Studio', sea: false, king: false, suite: false, balcony: true, available: true },
  { n: 6, name: 'Pool Terrace Room', sea: false, king: true, suite: false, balcony: false, available: false },
  { n: 7, name: 'Asteria Penthouse', sea: true, king: true, suite: true, balcony: true, available: true },
  { n: 8, name: 'Two-Bedroom Sea Residence', sea: true, king: true, suite: false, balcony: false, available: true },
].map((c) => ({ ...c, src: `/ui/d-roomcard-${c.n}.webp` }))

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
            {t.label}
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

  // Demo: switch the filters on one at a time, hold, clear, repeat.
  useEffect(() => {
    if (!started || !auto || reduce) return
    let step = 0
    const t = setInterval(() => {
      step = (step + 1) % (tags.length + 3)
      setActive(step === 0 ? [] : tags.slice(0, Math.min(step, tags.length)).map((_, i) => i))
    }, 1300)
    return () => clearInterval(t)
  }, [started, auto, reduce])

  const toggle = (i: number) => {
    setAuto(false)
    setActive((a) => (a.includes(i) ? a.filter((k) => k !== i) : [...a, i]))
  }

  const visible = cards.filter((c) => active.every((i) => c[tags[i].key]))

  // Drag rail: constraints follow the rail's real width, and the rail slides
  // back to the start whenever the set of cards changes.
  const track = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const x = useMotionValue(0)
  const [drag, setDrag] = useState(0)
  useEffect(() => {
    const el = track.current
    const ul = list.current
    if (!el || !ul) return
    const calc = () => setDrag(Math.max(0, ul.scrollWidth - el.clientWidth))
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    ro.observe(ul)
    return () => ro.disconnect()
  }, [])
  useEffect(() => {
    animate(x, 0, { type: 'spring', stiffness: 200, damping: 28 })
  }, [visible.length, x])

  // A drag must not turn into a click on the card underneath.
  const dragged = useRef(false)

  return (
    <section id="rooms" className="pt-32 sm:pt-40 lg:pt-52" aria-labelledby="rooms-heading">
      <div className="container-site">
        <AnimatedHeading id="rooms-heading" className="text-display max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl" text="Rooms that sell the experience." />
        <FadeIn delay={0.15}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Twenty rooms, one card format. Each answers what it looks like, how big it is and what it costs tonight.
          </p>
        </FadeIn>
      </div>

      {/* Filters for the rail below: grouped with it, not with the heading */}
      <div className="container-site mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-3">
        <span className="text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase">Filter</span>
        <FilterTags active={active} onToggle={toggle} onEnter={() => setStarted(true)} />
      </div>

      {/* Draggable rail of real room cards, edge-to-edge like the product's room rails */}
      <div className="mt-6 overflow-hidden" ref={track}>
        <motion.ul
          ref={list}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -drag, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 50)}
          className="flex cursor-grab gap-5 px-[max(3rem,calc((100vw-1400px)/2+3rem))] active:cursor-grabbing"
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
                className="w-[240px] shrink-0 sm:w-[280px]"
              >
                <motion.a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  draggable={false}
                  onClick={(e) => dragged.current && e.preventDefault()}
                  whileHover={{ y: -8, rotate: -0.6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="group relative block"
                  aria-label={`${c.name}: open in StaySphere`}
                >
                  {/* Clipping lives on a non-animating wrapper: rounding + overflow-hidden on the same
                      element that also carries the hover transform lets the tile's box-shadow bleed
                      past the rounded corners mid-rotation in Chromium, so the transform is kept here
                      on the outer <a> instead. */}
                  <div className="relative overflow-hidden rounded-[20px]">
                    <Shot src={c.src} alt={`Room card: ${c.name}`} width={498} height={572} className="pointer-events-none select-none" tile />
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] bg-ink/0 transition-colors duration-300 group-hover:bg-ink/[0.06]" />
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
        </motion.ul>
      </div>
    </section>
  )
}

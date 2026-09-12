import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { STAYSPHERE_URL } from '../lib/links'
import { AnimatedHeading } from './AnimatedHeading'
import { FadeIn, Panel, Parallax } from './motion'
import { ArrowUpRight, Shot } from './ui'

const RATE = 560 // Corner Suite, per night
const CITY_FEE = 5 // per night
const PARTNER_MARKUP = 1.18 // what the same stay costs on the demo partner site, matching the 18% commission stat above
const CHECK_IN = new Date(2026, 10, 5) // Thu 5 Nov 2026, as in the demo
const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })
const day = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
const iso = (d: Date) => d.toISOString().slice(0, 10)

/**
 * The product's stay card, built for real instead of captured: pick the
 * number of nights and the total, the saving and the check-out date follow,
 * and the button opens exactly that stay in the live demo.
 */
function StayCard() {
  const [nights, setNights] = useState(3)
  const checkOut = new Date(CHECK_IN)
  checkOut.setDate(CHECK_IN.getDate() + nights)
  const rooms = RATE * nights
  const fees = CITY_FEE * nights
  const total = rooms + fees
  const partner = Math.round(total * PARTNER_MARKUP)
  const href = `${STAYSPHERE_URL}rooms?checkIn=${iso(CHECK_IN)}&checkOut=${iso(checkOut)}&adults=2&children=0`
  return (
    <div className="rounded-[28px] bg-card p-6 shadow-soft-lg sm:p-7" aria-live="polite">
      <p className="text-sm text-muted-foreground">Your stay</p>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Check-in</p>
          <p className="mt-0.5 font-semibold">{day.format(CHECK_IN)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Check-out</p>
          <Money value={day.format(checkOut)} className="mt-0.5 block font-semibold" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-stone/60 py-2 pr-2 pl-4">
        <span className="text-sm">
          <Money value={`${nights} ${nights === 1 ? 'night' : 'nights'}`} className="font-semibold" /> · 2 adults
        </span>
        <span className="inline-flex items-center gap-1" role="group" aria-label="Nights">
          <button type="button" onClick={() => setNights((n) => Math.max(1, n - 1))} disabled={nights <= 1} aria-label="One night fewer" className="inline-flex size-9 items-center justify-center rounded-full bg-card text-ink shadow-soft transition-colors hover:bg-white disabled:opacity-40">
            <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden><path d="M5 10h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <button type="button" onClick={() => setNights((n) => Math.min(14, n + 1))} disabled={nights >= 14} aria-label="One night more" className="inline-flex size-9 items-center justify-center rounded-full bg-card text-ink shadow-soft transition-colors hover:bg-white disabled:opacity-40">
            <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden><path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </span>
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-5">
        <Row label={`${eur.format(RATE)} × ${nights} ${nights === 1 ? 'night' : 'nights'}`} value={eur.format(rooms)} />
        <Row label="Taxes and city fees" value={eur.format(fees)} />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-border pt-5">
        <span className="font-semibold">Total</span>
        <Money value={eur.format(total)} className="text-display text-3xl" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-semibold text-accent-strong">{eur.format(partner - total)} less</span> than the {eur.format(partner)} demo partner-site price. A simulated comparison, not a live rate.
      </p>

      <a href={href} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
        Book this room in StaySphere <ArrowUpRight />
      </a>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Opens the live demo with these dates. Payment there is simulated and no card details are collected.</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-base">
      <span className="text-muted-foreground">{label}</span>
      <Money value={value} />
    </div>
  )
}

/** A value that ticks over in place when it changes. */
function Money({ value, className = '' }: { value: string; className?: string }) {
  return (
    <span className={`relative inline-grid overflow-hidden tabular-nums ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="[grid-area:1/1]">
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function IconCamera({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 7a1.5 1.5 0 0 1 1.5-1.5h1.4l.7-1.1a1 1 0 0 1 .84-.4h2.14a1 1 0 0 1 .84.4l.7 1.1h1.4A1.5 1.5 0 0 1 16 7v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 13.5V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function IconSpace({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 7.5V5a1 1 0 0 1 1-1h2.5M16 7.5V5a1 1 0 0 0-1-1h-2.5M4 12.5V15a1 1 0 0 0 1 1h2.5M16 12.5V15a1 1 0 0 1-1 1h-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconAmenities({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="4" y="4" width="5" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11" y="4" width="5" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="11" width="5" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11" y="11" width="5" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function IconPricing({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 4h5.17a1 1 0 0 1 .71.29l6 6a1 1 0 0 1 0 1.42l-4.17 4.17a1 1 0 0 1-1.42 0l-6-6A1 1 0 0 1 4 9.17V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.3" cy="7.3" r="1" fill="currentColor" />
    </svg>
  )
}
function IconCancellation({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M10 3.3 15.5 5v4.2c0 3.6-2.3 5.9-5.5 6.9-3.2-1-5.5-3.3-5.5-6.9V5L10 3.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.3 10 9 11.7l3.2-3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconAvailability({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="4" y="5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 8.3h12M7 3.5v3M13 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.3 11.5 9 13.2l3.5-3.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** What the room page answers, each represented by a meaning-matched icon rather than a photo. */
const points = [
  { title: 'Photography', text: 'Living room, bedroom, bathroom and a 360° view, switchable in place. Thumbnails sit below the hero shot, no pop-up lightbox.', icon: IconCamera, tone: 'sage' as const },
  { title: 'Space', text: 'Square metres, floor, sleeps and bed type as chips under the gallery, pulled straight from the room record.', icon: IconSpace, tone: 'clay' as const },
  { title: 'Amenities', text: 'Wi-Fi, air conditioning, balcony, espresso machine: one tile each, in a rail that scrolls instead of a bullet list.', icon: IconAmenities, tone: 'sand' as const },
  { title: 'Pricing', text: 'The stay total updates live in a sticky card: nights, taxes and fees, before a guest commits to anything.', icon: IconPricing, tone: 'rose' as const },
  { title: 'Cancellation', text: 'Free cancellation up to 72 hours before arrival, stated once in plain language, not buried in a linked policy page.', icon: IconCancellation, tone: 'stone' as const },
  { title: 'Availability', text: 'Real inventory for the exact dates searched. A sold-out room says so instead of quietly disappearing from the grid.', icon: IconAvailability, tone: 'sage' as const },
]

const toneClasses = {
  stone: 'bg-stone text-[#5f5e58]',
  sage: 'bg-tint-sage text-tint-sage-ink',
  clay: 'bg-tint-clay text-tint-clay-ink',
  sand: 'bg-tint-sand text-tint-sand-ink',
  rose: 'bg-tint-rose text-tint-rose-ink',
}

export function RoomDetails() {
  return (
    <section id="room" className="pt-32 sm:pt-40 lg:pt-52" aria-labelledby="room-heading">
      <div className="container-site">
        <AnimatedHeading id="room-heading" className="text-display max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl" text="More than a room card." />
        <FadeIn delay={0.15}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Gallery, pricing, policies and availability, all on the page a guest is already looking at, not buried behind another click.
          </p>
        </FadeIn>

        <div className="relative mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Panel className="lg:col-span-8">
            {/* The gallery capture opens the real room page, and says so on hover */}
            <a href={`${STAYSPHERE_URL}rooms?checkIn=2026-11-05&checkOut=2026-11-08&adults=2&children=0`} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-[28px]" aria-label="Corner Suite gallery: open the room in StaySphere">
              <Shot src="/ui/d-room-gallery.webp" alt="Corner Suite gallery with 360° view and thumbnails" width={1856} height={1284} className="transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/[0.06]" />
              <span aria-hidden className="pointer-events-none absolute top-4 right-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-primary-foreground opacity-0 shadow-soft transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Open in StaySphere <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          </Panel>
          <Parallax amount={50} className="lg:col-span-4 lg:self-end lg:-ml-20">
            <StayCard />
          </Parallax>
        </div>
      </div>

      {/* Six icon tiles, in the spirit of a hotel's amenity grid — narrow container:
          dense, centred, character-capped copy reads better with more edge room */}
      <ul className="container-narrow mt-20 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:mt-28 lg:gap-y-12">
        {points.map((p, i) => (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.08 }}
            className="group flex flex-col items-center text-center"
          >
            <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className={`relative flex size-24 items-center justify-center rounded-full shadow-soft ring-1 ring-ink/5 transition-shadow duration-300 group-hover:shadow-soft-lg sm:size-28 lg:size-32 ${toneClasses[p.tone]}`}>
              <p.icon className="size-8 transition-transform duration-300 group-hover:scale-110 sm:size-9 lg:size-10" />
            </motion.div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 max-w-[28ch] text-base leading-relaxed text-muted-foreground">{p.text}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

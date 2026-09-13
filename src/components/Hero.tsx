import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BOOKING_URL } from '../lib/links'
import { HeroHeader } from './HeroHeader'
import { ease } from './motion'

// One coast, one light: every slide is Mediterranean and warm, so the
// carousel reads as four views of the same place rather than four hotels.
// `pos` is the object-position: where the photo's subject sits, so cover-cropping
// keeps it (the balcony's breakfast table is in the lower third of a portrait
// frame; the bedroom's sea is right of a dead-centre door mullion).
const slides = [
  { src: '/photos/hotel-cove.webp', label: ['The', 'cove'], alt: 'Asteria Cove: the pool on the rocks above the bay' },
  { src: '/photos/rooms-deluxe-sea-balcony.webp', label: ['Sea-view', 'balcony'], alt: 'Asteria Cove: breakfast on a sea-view balcony', pos: '50% 78%' },
  { src: '/photos/rooms-deluxe-sea-bedroom.webp', label: ['Deluxe', 'sea view'], alt: 'Asteria Cove: deluxe sea-view bedroom', pos: '62% 50%' },
  { src: '/photos/hotel-pool.webp', label: ['Infinity', 'pool'], alt: 'Asteria Cove: the infinity pool above the sea' },
]
const TITLE = ['Stay', 'Sphere']
const INTERVAL = 6500

function IconCalendar() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0 sm:size-[18px]" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 8h13M6.5 3v3M13.5 3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function IconGuests() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0 sm:size-[18px]" fill="none" aria-hidden>
      <circle cx="7.2" cy="6.7" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.8 16c.5-3 2-4.6 4.4-4.6s3.9 1.6 4.4 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.8 4.6a2.4 2.4 0 0 1 0 4.6M14.6 11.7c1.9.5 3 1.9 3.4 4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 sm:size-[18px]" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m17 17-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Dark inset hero card: header row on top, the property photography
 * edge to edge below it, the product name set as an oversized two-line
 * wordmark, and a glass slide card with index, label and arrows.
 * Intro: the card grows out of a header-height strip, the header fills in,
 * the photo un-blurs, the title rises line by line, then the slide card.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const [intro, setIntro] = useState(!reduce)
  const [i, setI] = useState(0)
  const n = slides.length
  // Any manual navigation hands control to the visitor for good — an
  // auto-advancing carousel that keeps moving a photo someone just picked is
  // the opposite of "look at this one". Hover/focus only pauses, since the
  // visitor may come back to just look rather than to choose.
  const [auto, setAuto] = useState(true)
  const [paused, setPaused] = useState(false)
  const go = (d: number) => {
    setAuto(false)
    setI((v) => (v + d + n) % n)
  }

  useEffect(() => {
    if (!auto || paused || reduce) return
    const t = setTimeout(() => setI((v) => (v + 1) % n), INTERVAL)
    return () => clearTimeout(t)
  }, [i, n, auto, paused, reduce])

  const t = (delay: number, duration: number) => (reduce ? { duration: 0 } : { duration, ease, delay })
  const slide = slides[i]

  // Parallax: as the card scrolls out, the photo drifts down at a fraction of
  // the scroll speed. It is scaled from its bottom edge so the extra 15% sits
  // above the card, and the drift never exposes a gap at the top.
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <section id="top" className="hero-shell" aria-labelledby="hero-heading">
      <div
        ref={cardRef}
        className={`hero-card ${intro ? 'is-intro' : ''}`}
        onAnimationEnd={(e) => e.animationName === 'hero-grow' && setIntro(false)}
      >
        <HeroHeader />

        <motion.div
          className="hero-media"
          style={reduce ? undefined : { y: mediaY, scale: 1.15, originY: 1 }}
          initial={reduce ? false : { opacity: 0, filter: 'blur(16px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={t(1.1, 1.1)}
        >
          <AnimatePresence mode="sync">
            <motion.img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              style={{ objectPosition: slide.pos }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.6, ease: 'easeInOut' }}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </AnimatePresence>
        </motion.div>

        <div className="hero-lead">
          <h1 id="hero-heading" className="hero-title">
            <span className="sr-only">StaySphere. The direct-booking experience, built for independent hotels.</span>
            {TITLE.map((line, k) => (
              <motion.span
                key={line}
                aria-hidden
                initial={reduce ? false : { opacity: 0, y: '0.3em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={t(1.2 + k * 0.18, 1.05)}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* The product's own search bar, made real: it opens the live demo already
              searched for these dates, so the first thing a visitor can do is the
              thing the whole product is about. */}
          <motion.a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="hero-search group"
            aria-label="Search this stay in StaySphere: Thu 5 Nov to Sun 8 Nov, 2 adults"
            initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={t(1.55, 0.85)}
          >
            <span className="hero-search-field">
              <IconCalendar />
              <span>Thu 5 Nov</span>
            </span>
            <span aria-hidden className="hero-search-divider" />
            <span className="hero-search-field">
              <IconCalendar />
              <span>Sun 8 Nov</span>
            </span>
            <span aria-hidden className="hero-search-divider hero-search-divider--guests" />
            <span className="hero-search-field hero-search-field--guests">
              <IconGuests />
              <span>2 adults</span>
            </span>
            <span aria-hidden className="hero-search-submit">
              <IconSearch />
            </span>
          </motion.a>
        </div>

        <motion.aside
          className="hero-slide-card"
          aria-label="Property gallery"
          initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={t(1.9, 0.85)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="hero-slide-meta">
            <div className="min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <span className="hero-slide-index">
                    {String(i + 1).padStart(2, '0')}/
                  </span>
                  <span className="hero-slide-label">
                    {slide.label.map((w) => (
                      <span key={w}>{w}</span>
                    ))}
                  </span>
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" className="hero-arrow" onClick={() => go(-1)} aria-label="Previous photo">
                <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
                  <path d="M15 10H5m0 0 4-4m-4 4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="hero-arrow" onClick={() => go(1)} aria-label="Next photo">
                <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
                  <path d="M5 10h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

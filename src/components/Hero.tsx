import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { HeroHeader } from './HeroHeader'
import { ease } from './motion'

const slides = [
  { src: '/photos/hotel-pool.webp', label: ['Infinity', 'pool'], alt: 'Asteria Cove: the infinity pool above the sea' },
  { src: '/photos/rooms-pool-terrace-terrace.webp', label: ['Palm', 'terrace'], alt: 'Asteria Cove: pool terrace under the palms' },
  { src: '/photos/rooms-deluxe-sea-bedroom.webp', label: ['Deluxe', 'sea view'], alt: 'Asteria Cove: deluxe sea-view bedroom' },
  { src: '/photos/rooms-panorama-suite-terrace.webp', label: ['Panorama', 'suite'], alt: 'Asteria Cove: the panorama suite terrace' },
]
const TITLE = ['Stay', 'Sphere']
const INTERVAL = 6500

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
  const go = (d: number) => setI((v) => (v + d + n) % n)

  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % n), INTERVAL)
    return () => clearTimeout(t)
  }, [i, n])

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
      <HeroHeader />

      <div
        ref={cardRef}
        className={`hero-card ${intro ? 'is-intro' : ''}`}
        onAnimationEnd={(e) => e.animationName === 'hero-grow' && setIntro(false)}
      >
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.6, ease: 'easeInOut' }}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </AnimatePresence>
        </motion.div>

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

        <motion.aside
          className="hero-slide-card"
          aria-label="Property gallery"
          initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={t(1.9, 0.85)}
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

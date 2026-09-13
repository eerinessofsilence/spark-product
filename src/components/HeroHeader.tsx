import { motion, useReducedMotion } from 'motion/react'
import { STAYSPHERE_URL } from '../lib/links'
import { useMenu } from '../lib/menu'
import { Magnetic } from './Magnetic'
import { ease } from './motion'
import { NavLinks } from './NavLinks'
import { ArrowUpRight } from './ui'

/**
 * Header row laid directly over the hero photo — no pill, no background,
 * just the wordmark, links and CTA floating on the image like the rest of
 * the hero content (the title, the search bar). The photo's own top scrim
 * (`.hero-media::after`) is what keeps it legible, not a white bar. Plays
 * the intro (CTA, wordmark wipe, links popping in left to right) once on
 * load; after that a highlight glides between the links and labels roll on
 * hover.
 */
export function HeroHeader() {
  const reduce = useReducedMotion()
  const { open, setOpen } = useMenu()
  const t = (delay: number, duration = 0.5) => (reduce ? { duration: 0 } : { duration, ease, delay })

  return (
    <div className="hero-head flex h-14 items-center gap-3 lg:h-16">
      <motion.a
        href="#top"
        aria-label="Spark StaySphere, back to top"
        className="flex shrink-0 items-center gap-3"
        initial={reduce ? false : { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, filter: 'blur(5px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, filter: 'blur(0px)' }}
        transition={t(0.5, 0.7)}
        whileHover={reduce ? undefined : { scale: 1.04, rotate: -2 }}
      >
        <img src="/brand/spark-logo-footer.svg" alt="Spark" className="h-6 w-auto lg:h-7" width={331} height={85} decoding="async" />
        <span aria-hidden className="hidden h-4 w-px bg-white/25 sm:block" />
        <span className="hidden text-base font-medium tracking-tight text-white/70 sm:inline">StaySphere</span>
      </motion.a>

      <NavLinks
        variant="overlay"
        label="Product page"
        className="mx-auto hidden lg:flex xl:absolute xl:left-1/2 xl:mx-0 xl:-translate-x-1/2"
        intro={(i) => ({
          initial: reduce ? false : { opacity: 0, y: 6, scale: 0.94, filter: 'blur(4px)' },
          animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
          transition: t(0.75 + i * 0.09, 0.55),
        })}
      />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/* Hidden below 460px: most phones don't have room for it next to the menu
            button, which must stay reachable — that one's never hidden. */}
        <Magnetic className="hidden min-[460px]:inline-flex">
          <motion.a
            href={STAYSPHERE_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-primary-hover lg:h-11 lg:px-5"
            initial={reduce ? false : { opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.96 }}
            transition={t(0.55, 0.55)}
          >
            Explore StaySphere <ArrowUpRight className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
          </motion.a>
        </Magnetic>
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex size-10 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur-md transition-colors hover:bg-ink/80 lg:hidden"
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t(0.5, 0.35)}
        >
          <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
            {open ? (
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

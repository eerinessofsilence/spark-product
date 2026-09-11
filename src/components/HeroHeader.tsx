import { motion, useReducedMotion } from 'motion/react'
import { STAYSPHERE_URL } from '../lib/links'
import { useMenu } from '../lib/menu'
import { Magnetic } from './Magnetic'
import { ease } from './motion'
import { NavLinks } from './NavLinks'

const pill =
  'inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-[450] tracking-[0.01em] whitespace-nowrap uppercase transition-colors duration-200 xl:px-[22px] xl:text-base'

/**
 * Header row inside the hero card: wordmark left, one pill per section in
 * the middle, CTA right. Plays the intro (CTA, wordmark wipe, pills popping
 * in left to right) once on load. After that: a highlight glides between
 * the pills, labels roll on hover, the CTA leans toward the cursor.
 */
export function HeroHeader() {
  const reduce = useReducedMotion()
  const { open, setOpen } = useMenu()
  const t = (delay: number, duration = 0.5) => (reduce ? { duration: 0 } : { duration, ease, delay })

  return (
    <div className="hero-head">
      <motion.a
        href="#top"
        aria-label="Spark StaySphere, back to top"
        className="flex shrink-0 items-center"
        initial={reduce ? false : { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, filter: 'blur(5px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, filter: 'blur(0px)' }}
        transition={t(0.5, 0.7)}
        whileHover={reduce ? undefined : { scale: 1.04, rotate: -2 }}
      >
        <img src="/brand/spark-logo-on-light.svg" alt="Spark" className="h-6 w-auto lg:h-[26px]" width={331} height={85} decoding="async" />
      </motion.a>

      <NavLinks
        tone="dark"
        label="Product page"
        className="mx-auto hidden lg:flex xl:absolute xl:left-1/2 xl:mx-0 xl:-translate-x-1/2"
        intro={(i) => ({
          initial: reduce ? false : { opacity: 0, y: 6, scale: 0.94, filter: 'blur(4px)' },
          animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
          transition: t(0.75 + i * 0.09, 0.55),
        })}
      />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Magnetic className="hidden sm:inline-flex">
          <motion.a
            href={STAYSPHERE_URL}
            target="_blank"
            rel="noreferrer"
            className={`${pill} bg-[#181716] text-[#efede8] hover:bg-[#242220] hover:text-white xl:px-[26px]`}
            initial={reduce ? false : { opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.96 }}
            transition={t(0.55, 0.55)}
          >
            Explore StaySphere
          </motion.a>
        </Magnetic>
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex size-11 items-center justify-center rounded-full bg-[#181716] text-[#efede8] lg:hidden"
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t(0.5, 0.35)}
        >
          <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
            {open ? (
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            )}
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

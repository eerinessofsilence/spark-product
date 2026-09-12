import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { STAYSPHERE_URL } from '../lib/links'
import { useMenu } from '../lib/menu'
import { NAV_LINKS } from '../lib/nav'
import { useActiveSection } from '../lib/useActiveSection'
import { Magnetic } from './Magnetic'
import { ease } from './motion'
import { NavLinks } from './NavLinks'
import { ArrowUpRight } from './ui'

const HREFS = NAV_LINKS.map((l) => l.href)

/**
 * Floating nav on frosted ink: wordmark left, plain links centred, a solid
 * light CTA right. The hero card carries its own header row, so this one
 * stays hidden until that row scrolls out of view (or the mobile menu is
 * opened). A full-screen section with its own top row can hide it again
 * through `navHidden`. The link for the section in view is brightened.
 */
export function Nav() {
  const reduce = useReducedMotion()
  const { open, setOpen, navHidden } = useMenu()
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 160)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 160))
  const active = useActiveSection(HREFS)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  const visible = (scrolled || open) && !navHidden

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? 0 : -32, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45, ease }}
      inert={!visible}
      className={`fixed inset-x-0 top-0 z-40 px-12 pt-3 sm:pt-5 ${visible ? '' : 'pointer-events-none'}`}
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="relative flex h-14 items-center rounded-full border border-black/[0.06] bg-white/90 pr-2 pl-5 text-ink shadow-soft-lg backdrop-blur-xl sm:h-[72px] sm:pr-3 sm:pl-7">
          <motion.a href="#top" className="flex shrink-0 items-center gap-3" aria-label="Spark StaySphere, back to top" whileHover={reduce ? undefined : { scale: 1.04, rotate: -2 }}>
            <img src="/brand/spark-logo-on-light.svg" alt="Spark" className="h-6 w-auto sm:h-7" />
            <span className="hidden text-base font-semibold tracking-tight text-ink/85 sm:inline">StaySphere</span>
          </motion.a>

          <NavLinks tone="light" label="Product page, floating" active={active} className="absolute left-1/2 hidden -translate-x-1/2 gap-4 lg:flex" />

          <div className="ml-auto flex items-center gap-2">
            <Magnetic className="hidden sm:inline-flex">
              <a
                href={STAYSPHERE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-base font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#2b2b2b] sm:h-12"
              >
                Explore StaySphere <ArrowUpRight />
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-10 items-center justify-center rounded-full bg-black/5 text-ink transition-colors hover:bg-black/10 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden>
                {open ? <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /> : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>

        <div id="mobile-menu" hidden={!open} className="mt-2 rounded-[28px] border border-black/[0.06] bg-white/95 p-3 text-ink shadow-soft-lg backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col" aria-label="Product page, mobile">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-full px-4 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-black/5 hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-2 border-t border-black/[0.06] pt-3">
            <a href={STAYSPHERE_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white">
              Explore StaySphere <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

import { motion, type TargetAndTransition, type Transition } from 'motion/react'
import { useState } from 'react'
import { NAV_LINKS } from '../lib/nav'

type Variant = 'light' | 'overlay'
/** `light` — the floating white pill (and the hero header, when it also sits on
    white). `overlay` — laid directly over the hero photo: no track box, white
    text, a frosted glass pill for the highlight instead of solid white. */
const styles: Record<Variant, { track: string; link: string; lit: string; glider: string }> = {
  light: { track: 'bg-stone/60 p-1', link: 'text-ink/70', lit: 'text-ink', glider: 'bg-white shadow-soft' },
  overlay: { track: '', link: 'text-white/75', lit: 'text-white', glider: 'bg-white/15 backdrop-blur-md' },
}

/**
 * The section links, shared by both headers (hero and floating) so they
 * read as one nav even though one sits on a photo and the other on a white
 * pill — only `variant` differs. A pill glides between links as the pointer
 * moves (and rests on the section in view when `active` is given); each
 * label rolls up and is replaced from below on hover. With `intro` the
 * track fades in alongside the first link.
 */
export function NavLinks({
  active,
  intro,
  className = '',
  label,
  variant = 'light',
}: {
  /** href of the section currently in view; the highlight rests there. */
  active?: string
  /** Per-link entrance for the hero intro: initial/animate/transition. */
  intro?: (i: number) => { initial: false | TargetAndTransition; animate: TargetAndTransition; transition: Transition }
  className?: string
  label: string
  variant?: Variant
}) {
  const [hover, setHover] = useState<string | null>(null)
  const current = hover ?? active ?? null
  const trackIntro = intro?.(0)
  const s = styles[variant]

  return (
    <motion.nav
      className={`flex items-center gap-1 rounded-full ${s.track} ${className}`}
      aria-label={label}
      onMouseLeave={() => setHover(null)}
      initial={trackIntro ? (trackIntro.initial === false ? false : { opacity: 0 }) : false}
      animate={trackIntro ? { opacity: 1 } : undefined}
      transition={trackIntro?.transition}
    >
      {NAV_LINKS.map((l, i) => {
        const lit = current === l.href
        const entrance = intro?.(i)
        return (
          <motion.a
            key={l.href}
            href={l.href}
            aria-current={active === l.href ? 'location' : undefined}
            onHoverStart={() => setHover(l.href)}
            onFocus={() => setHover(l.href)}
            onBlur={() => setHover(null)}
            className={`group relative inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${lit ? s.lit : s.link}`}
            {...entrance}
          >
            {lit && (
              <motion.span
                layoutId={`nav-glider-${label}`}
                aria-hidden
                className={`absolute inset-0 rounded-full ${s.glider}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {/* Text roll: the label slides up and its twin slides in from below */}
            {/* Slow ease-in-out roll with a fade, so the swap reads as a glide
                rather than a snap; reduced motion just keeps the label still. */}
            <span className="relative block overflow-hidden">
              <span className="block transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:group-hover:-translate-y-full motion-safe:group-hover:opacity-0">
                {l.label}
              </span>
              <span
                aria-hidden
                className="absolute inset-0 block translate-y-full opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:group-hover:translate-y-0 motion-safe:group-hover:opacity-100"
              >
                {l.label}
              </span>
            </span>
          </motion.a>
        )
      })}
    </motion.nav>
  )
}

import { motion, type TargetAndTransition, type Transition } from 'motion/react'
import { useState } from 'react'
import { NAV_LINKS } from '../lib/nav'

/**
 * The section links, shared by both headers (hero and floating) so they
 * read as one nav. A single highlight glides between links as the pointer
 * moves (and rests on the section in view when `active` is given); each
 * label rolls up and is replaced from below on hover.
 */
export function NavLinks({
  active,
  intro,
  className = '',
  label,
}: {
  /** href of the section currently in view; the highlight rests there. */
  active?: string
  /** Per-link entrance for the hero intro: initial/animate/transition. */
  intro?: (i: number) => { initial: false | TargetAndTransition; animate: TargetAndTransition; transition: Transition }
  className?: string
  label: string
}) {
  const [hover, setHover] = useState<string | null>(null)
  const current = hover ?? active ?? null

  return (
    <nav className={`flex items-center gap-2 ${className}`} aria-label={label} onMouseLeave={() => setHover(null)}>
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
            className={`group relative inline-flex shrink-0 items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap text-ink/70 transition-colors duration-300 ${lit ? 'text-ink' : ''}`}
            {...entrance}
          >
            {lit && (
              <motion.span
                layoutId={`nav-glider-${label}`}
                aria-hidden
                className="absolute inset-0 rounded-full bg-stone"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {/* Text roll: the label slides up and its twin slides in from below */}
            <span className="relative block overflow-hidden">
              <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[115%]">{l.label}</span>
              <span aria-hidden className="absolute inset-0 block translate-y-[115%] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                {l.label}
              </span>
            </span>
          </motion.a>
        )
      })}
    </nav>
  )
}

import { motion, type TargetAndTransition, type Transition } from 'motion/react'
import { useState } from 'react'
import { NAV_LINKS } from '../lib/nav'

type Tone = 'dark' | 'light'

const tones: Record<Tone, { link: string; lit: string; glider: string }> = {
  dark: {
    link: 'h-11 px-4 text-sm font-[450] tracking-[0.01em] uppercase bg-[#0b0b0b] text-[#e6e6e6] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.045)] xl:px-[22px] xl:text-base',
    lit: 'text-white',
    glider: 'bg-[#232323]',
  },
  light: {
    link: 'px-3.5 py-2 text-sm font-medium text-ink/70',
    lit: 'text-ink',
    glider: 'bg-stone',
  },
}

/**
 * The section links, shared by both headers. A single highlight glides
 * between links as the pointer moves (and rests on the section in view when
 * `active` is given); each label rolls up and is replaced from below on hover.
 */
export function NavLinks({
  tone,
  active,
  intro,
  className = '',
  label,
}: {
  tone: Tone
  /** href of the section currently in view; the highlight rests there. */
  active?: string
  /** Per-link entrance for the hero intro: initial/animate/transition. */
  intro?: (i: number) => { initial: false | TargetAndTransition; animate: TargetAndTransition; transition: Transition }
  className?: string
  label: string
}) {
  const [hover, setHover] = useState<string | null>(null)
  const current = hover ?? active ?? null
  const t = tones[tone]

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
            className={`group relative inline-flex shrink-0 items-center rounded-full whitespace-nowrap transition-colors duration-300 ${t.link} ${lit ? t.lit : ''}`}
            {...entrance}
          >
            {lit && t.glider && (
              <motion.span
                layoutId={`nav-glider-${tone}`}
                aria-hidden
                className={`absolute inset-0 rounded-full ${t.glider}`}
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

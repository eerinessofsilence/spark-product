import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AnimatedHeading } from './AnimatedHeading'

type Tone = 'sage' | 'sand' | 'clay' | 'rose'
const marks: Record<Tone, string> = {
  sage: 'text-tint-sage-ink',
  sand: 'text-tint-sand-ink',
  clay: 'text-tint-clay-ink',
  rose: 'text-tint-rose-ink',
}

/** Filled marks on a 24-grid: solid shapes, holes cut with even-odd. */
const icons: Record<string, ReactNode> = {
  direct: (
    <>
      <path fillRule="evenodd" d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19Zm0 3.2a6.3 6.3 0 1 0 0 12.6 6.3 6.3 0 0 0 0-12.6Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  clear: <path fillRule="evenodd" d="M7 4h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm1.5 6.6a1.4 1.4 0 0 0 0 2.8h7a1.4 1.4 0 0 0 0-2.8h-7Z" />,
  flexible: (
    <>
      <rect x="2.5" y="6.4" width="19" height="3.2" rx="1.6" />
      <rect x="2.5" y="14.4" width="19" height="3.2" rx="1.6" />
      <circle cx="9" cy="8" r="3" />
      <circle cx="15" cy="16" r="3" />
    </>
  ),
  conversion: (
    <>
      <path d="M3.3 16.3 9.4 9.7a1.6 1.6 0 0 1 2.3 0l2.6 2.7 4.4-4.9 2.3 2.2-5.5 6.1a1.6 1.6 0 0 1-2.3.1l-2.6-2.7-4.9 5.3-2.4-2.2Z" />
      <path d="M14.6 6h5.9v5.9l-2.6-.4v-2.9h-2.9L14.6 6Z" />
    </>
  ),
}

const principles: { title: string; text: string; tone: Tone; icon: keyof typeof icons }[] = [
  { title: 'Direct', text: 'The hotel owns the guest journey. No redirect, no marketplace, no commission between the guest and the property.', tone: 'sage', icon: 'direct' },
  { title: 'Clear', text: 'Every step is designed around confident decisions: one question per screen, the total always in view.', tone: 'sand', icon: 'clear' },
  { title: 'Flexible', text: 'A white-label experience that adapts to different hotel brands through tokens for colour, type and imagery.', tone: 'clay', icon: 'flexible' },
  { title: 'Conversion-focused', text: 'Less friction between discovering a room and confirming a stay. Six steps, no account, no card form in the demo.', tone: 'rose', icon: 'conversion' },
]

/**
 * Four principles, no order between them, so no numbers. Each card carries
 * one filled mark in its tint, large and faint in the top-right corner,
 * bleeding past the edge. On hover it drifts in and warms up.
 */
export function ProductPrinciples() {
  return (
    <section id="principles" className="container-site pt-32 sm:pt-40 lg:pt-52" aria-labelledby="principles-heading">
      <AnimatedHeading id="principles-heading" className="text-display max-w-[14ch] text-4xl sm:text-5xl lg:text-6xl" text="Four things every screen has to be." />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p, i) => (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-[28px] bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-soft-lg"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className={`pointer-events-none absolute -top-7 -right-7 size-40 opacity-[0.08] transition-all duration-700 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-[0.18] ${marks[p.tone]}`}
            >
              {icons[p.icon]}
            </svg>
            <div className="relative pt-16">
              <h3 className="text-2xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

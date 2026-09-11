import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { AnimatedHeading } from './AnimatedHeading'
import { FadeIn } from './motion'

/**
 * Framed as a drop, not a raw total: `from` is what a typical OTA flow
 * looks like, `to` is StaySphere. The count runs from one to the other so
 * the bad number is what the guest actually sees fall away on screen.
 */
const stats: { from: number; to: number; suffix?: string; was: string; label: string }[] = [
  { from: 3, to: 1, was: 'vs 3+ platforms elsewhere', label: 'journey, owned by the hotel' },
  { from: 12, to: 6, was: 'vs 12+ steps on a typical OTA', label: 'steps from search to confirmation' },
  { from: 3, to: 0, was: 'vs 2–3 redirects elsewhere', label: 'redirects to third-party sites' },
  { from: 18, to: 0, suffix: '%', was: 'vs 15–20% typical commission', label: 'commission on direct bookings' },
]

const INK = '#161616'
const GREEN = '#2e7d5b'

/**
 * One spring drives everything: the digits count down from the industry
 * baseline to the StaySphere number, the colour drifts from ink to green
 * and the figure scales up. The spring is underdamped, so scale overshoots
 * and settles with a bounce while the count and colour are clamped at the
 * target — the drop itself is the point, not just the final digit.
 */
function Stat({ from, to, suffix = '', was, label, start, delay }: (typeof stats)[number] & { start: boolean; delay: number }) {
  const reduce = useReducedMotion()
  const progress = useMotionValue(0)
  const spring = useSpring(progress, { stiffness: 70, damping: 11, mass: 1 })

  useEffect(() => {
    if (!start) return
    const t = window.setTimeout(() => progress.set(1), delay * 1000)
    return () => window.clearTimeout(t)
  }, [start, delay, progress])

  const value = useTransform(spring, (v) => `${Math.round(from + (to - from) * Math.min(1, Math.max(0, v)))}${suffix}`)
  const color = useTransform(spring, [0, 1], [INK, GREEN])
  const scale = useTransform(spring, [0, 1], [0.72, 1], { clamp: false })

  return (
    <FadeIn delay={delay} className="text-center">
      <p className="mx-auto max-w-[18ch] text-display text-base text-ink">{label}</p>
      <p className="mt-2 text-display text-4xl tabular-nums sm:text-5xl">
        {reduce ? (
          <span style={{ color: GREEN }}>{`${to}${suffix}`}</span>
        ) : (
          <motion.span className="inline-block origin-bottom will-change-transform" style={{ color, scale }}>
            {value}
          </motion.span>
        )}
      </p>
      <p className="mx-auto mt-3 max-w-[20ch] text-xs font-medium text-muted-foreground/70">{was}</p>
    </FadeIn>
  )
}

export function ProjectIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <section id="intro" className="container-site pt-32 sm:pt-40 lg:pt-52" aria-labelledby="intro-heading">
      <AnimatedHeading id="intro-heading" className="text-display max-w-3xl text-4xl sm:text-5xl lg:text-6xl" text="A better way to book direct." />
      <FadeIn delay={0.15}>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Independent hotels depend on third-party platforms that add friction, dilute the brand and move the guest relationship away from the hotel. StaySphere brings that journey back.
        </p>
      </FadeIn>
      <div ref={ref} className="mt-14 grid gap-x-8 gap-y-12 pt-2 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Stat key={s.label} {...s} start={inView} delay={0.2 + i * 0.12} />
        ))}
      </div>
    </section>
  )
}

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type MouseEvent, type ReactNode } from 'react'

/**
 * The child leans toward the cursor while it is nearby and springs back when
 * it leaves. The field is a little larger than the child so the pull starts
 * just before the pointer reaches it.
 */
export function Magnetic({ children, strength = 0.3, className = 'inline-flex' }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 20, mass: 0.6 })
  const y = useSpring(my, { stiffness: 260, damping: 20, mass: 0.6 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave} className={`-m-2 p-2 ${className}`}>
      {children}
    </motion.div>
  )
}

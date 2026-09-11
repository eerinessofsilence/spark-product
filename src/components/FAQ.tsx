import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

export function FAQ({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <dl className="divide-y divide-border border-y border-border">
      {items.map(([q, a], i) => {
        const isOpen = open === i
        return (
          <div key={q}>
            <dt>
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold">
                {q}
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-stone">
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </motion.span>
              </button>
            </dt>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.dd initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{a}</p>
                </motion.dd>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </dl>
  )
}

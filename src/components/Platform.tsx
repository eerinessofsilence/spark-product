import { motion } from 'motion/react'
import { AnimatedHeading } from './AnimatedHeading'
import { FadeIn, Panel } from './motion'
import { ArrowRight } from './ui'

const tiles = [
  { title: 'Search', text: 'Dates, guests, one button.', src: '/ui/d-home-vp.webp', href: '#search', span: 'lg:col-span-5', fit: 'object-cover object-left-top' },
  { title: 'Rooms', text: 'Filters, grid or list, priced for the stay.', src: '/ui/d-rooms-grid.webp', href: '#rooms', span: 'lg:col-span-7', fit: 'object-cover object-top' },
  { title: 'Room details', text: 'Gallery, 360°, amenities, policies.', src: '/ui/d-room-gallery.webp', href: '#room', span: 'lg:col-span-7', fit: 'object-cover object-top' },
  { title: 'Services', text: 'Priced per stay, guest or night.', src: '/ui/d-room-services.webp', href: '#services', span: 'lg:col-span-5', fit: 'object-cover object-left-top' },
  { title: 'Checkout', text: 'Six steps, no account, server-side recheck.', src: '/ui/d-step-5.webp', href: '#flow', span: 'lg:col-span-5', fit: 'object-cover object-top' },
  { title: 'Confirmation', text: 'Reference, services, what was paid.', src: '/ui/d-confirmation.webp', href: '#flow', span: 'lg:col-span-7', fit: 'object-cover object-top' },
]

/** Bento grid in the spirit of Framer's "a full platform" section. */
export function Platform() {
  return (
    <section id="platform" className="container-site pt-32 sm:pt-40 lg:pt-52" aria-labelledby="platform-heading">
      <AnimatedHeading id="platform-heading" className="text-display max-w-[14ch] text-4xl sm:text-5xl lg:text-6xl" text="Not a widget. A full booking front end." />
      <FadeIn delay={0.15}>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Every screen a guest sees, from the first search to the confirmation email, built as one connected product instead of a booking button bolted onto a site.
        </p>
      </FadeIn>
      <Panel className="mt-14">
        {/* Fixed row height from lg up: tiles of different spans would otherwise pair a short
            image with a tall one and leave the narrow card mostly empty below its caption. */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[24rem] lg:grid-cols-12 lg:gap-5 xl:auto-rows-[28rem]">
          {tiles.map((t) => (
            <motion.li key={t.title} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className={`group ${t.span}`}>
              <a href={t.href} className="flex h-full flex-col overflow-hidden rounded-[28px] bg-card shadow-soft transition-shadow duration-300 hover:shadow-soft-lg">
                {/* grows into whatever height the row leaves, so the caption bar is the only fixed part */}
                <div className="relative aspect-[16/10] grow overflow-hidden bg-stone/60 lg:aspect-auto">
                  <img src={t.src} alt="" loading="lazy" className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] ${t.fit}`} />
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{t.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t.text}</p>
                  </div>
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-stone text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-primary-foreground"><ArrowRight /></span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}

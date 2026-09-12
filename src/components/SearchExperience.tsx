import { AnimatedHeading } from './AnimatedHeading'
import { FadeIn, Panel } from './motion'
import { Shot } from './ui'

export function SearchExperience() {
  return (
    <section id="search" className="container-site pt-32 sm:pt-40 lg:pt-52" aria-labelledby="search-heading">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-5">
          <AnimatedHeading id="search-heading" className="text-display text-4xl sm:text-5xl lg:text-6xl" text="Start with the stay." />
          <FadeIn delay={0.15}><p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">Guests select dates and the number of guests before exploring available rooms. Three fields, one button, and the whole inventory is already priced for their stay.</p></FadeIn>
          <FadeIn delay={0.25}>
            <ul className="mt-8 space-y-3 text-base">
              {['Check-in and check-out in a single calendar', 'Adults and children in one guest picker', 'Search collapses into the navigation once a stay is set'].map((t) => (
                <li key={t} className="flex items-start gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" /><span>{t}</span></li>
              ))}
            </ul>
          </FadeIn>
        </div>
        <Panel className="lg:col-span-7">
          {/* One capture carries all three bullets: the stay collapsed into the nav pill,
              and the single check-in/check-out calendar open beneath it. */}
          <div className="relative overflow-hidden rounded-[28px] bg-tint-sand p-5 sm:p-8 lg:p-10">
            <div aria-hidden className="absolute -top-16 -right-16 size-72 rounded-full bg-tint-clay blur-3xl" />
            <Shot src="/ui/d-search-calendar.webp" alt="The stay set in the navigation pill, with the check-in and check-out calendar open below it" width={1284} height={1124} className="relative" />
          </div>
        </Panel>
      </div>
    </section>
  )
}

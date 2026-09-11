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
          {/* layered composition with a tinted blob behind, as in the reference landing */}
          <div className="relative rounded-[28px] bg-tint-sand p-6 sm:p-10 lg:p-14">
            <div aria-hidden className="absolute -top-10 -right-10 size-64 rounded-full bg-tint-clay blur-3xl" />
            <Shot src="/ui/t-search-form.webp" alt="Search form: check-in, check-out, guests, Search rooms" width={1600} height={347} className="relative" />
            {/* The nav pill is 12:1, so it gets its own full-width row; squeezed into a
                column it collapses into an unreadable sliver. */}
            <Shot src="/ui/d-nav.webp" alt="Navigation with the stay as a pill" width={2000} height={156} className="relative mt-5 rounded-full" />
            <Shot src="/ui/m-search-form.webp" alt="Mobile search card" width={900} height={482} className="relative mt-5 w-[62%] sm:w-[48%]" />
          </div>
        </Panel>
      </div>
    </section>
  )
}

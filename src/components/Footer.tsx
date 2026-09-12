import { useEffect, useRef, useState } from 'react'
import { BOOKING_URL, STAYSPHERE_URL } from '../lib/links'

type Link = { label: string; href?: string; badge?: 'New' | 'Soon'; external?: boolean }
type Column = { title: string; links: Link[]; note?: string }

/**
 * Only real destinations: the sections of this page, the live demo, and a
 * contact address. Things the product would have next are listed as "Soon"
 * and are plain text, not dead links.
 */
const columns: Column[] = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '#top' },
      { label: 'Experience', href: '#experience' },
      { label: 'Platform', href: '#platform' },
      { label: 'Search', href: '#search' },
      { label: 'Rooms', href: '#rooms' },
      { label: 'Room details', href: '#room' },
      { label: 'Services', href: '#services' },
      { label: 'Checkout', href: '#flow' },
      { label: 'Principles', href: '#principles' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Demo',
    links: [
      { label: 'Live demo', href: STAYSPHERE_URL, external: true },
      { label: 'Booking flow', href: BOOKING_URL, external: true },
      { label: 'Hotel admin', href: `${STAYSPHERE_URL}admin`, external: true, badge: 'New' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: 'mailto:stay@asteriacove.example' },
    ],
    note: 'Help centre, integrations, changelog and blog are on the way.',
  },
]

function Badge({ children }: { children: string }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-[5px] border border-white/25 px-1.5 py-[2px] align-middle text-xs font-bold tracking-[0.08em] text-white/85 uppercase">
      {children}
    </span>
  )
}

/**
 * The wordmark set edge to edge. SVG text is measured once the display font
 * is in, and the viewBox is fitted to it, so the word spans the full width
 * at any size without stretching the glyphs.
 */
function Wordmark() {
  const ref = useRef<SVGTextElement>(null)
  const [w, setW] = useState(1000)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setW(Math.ceil(el.getComputedTextLength()))
    measure()
    document.fonts?.ready.then(measure)
  }, [])
  return (
    <svg viewBox={`0 0 ${w} 100`} className="mt-16 block w-full lg:mt-24" aria-hidden>
      <text ref={ref} x="0" y="76" fontSize="100" textLength={w} lengthAdjust="spacingAndGlyphs" className="text-display fill-white/[0.05]">
        StaySphere
      </text>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="container-site mt-8 pb-6" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>
      <div className="rounded-[28px] bg-ink px-6 pt-14 pb-8 text-[#F7F5F0] sm:px-10 sm:pt-20 lg:px-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,3fr)] lg:gap-16">
          <div>
            <a href="#top" className="inline-flex items-center gap-3" aria-label="Spark StaySphere, back to top">
              <img src="/brand/spark-logo-footer.svg" alt="Spark" className="h-7 w-auto" />
              <span className="text-base font-semibold tracking-tight text-white/85">StaySphere</span>
            </a>
            <p className="mt-5 max-w-xs text-base leading-relaxed text-white/55">
              The direct-booking experience, built for independent hotels.
            </p>
            <a
              href={STAYSPHERE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F7F5F0] px-5 text-sm font-semibold text-[#161616] transition-colors hover:bg-white"
            >
              Explore StaySphere
              <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
                <path d="M6 14 14 6m0 0H7.5M14 6v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:gap-x-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-base font-semibold tracking-tight text-white">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={col.title + l.label} className="text-sm leading-snug whitespace-nowrap">
                      {l.href ? (
                        <a
                          href={l.href}
                          {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                          className="inline-flex items-center text-white/55 transition-colors duration-200 hover:text-white"
                        >
                          {l.label}
                          {l.badge && <Badge>{l.badge}</Badge>}
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-white/45">
                          {l.label}
                          {l.badge && <Badge>{l.badge}</Badge>}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {col.note && <p className="mt-5 max-w-[26ch] text-sm leading-snug text-white/40">{col.note}</p>}
              </div>
            ))}
          </nav>
        </div>

        <Wordmark />

        <div className="mt-8 text-xs text-white/45">
          <p>© 2026 Spark StaySphere. Asteria Cove is a fictional property; rates, availability and payments in the demo are simulated.</p>
        </div>
      </div>
    </footer>
  )
}

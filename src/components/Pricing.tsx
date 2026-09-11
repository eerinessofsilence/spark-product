import { useState } from 'react'
import { STAYSPHERE_URL } from '../lib/links'
import { AnimatedHeading } from './AnimatedHeading'
import { ArrowUpRight, Button, Reveal } from './ui'
import { FAQ } from './FAQ'

type Plan = {
  name: string
  tagline: string
  monthly: number | null
  yearly: number | null
  note: string
  cta: string
  featured?: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    name: 'Independent',
    tagline: 'For a single property that wants to book direct.',
    monthly: 149,
    yearly: 119,
    note: 'per property, per month',
    cta: 'Start with Independent',
    features: [
      'Full booking journey, search to confirmation',
      'Up to 40 rooms',
      'Room galleries and 360° views',
      'Services and upsells',
      'Hotel-branded colours, type and imagery',
      'Free cancellation rules',
      'Email support',
    ],
  },
  {
    name: 'Boutique',
    tagline: 'For hotels that live on their direct channel.',
    monthly: 349,
    yearly: 279,
    note: 'per property, per month',
    cta: 'Start with Boutique',
    featured: true,
    features: [
      'Everything in Independent',
      'Unlimited rooms and rate plans',
      'Multi-language and multi-currency',
      'Rate comparison against partner sites',
      'Hotel admin with live bookings',
      'Custom domain and white-label emails',
      'Priority support, same-day replies',
    ],
  },
  {
    name: 'Group',
    tagline: 'For groups and collections with several properties.',
    monthly: null,
    yearly: null,
    note: 'tailored to the portfolio',
    cta: 'Talk to us',
    features: [
      'Everything in Boutique',
      'Multiple properties, one account',
      'Shared guest profiles across the group',
      'PMS and channel-manager integrations',
      'Custom checkout steps and policies',
      'SLA, onboarding and dedicated contact',
    ],
  },
]

const faqs = [
  ['Is there a commission on bookings?', 'No. Every plan is a flat monthly fee. Direct bookings stay with the hotel, at the hotel’s rate.'],
  ['What does white-label mean here?', 'Your brand only. Colours, type, imagery, domain and emails are yours; StaySphere is not mentioned to guests.'],
  ['How long does setup take?', 'A single property is usually live within a week: rooms, rates, photography and policies, then a review call.'],
  ['Can we cancel?', 'Monthly plans cancel any time. Yearly plans are billed up front and can be paused for seasonal closures.'],
]

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 size-4 shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="9" className="fill-tint-sage" />
      <path d="m6.5 10.2 2.3 2.3 4.7-4.8" stroke="#4c6a4e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <section id="pricing" className="container-site pt-32 sm:pt-40 lg:pt-48" aria-labelledby="pricing-heading">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <AnimatedHeading id="pricing-heading" className="text-display text-4xl sm:text-5xl lg:text-6xl" text="One flat fee. No commission." />
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={140}>
            <div role="group" aria-label="Billing period" className="inline-flex items-center rounded-full bg-card p-1 shadow-soft">
              {[
                ['Monthly', false],
                ['Yearly', true],
              ].map(([label, val]) => (
                <button
                  key={String(label)}
                  type="button"
                  aria-pressed={yearly === val}
                  onClick={() => setYearly(val as boolean)}
                  className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${yearly === val ? 'bg-ink text-primary-foreground' : 'text-ink/70 hover:bg-stone/70'}`}
                >
                  {label}
                  {val && <span className="ml-2 rounded-full bg-tint-sage px-2 py-0.5 text-xs font-medium text-tint-sage-ink">−20%</span>}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <ul className="mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {plans.map((p, i) => {
          const price = yearly ? p.yearly : p.monthly
          return (
            <Reveal as="li" key={p.name} delay={i * 90} className="flex">
              <article
                className={`flex w-full flex-col rounded-[28px] p-7 sm:p-8 ${
                  p.featured ? 'bg-ink text-[#F7F5F0] shadow-soft-lg' : 'bg-card text-ink shadow-soft'
                }`}
                aria-label={`${p.name} plan`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-full bg-[#F7F5F0] px-3 py-1 text-xs font-semibold text-[#161616]">Most chosen</span>
                  )}
                </div>
                <p className={`mt-2 text-base leading-relaxed ${p.featured ? 'text-white/60' : 'text-muted-foreground'}`}>{p.tagline}</p>

                <p className="mt-8 flex items-baseline gap-2">
                  {price !== null ? (
                    <>
                      <span className="text-display text-4xl tabular-nums sm:text-5xl">€{price}</span>
                      <span className={`text-sm ${p.featured ? 'text-white/55' : 'text-muted-foreground'}`}>/ month</span>
                    </>
                  ) : (
                    <span className="text-display text-4xl sm:text-5xl">Custom</span>
                  )}
                </p>
                <p className={`mt-2 text-xs ${p.featured ? 'text-white/50' : 'text-muted-foreground'}`}>
                  {p.note}
                  {price !== null && yearly ? ', billed yearly' : ''}
                </p>

                <div className="mt-8">
                  <Button
                    href={p.monthly === null ? 'mailto:stay@asteriacove.example' : STAYSPHERE_URL}
                    external={p.monthly !== null}
                    variant={p.featured ? 'inverse' : 'primary'}
                    size="lg"
                    className="w-full"
                  >
                    {p.cta} <ArrowUpRight />
                  </Button>
                </div>

                <ul className={`mt-8 space-y-3 border-t pt-7 text-base ${p.featured ? 'border-white/10' : 'border-border'}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check />
                      <span className={p.featured ? 'text-white/85' : ''}>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )
        })}
      </ul>

      <Reveal delay={120} className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h3 className="text-2xl font-semibold tracking-tight">Questions hotels ask first.</h3>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-muted-foreground">Prices are indicative for the concept product and shown in euros, excluding VAT.</p>
        </div>
        <div className="lg:col-span-8"><FAQ items={faqs as [string, string][]} /></div>
      </Reveal>
    </section>
  )
}

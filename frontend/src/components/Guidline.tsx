import { Link } from "react-router-dom"
import matchdayImage from "../assets/football_on_pitch.jpg"

const steps = [
  [
    "01",
    "Choose the fixture",
    "Browse upcoming matches and select the occasion you want to attend.",
  ],
  [
    "02",
    "Find your tier",
    "Compare the listed seating categories and set the number of tickets.",
  ],
  [
    "03",
    "Review the estimate",
    "Check your selection and the itemised total before continuing.",
  ],
]

export default function Guidline() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="grid gap-8 border-b border-border pb-10 md:grid-cols-[1fr_0.8fr] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
            The matchday experience
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-normal text-beige sm:text-5xl">
            From first whistle to lasting memory.
          </h1>
        </div>
        <p className="max-w-xl text-base leading-7 text-text-muted">
          A considered way to discover a fixture, explore iconic venues, and
          plan your place in the stands.
        </p>
      </header>

      <section className="grid gap-10 py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
        <div className="divide-y divide-border-subtle border-y border-border-subtle">
          {steps.map(([number, title, description]) => (
            <article
              key={number}
              className="grid grid-cols-[2.5rem_1fr] gap-4 py-5"
            >
              <span className="pt-1 text-xs tracking-[0.16em] text-champagne">
                {number}
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-normal text-beige">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <figure className="relative aspect-4/3 overflow-hidden border border-border-subtle">
          <img
            src={matchdayImage}
            alt="The football pitch prepared for matchday"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/90 to-transparent px-5 pb-5 pt-14 text-xs uppercase tracking-[0.16em] text-beige">
            Every great occasion starts with being there.
          </figcaption>
        </figure>
      </section>

      <div className="flex flex-wrap gap-4 border-t border-border pt-7">
        <Link
          to="/fixtures"
          className="inline-flex min-h-11 items-center justify-center bg-champagne px-5 text-sm font-semibold text-background transition-colors hover:bg-beige"
        >
          Explore fixtures
        </Link>
        <Link
          to="/faq"
          className="inline-flex min-h-11 items-center justify-center border border-border px-5 text-sm font-semibold text-beige transition-colors hover:border-champagne/60"
        >
          Guest services
        </Link>
      </div>
    </div>
  )
}

import { Link } from "react-router-dom"
import matchdayImage from "../assets/football_on_pitch.jpg"

const steps = [
  [
    "01",
    "Choose a fixture",
    "Explore listed matches and find the occasion that feels right.",
  ],
  [
    "02",
    "Choose your seating tier",
    "Compare the listed seating options and select your preferred seats.",
  ],
  [
    "03",
    "Review your estimate",
    "See your selection and estimated total before you decide.",
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
            From the first choice to matchday.
          </h1>
        </div>
        <p className="max-w-xl text-base leading-7 text-text-muted">
          Explore the fixture list, discover remarkable venues, and consider
          your place in the stands at your own pace.
        </p>
      </header>

      <section className="grid gap-10 py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
        <div className="space-y-3">
          {steps.map(([number, title, description]) => (
            <article
              key={number}
              className="luxury-card grid grid-cols-[2.5rem_1fr] gap-4 p-5"
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
        <figure className="luxury-card relative aspect-4/3 overflow-hidden">
          <img
            src={matchdayImage}
            alt="The football pitch prepared for matchday"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/90 to-transparent px-5 pb-5 pt-14 text-xs uppercase tracking-[0.16em] text-beige">
            Some occasions are better experienced in person.
          </figcaption>
        </figure>
      </section>

      <div className="flex flex-wrap gap-4 border-t border-border pt-7">
        <Link
          to="/fixtures"
          className="luxury-button luxury-button-primary"
        >
          Explore fixtures
        </Link>
        <Link
          to="/faq"
          className="luxury-button luxury-button-secondary"
        >
          Guest services
        </Link>
      </div>
    </div>
  )
}

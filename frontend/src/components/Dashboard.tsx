import { Link } from "react-router-dom"
import championsImage from "../assets/argentine_champions.webp"
import stadiumImage from "../assets/venue.jpeg"
import santiagoImage from "../assets/book/santiago.jpeg"

interface FeaturedVenue {
  src: string
  title: string
  description: string
  location: string
}

const featuredVenues: FeaturedVenue[] = [
  {
    src: stadiumImage,
    title: "The home of football",
    description: "An evening on one of football's grandest stages.",
    location: "London, England",
  },
  {
    src: santiagoImage,
    title: "A night in Madrid",
    description: "A modern classic, ready for the occasion.",
    location: "Madrid, Spain",
  },
  {
    src: championsImage,
    title: "Where history is made",
    description: "A storied ground for moments that stay with you.",
    location: "A matchday destination",
  },
]

export default function Dashboard() {
  return (
    <div className="pb-20 text-text-primary">
      <section className="relative isolate flex min-h-[min(72vh,720px)] items-end overflow-hidden border-b border-border sm:min-h-160">
        <img
          src={stadiumImage}
          alt="A floodlit football stadium before kick-off"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-background/95 via-background/65 to-background/10" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-background/70 via-transparent to-background/10" />

        <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-24 sm:px-8 sm:pb-20 lg:px-12">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-champagne">
            <span className="h-px w-8 bg-champagne" />A different kind of
            matchday
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-normal text-beige sm:text-6xl lg:text-7xl">
            A great match deserves a place in the stands.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-beige/80 sm:text-lg">
            Discover fixtures, explore remarkable grounds, and choose a seating
            tier that suits your day.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/fixtures"
              className="luxury-button luxury-button-primary"
            >
              Explore fixtures
            </Link>
            <Link
              to="/venues"
              className="luxury-button luxury-button-secondary"
            >
              Explore venues
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-beige/20 pt-5 text-xs uppercase tracking-[0.16em] text-beige/70">
            <span>Listed fixtures</span>
            <span>Clear seating estimates</span>
            <span>Remarkable grounds</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              Find your next occasion
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal text-beige sm:text-4xl">
              Grounds worth discovering
            </h2>
          </div>
          <Link
            to="/venues"
            className="w-fit border-b border-champagne/60 pb-1 text-sm font-medium text-beige transition-colors hover:border-champagne"
          >
            Explore all venues <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredVenues.map((venue, index) => (
            <Link
              to="/venues"
              key={venue.title}
              className="luxury-card-interactive group relative isolate flex aspect-4/5 min-h-80 items-end overflow-hidden rounded-2xl border border-border-subtle shadow-xl shadow-background/30"
            >
              <img
                src={venue.src}
                alt={venue.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/20 to-transparent" />
              <div className="w-full p-5 sm:p-6">
                <span className="text-xs uppercase tracking-[0.18em] text-champagne">
                  {venue.location}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-normal text-beige">
                  {venue.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-beige/70">
                  {venue.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-beige">
                  Discover venues <span aria-hidden="true">↗</span>
                </span>
              </div>
              <span className="absolute right-5 top-5 text-xs tracking-[0.18em] text-beige/70">
                0{index + 1}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            [
              "01",
              "A considered matchday",
              "Find a fixture and seating tier that suit you.",
            ],
            [
              "02",
              "Clear choices",
              "Review seating options before you decide.",
            ],
            [
              "03",
              "A day worth remembering",
              "Make room for the moments that matter.",
            ],
          ].map(([number, title, description]) => (
            <div key={number} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="pt-1 text-xs tracking-[0.16em] text-champagne">
                {number}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold tracking-normal text-beige">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

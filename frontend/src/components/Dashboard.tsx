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
    description: "An occasion made for the grandest stage.",
    location: "London, England",
  },
  {
    src: santiagoImage,
    title: "A night in Madrid",
    description: "A modern icon, lit for the big occasion.",
    location: "Madrid, Spain",
  },
  {
    src: championsImage,
    title: "Where history is made",
    description: "Be there when the final whistle becomes a memory.",
    location: "A moment worth travelling for",
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
            <span className="h-px w-8 bg-champagne" />A better way to be there
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-normal text-beige sm:text-6xl lg:text-7xl">
            The match is better
            <br className="hidden sm:block" />
            <span className="text-champagne">when you are there.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-beige/80 sm:text-lg">
            Exceptional seats. Unforgettable fixtures. Your next great football
            story starts here.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/fixtures"
              className="inline-flex min-h-12 items-center justify-center bg-champagne px-6 text-sm font-semibold text-background transition-colors hover:bg-beige"
            >
              Explore fixtures
            </Link>
            <Link
              to="/booking"
              className="inline-flex min-h-12 items-center justify-center border border-beige/50 px-6 text-sm font-semibold text-beige transition-colors hover:border-beige hover:bg-beige/10"
            >
              Discover venues
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-beige/20 pt-5 text-xs uppercase tracking-[0.16em] text-beige/70">
            <span>Curated matchday experiences</span>
            <span>Secure booking</span>
            <span>Iconic grounds</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              Choose your occasion
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal text-beige sm:text-4xl">
              Grounds worth the journey
            </h2>
          </div>
          <Link
            to="/booking"
            className="w-fit border-b border-champagne/60 pb-1 text-sm font-medium text-beige transition-colors hover:border-champagne"
          >
            View all venues <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredVenues.map((venue, index) => (
            <Link
              to="/booking"
              key={venue.title}
              className="group relative isolate flex aspect-4/5 min-h-80 items-end overflow-hidden border border-border-subtle"
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
                  Explore venue <span aria-hidden="true">↗</span>
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
              "A considered selection",
              "Find the right fixture and the right seat.",
            ],
            [
              "02",
              "A seamless booking",
              "Clear options from first look to confirmation.",
            ],
            [
              "03",
              "A day to remember",
              "Arrive ready for the moments that matter.",
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

import { Link, Outlet, useLocation } from "react-router-dom"
import camp_nou from "../assets/book/camp_nou.webp"
import education_city_stadium from "../assets/book/education_city_stadium.jpeg"
import san_sario from "../assets/book/san_sairo.webp"
import santiago from "../assets/book/santiago.jpeg"
import wembley from "../assets/book/wembley.jpeg"
import { MapPinIcon } from "./ui/Icons"

const stadiums = [
  {
    name: "Education City Stadium",
    location: "Doha, Qatar",
    capacity: "45,000 seats",
    description:
      "A modern arena built for unforgettable night-time matchday energy.",
    image: education_city_stadium,
  },
  {
    name: "San Siro",
    location: "Milan, Italy",
    capacity: "75,000 seats",
    description:
      "Historic home ground with a legendary atmosphere and iconic pitch-side views.",
    image: san_sario,
  },
  {
    name: "Santiago Bernabéu",
    location: "Madrid, Spain",
    capacity: "81,044 seats",
    description:
      "A stadium celebrated for its scale, spectacle, and unmatched football heritage.",
    image: santiago,
  },
  {
    name: "Wembley Stadium",
    location: "London, England",
    capacity: "90,000 seats",
    description:
      "The home of football's biggest nights and a destination for every fan.",
    image: wembley,
  },
  {
    name: "Camp Nou",
    location: "Barcelona, Spain",
    capacity: "75,000 seats",
    description:
      "A vibrant stadium where club history and matchday passion meet.",
    image: camp_nou,
  },
]

export default function Booking() {
  const location = useLocation()

  if (location.pathname === "/booking/form") {
    return <Outlet />
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="max-w-3xl border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
          The venue collection
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-normal text-beige sm:text-5xl">
          Great grounds. Unrivalled atmosphere.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
          Explore the stadiums that make matchday an occasion, then find your
          place in the stands.
        </p>
      </header>

      <section
        className="divide-y divide-border-subtle"
        aria-label="Featured venues"
      >
        {stadiums.map((stadium, index) => (
          <article
            key={stadium.name}
            className="grid gap-6 py-7 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center sm:gap-10 sm:py-9"
          >
            <div className="relative aspect-16/10 overflow-hidden border border-border-subtle">
              <img
                src={stadium.image}
                alt={`${stadium.name} stadium`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <span className="absolute left-4 top-4 border border-beige/30 bg-background/80 px-3 py-1.5 text-xs text-beige backdrop-blur">
                {stadium.capacity}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-champagne">
                0{index + 1} / Venue collection
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal text-beige sm:text-4xl">
                {stadium.name}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                <MapPinIcon className="h-4 w-4 text-champagne" />
                {stadium.location}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-text-secondary">
                {stadium.description}
              </p>
              <Link
                to="/booking/form"
                className="mt-6 inline-flex min-h-11 items-center gap-4 border-b border-champagne/60 pb-1 text-sm font-semibold text-beige transition-colors hover:border-champagne"
              >
                Explore reservations <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

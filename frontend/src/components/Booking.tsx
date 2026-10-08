import camp_nou from "../assets/book/camp_nou.webp"
import education_city_stadium from "../assets/book/education_city_stadium.jpeg"
import san_sario from "../assets/book/san_sairo.webp"
import santiago from "../assets/book/santiago.jpeg"
import wembley from "../assets/book/wembley.jpeg"
import { useAuth } from "../context/AuthContext"
import { CalendarIcon, MapPinIcon, ShieldCheckIcon } from "./ui/Icons"

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
  const { user } = useAuth()

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-foot-border bg-foot-surface p-8 text-center shadow-2xl shadow-black/20">
          <ShieldCheckIcon className="mx-auto h-10 w-10 text-foot-rose" />
          <h1 className="mt-5 text-3xl font-extrabold text-white">
            Admin venue access
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-foot-text-secondary">
            Sign in with the admin account to manage venue cards and seat
            bookings.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-foot-text-primary">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-2xl border border-foot-border bg-foot-surface/95 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-foot-red/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-foot-rose/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-foot-red/40 bg-foot-red/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-foot-rose">
                Admin venue management
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Stadiums ready for matchday.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
                Review the featured venues, manage their booking availability,
                and keep every stadium experience in one place.
              </p>
            </div>
            <div className="rounded-xl border border-foot-border bg-foot-surface-elevated/60 px-4 py-3 text-sm text-foot-text-secondary">
              <span className="font-semibold text-white">
                {stadiums.length}
              </span>{" "}
              venues in view
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="venue-cards-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-foot-rose">
                Venue library
              </p>
              <h2
                id="venue-cards-heading"
                className="mt-2 text-2xl font-bold tracking-tight text-white"
              >
                Featured stadiums
              </h2>
            </div>
            <span className="hidden rounded-full border border-foot-red/30 bg-foot-red/10 px-3 py-1.5 text-xs font-semibold text-foot-rose sm:inline-flex">
              Live management view
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {stadiums.map((stadium) => (
              <article
                key={stadium.name}
                className="group overflow-hidden rounded-xl border border-foot-border bg-foot-surface shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-foot-red/60 hover:shadow-2xl hover:shadow-foot-red/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={stadium.image}
                    alt={`${stadium.name} stadium`}
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-foot-bg/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-foot-bg/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    {stadium.capacity}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {stadium.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-foot-text-muted">
                        <MapPinIcon className="h-4 w-4 text-foot-rose" />
                        {stadium.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-foot-red/10 p-2 text-foot-rose transition-colors group-hover:bg-foot-red group-hover:text-white">
                      <ShieldCheckIcon className="h-4 w-4" />
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {stadium.description}
                  </p>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-foot-red/40 bg-foot-red/10 px-4 py-2.5 text-sm font-semibold text-foot-rose transition-all hover:border-foot-red hover:bg-foot-red hover:text-white"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Manage bookings
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

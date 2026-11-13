import { Link } from "react-router-dom"
import type { Fixture } from "../../context/AuthContext"

interface VenueVariableProps {
  fixtures: Fixture[]
}

interface VenueGroup {
  name: string
  fixtures: Fixture[]
}

const groupFixturesByVenue = (fixtures: Fixture[]): VenueGroup[] => {
  const venues = new Map<string, VenueGroup>()

  fixtures.forEach((fixture) => {
    const name = fixture.venue.trim()
    if (!name) return

    const key = name.toLowerCase()
    const venue = venues.get(key)
    if (venue) {
      venue.fixtures.push(fixture)
    } else {
      venues.set(key, { name, fixtures: [fixture] })
    }
  })

  return [...venues.values()]
}

const formatFixtureDate = (date: Fixture["date"]) => {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(parsedDate)
}

export default function VenueVariable({ fixtures }: VenueVariableProps) {
  const venues = groupFixturesByVenue(fixtures)

  if (venues.length === 0) {
    return (
      <p className="luxury-card my-8 px-6 py-10 text-sm text-text-muted">
        No venues are linked to the available fixtures.
      </p>
    )
  }

  return (
    <section className="mt-8 space-y-4" aria-label="Venues">
      {venues.map((venue) => (
        <article
          key={venue.name.toLowerCase()}
          className="luxury-card overflow-hidden p-5 sm:p-7"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-champagne">
                {venue.fixtures.length} listed{" "}
                {venue.fixtures.length === 1 ? "fixture" : "fixtures"}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal text-beige sm:text-3xl">
                {venue.name}
              </h2>
            </div>
            <Link
              to="/fixtures"
              className="luxury-button luxury-button-secondary min-h-10 w-fit px-4"
            >
              View fixtures <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <ul className="mt-5 divide-y divide-border-subtle border-y border-border-subtle">
            {venue.fixtures.map((fixture, index) => (
              <li
                key={
                  fixture._id ??
                  `${fixture.home}-${fixture.away}-${fixture.date}-${index}`
                }
                className="grid gap-2 rounded-lg px-3 py-4 transition-colors hover:bg-surface-hover sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
              >
                <p className="text-xs text-text-muted">
                  {formatFixtureDate(fixture.date)} · {fixture.time}
                </p>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-champagne">
                    {fixture.competition}
                  </p>
                  <p className="mt-1 text-sm font-medium text-beige">
                    {fixture.home} <span className="text-text-muted">v</span>{" "}
                    {fixture.away}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  )
}

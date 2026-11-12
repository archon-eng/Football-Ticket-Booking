import { Link } from "react-router-dom"
import type { Fixture } from "../../context/AuthContext"

interface FixtureVariableProps {
  fixtures: Fixture[]
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

export default function FixtureVariable({ fixtures }: FixtureVariableProps) {
  return (
    <div className="divide-y divide-border-subtle">
      {fixtures.map((fixture, index) => (
        <article
          key={
            fixture._id ??
            `${fixture.home}-${fixture.away}-${fixture.date}-${index}`
          }
          className="grid gap-6 py-7 transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:py-9"
        >
          <div className="grid gap-5 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(10rem,auto)] sm:items-center sm:gap-8">
            <div className="border-l border-champagne/60 pl-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                {formatFixtureDate(fixture.date)}
              </p>
              <p className="mt-1 font-display text-xl font-semibold tracking-normal text-beige">
                {fixture.time}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-champagne">
                {fixture.competition}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-xl font-semibold tracking-normal text-beige sm:text-2xl">
                  {fixture.home}
                </h2>
                <span className="text-xs uppercase tracking-[0.16em] text-text-muted">
                  vs
                </span>
                <h2 className="font-display text-xl font-semibold tracking-normal text-beige sm:text-2xl">
                  {fixture.away}
                </h2>
              </div>
            </div>

            <div className="text-sm text-text-muted sm:text-right">
              <p>{fixture.venue}</p>
              <p className="mt-1">{fixture.competition}</p>
            </div>
          </div>

          <Link
            to="/booking/form"
            className="inline-flex min-h-11 items-center justify-center gap-3 border border-champagne/50 px-5 text-sm font-semibold text-beige transition-colors hover:bg-champagne hover:text-background"
          >
            Reserve seats <span aria-hidden="true">↗</span>
          </Link>
        </article>
      ))}
    </div>
  )
}

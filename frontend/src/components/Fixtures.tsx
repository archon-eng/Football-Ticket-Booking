import { Link } from "react-router-dom"

const fixtures = [
  {
    competition: "Champions League",
    home: "Real Madrid",
    away: "Manchester City",
    date: "Tonight",
    time: "21:00",
    venue: "Santiago Bernabeu",
  },
  {
    competition: "Europa League",
    home: "FC Barcelona",
    away: "Paris Saint-Germain",
    date: "Tomorrow",
    time: "20:45",
    venue: "Estadi Olimpic",
  },
  {
    competition: "Conference League",
    home: "Bayern Munich",
    away: "Inter Milan",
    date: "Saturday, 24 Aug",
    time: "18:30",
    venue: "Allianz Arena",
  },
]

export default function Fixtures() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <section>
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              The fixture list
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-normal text-beige sm:text-5xl">
              Great football deserves a great seat.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
              Find your next occasion and reserve a place in the stands.
            </p>
          </div>
        </div>

        <div className="divide-y divide-border-subtle">
          {fixtures.map((fixture) => (
            <article
              key={fixture.competition}
              className="grid gap-6 py-7 transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:py-9"
            >
              <div className="grid gap-5 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(10rem,auto)] sm:items-center sm:gap-8">
                <div className="border-l border-champagne/60 pl-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                    {fixture.date}
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
                      v
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

        <p className="mt-6 text-xs leading-5 text-text-muted">
          Fixture details and availability are subject to change.
        </p>
      </section>
    </div>
  )
}

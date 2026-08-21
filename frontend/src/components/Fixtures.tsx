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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="w-full rounded-2xl border border-foot-border bg-foot-surface p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex rounded-full border border-foot-red/40 bg-foot-red/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-foot-rose">
              Fixtures
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              The next 90 minutes are waiting.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foot-text-secondary">
              Keep every kickoff, venue, and available seat in view.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-foot-text-muted">
              Matchweek
            </div>
            <div className="mt-1 text-lg font-bold text-white">
              23 - 25 August
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {fixtures.map((fixture) => (
            <article
              key={fixture.competition}
              className="rounded-xl border border-foot-border bg-foot-surface-elevated/60 p-5 transition-colors hover:border-foot-red/60"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-foot-rose">
                  {fixture.competition}
                </div>
                <span className="rounded-full bg-foot-red/10 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-foot-rose">
                  Open
                </span>
              </div>
              <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="font-semibold text-white">{fixture.home}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-foot-text-muted">
                  vs
                </div>
                <div className="text-right font-semibold text-white">
                  {fixture.away}
                </div>
              </div>
              <div className="mt-6 border-t border-foot-border pt-4 text-sm text-foot-text-secondary">
                <div className="flex justify-between gap-3">
                  <span>{fixture.date}</span>
                  <span className="font-semibold text-white">
                    {fixture.time}
                  </span>
                </div>
                <div className="mt-2 text-foot-text-muted">{fixture.venue}</div>
              </div>
              <Link
                to="/booking/form"
                className="mt-5 block rounded-full bg-foot-red px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-foot-red-hover"
              >
                Book seats
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

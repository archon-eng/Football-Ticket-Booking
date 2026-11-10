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

        <p className="mt-6 text-xs leading-5 text-text-muted">
          Fixture details and availability are subject to change.
        </p>
      </section>
    </div>
  )
}

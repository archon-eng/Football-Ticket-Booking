import { useMemo, useState, type SubmitEvent } from "react"
import { useAuth, type Fixture } from "../context/AuthContext"
import SeatingPlan from "./ui/SeatingPlan"

const categories = [
  { label: "Pitch-side", priceCents: 25 },
  { label: "Lower tier", priceCents: 20 },
  { label: "Upper tier", priceCents: 15 },
]

const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

const formatFixtureDate = (date: string) => {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parsedDate)
}

const getFixtureKey = (fixture: Fixture, index: number) =>
  fixture._id ?? `${fixture.home}-${fixture.away}-${fixture.date}-${index}`

const getFixtureLabel = (fixture: Fixture) =>
  `${fixture.home} vs ${fixture.away} · ${fixture.competition}`

export default function BookingForm() {
  const { fixtures, loadingFixtures } = useAuth()
  const [selectedFixtureKey, setSelectedFixtureKey] = useState("")
  const [category, setCategory] = useState(categories[0].label)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [reviewMessage, setReviewMessage] = useState("")
  const quantity = selectedSeats.length
  const ticketPriceCents =
    categories.find((item) => item.label === category)?.priceCents ?? 0
  const totalCents = ticketPriceCents * quantity

  const fixtureOptions = useMemo(
    () =>
      (fixtures ?? []).map((fixture, index) => ({
        key: getFixtureKey(fixture, index),
        label: getFixtureLabel(fixture),
        fixture,
      })),
    [fixtures],
  )

  const selectedFixtureKeyValue = useMemo(() => {
    if (fixtureOptions.length === 0) return ""
    if (fixtureOptions.some((option) => option.key === selectedFixtureKey)) {
      return selectedFixtureKey
    }
    return fixtureOptions[0].key
  }, [fixtureOptions, selectedFixtureKey])

  const selectedFixtureOption = fixtureOptions.find(
    (option) => option.key === selectedFixtureKeyValue,
  )

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedFixtureOption) {
      setReviewMessage("Please select a fixture to review your estimate.")
      return
    }

    if (quantity === 0) {
      setReviewMessage(
        "Select at least one available seat to review your estimate.",
      )
      return
    }

    setReviewMessage(
      `Your estimate for ${quantity} ${quantity === 1 ? "ticket" : "tickets"} to ${selectedFixtureOption.label} is ready. Checkout is not currently available.`,
    )
  }

  const toggleSeat = (seat: string) => {
    setSelectedSeats((current) =>
      current.includes(seat)
        ? current.filter((selectedSeat) => selectedSeat !== seat)
        : current.length < 6
          ? [...current, seat]
          : current,
    )
    setReviewMessage("")
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
            Your matchday
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-normal text-beige sm:text-5xl">
            Choose your view of the game.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-muted">
            Select a fixture, seating tier, and seats to review a clear price
            estimate before you decide.
          </p>

          <form
            onSubmit={handleSubmit}
            className="luxury-card mt-9 space-y-6 p-5 sm:p-7"
          >
            <div>
              <label
                htmlFor="fixture"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary"
              >
                Fixture
              </label>
              <select
                id="fixture"
                value={selectedFixtureKeyValue}
                onChange={(event) => {
                  setSelectedFixtureKey(event.target.value)
                  setReviewMessage("")
                }}
                disabled={loadingFixtures || fixtureOptions.length === 0}
                className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-beige outline-none transition-colors focus:border-champagne focus:ring-4 focus:ring-champagne/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingFixtures ? (
                  <option value="">Loading fixtures...</option>
                ) : fixtures === null ? (
                  <option value="">Fixtures unavailable</option>
                ) : fixtureOptions.length === 0 ? (
                  <option value="">No fixtures available</option>
                ) : (
                  fixtureOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))
                )}
              </select>
              {!loadingFixtures && fixtures === null && (
                <p className="mt-2 text-sm text-text-muted" role="status">
                  Fixtures are temporarily unavailable. Please try again
                  shortly.
                </p>
              )}
              {!loadingFixtures && fixtures?.length === 0 && (
                <p className="mt-2 text-sm text-text-muted">
                  No fixtures are currently listed.
                </p>
              )}
            </div>

            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Seating tier
              </legend>
              <div className="divide-y divide-border-subtle overflow-hidden rounded-xl border border-border">
                {categories.map((item) => (
                  <label
                    key={item.label}
                    className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-surface-hover hover:text-beige"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="category"
                        value={item.label}
                        checked={category === item.label}
                        onChange={() => {
                          setCategory(item.label)
                          setReviewMessage("")
                        }}
                        className="accent-champagne"
                      />
                      <span className="text-beige">{item.label}</span>
                    </span>
                    <span className="tabular-nums text-text-secondary">
                      {formatPrice(item.priceCents)}{" "}
                      <span className="text-text-muted">/ ticket</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <SeatingPlan
              selectedSeats={selectedSeats}
              maxSeats={6}
              onSeatToggle={toggleSeat}
            />

            <button
              type="submit"
              disabled={!selectedFixtureOption}
              className="luxury-button luxury-button-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Review estimate <span aria-hidden="true">↗</span>
            </button>
            {reviewMessage && (
              <p role="status" className="text-sm leading-6 text-champagne">
                {reviewMessage}
              </p>
            )}
          </form>
        </section>

        <aside className="luxury-card h-fit p-6 sm:p-8 lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
            Your estimate
          </p>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-normal text-beige">
            {selectedFixtureOption
              ? `${selectedFixtureOption.fixture.home} vs ${selectedFixtureOption.fixture.away}`
              : "Select a fixture"}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {category} · {quantity} {quantity === 1 ? "ticket" : "tickets"}
          </p>
          <p className="mt-3 text-xs leading-5 text-text-muted">
            {selectedFixtureOption
              ? `${selectedFixtureOption.fixture.competition} · ${formatFixtureDate(selectedFixtureOption.fixture.date)} · ${selectedFixtureOption.fixture.time} · ${selectedFixtureOption.fixture.venue}`
              : loadingFixtures
                ? "Loading fixture details..."
                : "Fixture details will appear here once a match is selected."}
          </p>
          <p className="mt-3 text-xs leading-5 text-text-muted">
            {quantity > 0
              ? `Selected seats: ${selectedSeats.join(", ")}`
              : "No seats selected"}
          </p>

          <dl className="mt-8 space-y-4 border-t border-border-subtle pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Tickets</dt>
              <dd className="tabular-nums text-beige">
                {formatPrice(totalCents)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-4 text-base font-semibold">
              <dt className="text-beige">Estimated total</dt>
              <dd className="tabular-nums text-champagne">
                {formatPrice(totalCents)}
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-xs leading-5 text-text-muted">
            Ticket costs only; no additional fees are added. Seats are not
            reserved, and checkout is not currently available.
          </p>
        </aside>
      </div>
    </div>
  )
}

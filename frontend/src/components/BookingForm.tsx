import { useState, type SubmitEvent } from "react"
import SeatingPlan from "./ui/SeatingPlan"

const fixtures = [
  "Real Madrid vs Manchester City",
  "FC Barcelona vs Paris Saint-Germain",
  "Bayern Munich vs Inter Milan",
]

const categories = [
  { label: "Pitch-side", price: 250 },
  { label: "Lower tier", price: 150 },
  { label: "Upper tier", price: 85 },
]

export default function BookingForm() {
  const [fixture, setFixture] = useState(fixtures[0])
  const [category, setCategory] = useState(categories[0].label)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [reviewMessage, setReviewMessage] = useState("")
  const quantity = selectedSeats.length
  const ticketPrice =
    categories.find((item) => item.label === category)?.price ?? 0
  const serviceFee = quantity > 0 ? 15 : 0
  const total = ticketPrice * quantity + serviceFee

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (quantity === 0) {
      setReviewMessage(
        "Choose at least one available seat to review your order.",
      )
      return
    }

    setReviewMessage(
      `${quantity} ${quantity === 1 ? "ticket" : "tickets"} for ${fixture} are ready to review. Payment is not available yet.`,
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
            Choose your seats.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-muted">
            Select a fixture and seating tier. Your order estimate updates as
            you make your choices.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-6">
            <div>
              <label
                htmlFor="fixture"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary"
              >
                Fixture
              </label>
              <select
                id="fixture"
                value={fixture}
                onChange={(event) => {
                  setFixture(event.target.value)
                  setReviewMessage("")
                }}
                className="min-h-12 w-full border border-border bg-surface px-4 text-sm text-beige outline-none transition-colors focus:border-champagne"
              >
                {fixtures.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Seating tier
              </legend>
              <div className="divide-y divide-border border-y border-border">
                {categories.map((item) => (
                  <label
                    key={item.label}
                    className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-beige"
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
                      ${item.price.toFixed(2)}{" "}
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
              className="inline-flex min-h-12 items-center justify-center gap-4 bg-champagne px-6 text-sm font-semibold text-background transition-colors hover:bg-beige"
            >
              Review order <span aria-hidden="true">↗</span>
            </button>
            {reviewMessage && (
              <p role="status" className="text-sm leading-6 text-champagne">
                {reviewMessage}
              </p>
            )}
          </form>
        </section>

        <aside className="h-fit border-y border-border py-6 lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
            Order estimate
          </p>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-normal text-beige">
            {fixture}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {category} · {quantity} {quantity === 1 ? "ticket" : "tickets"}
          </p>
          <p className="mt-3 text-xs leading-5 text-text-muted">
            {quantity > 0
              ? `Seats ${selectedSeats.join(", ")}`
              : "No seats selected"}
          </p>

          <dl className="mt-8 space-y-4 border-t border-border-subtle pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Tickets</dt>
              <dd className="tabular-nums text-beige">
                ${(ticketPrice * quantity).toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Service fee</dt>
              <dd className="tabular-nums text-beige">
                ${serviceFee.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-4 text-base font-semibold">
              <dt className="text-beige">Estimated total</dt>
              <dd className="tabular-nums text-champagne">
                ${total.toFixed(2)}
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-xs leading-5 text-text-muted">
            Estimate only. Tickets are not reserved until checkout is available
            and your booking is confirmed.
          </p>
        </aside>
      </div>
    </div>
  )
}

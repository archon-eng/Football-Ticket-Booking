export default function BookingForm() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="w-full overflow-hidden rounded-2xl border border-foot-border bg-foot-surface shadow-2xl shadow-black/20">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-foot-red/40 bg-foot-red/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-foot-rose">
              Reserve Seats
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Select fixture & category
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foot-text-secondary">
              Customize your matchday package, choose seating tiers, and proceed
              directly to ticket confirmation.
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foot-text-secondary">
                  Select Fixture
                </label>
                <select className="w-full rounded-lg border border-foot-border bg-foot-bg px-4 py-3 text-sm text-white outline-none transition-all focus:border-foot-red focus:ring-2 focus:ring-foot-red/20">
                  <option>Real Madrid vs Manchester City</option>
                  <option>FC Barcelona vs PSG</option>
                  <option>Bayern Munich vs Inter Milan</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foot-text-secondary">
                  Seating Category
                </label>
                <select className="w-full rounded-lg border border-foot-border bg-foot-bg px-4 py-3 text-sm text-white outline-none transition-all focus:border-foot-red focus:ring-2 focus:ring-foot-red/20">
                  <option>Category 1 - Pitch Side ($250)</option>
                  <option>Category 2 - Lower Tier ($150)</option>
                  <option>Category 3 - Upper Tier ($85)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foot-text-secondary">
                  Tickets Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  defaultValue="1"
                  className="w-full rounded-lg border border-foot-border bg-foot-bg px-4 py-3 text-sm text-white outline-none transition-all focus:border-foot-red focus:ring-2 focus:ring-foot-red/20"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-foot-red px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-foot-red/25 transition-all hover:-translate-y-0.5 hover:bg-foot-red-hover hover:shadow-foot-red/40 active:translate-y-0"
              >
                Proceed to Checkout
              </button>
            </form>
          </div>

          <div className="border-t border-foot-border bg-foot-bg/35 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="rounded-xl border border-foot-border bg-foot-carbon p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-foot-rose">
                Order Summary
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-foot-border pb-3">
                  <span className="text-foot-text-muted">Base Price</span>
                  <span className="font-semibold text-white">$250.00</span>
                </div>
                <div className="flex justify-between border-b border-foot-border pb-3">
                  <span className="text-foot-text-muted">Service Fee</span>
                  <span className="font-semibold text-white">$15.00</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-foot-rose">$265.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

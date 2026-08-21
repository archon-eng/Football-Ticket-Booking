export default function BookingForm() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-12 lg:px-8">
      <section className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="p-8 lg:p-10">
            <span className="inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-blue-900/60 text-blue-400">
              Reserve Seats
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
              Select fixture & category
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              Customize your matchday package, choose seating tiers, and proceed
              directly to ticket confirmation.
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Fixture
                </label>
                <select className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
                  <option>Real Madrid vs Manchester City</option>
                  <option>FC Barcelona vs PSG</option>
                  <option>Bayern Munich vs Inter Milan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Seating Category
                </label>
                <select className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
                  <option>Category 1 - Pitch Side ($250)</option>
                  <option>Category 2 - Lower Tier ($150)</option>
                  <option>Category 3 - Upper Tier ($85)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Tickets Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  defaultValue="1"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Proceed to Checkout
              </button>
            </form>
          </div>

          <div className="border-t border-slate-800 bg-slate-900/50 lg:border-l lg:border-t-0 lg:p-10">
            <div className="rounded-2xl border p-6 border-slate-800 bg-slate-950">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Order Summary
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800">
                  <span className="text-slate-400">Base Price</span>
                  <span className="font-semibold text-white">$250.00</span>
                </div>
                <div className="flex justify-between border-b border-slate-800">
                  <span className="text-slate-400">Service Fee</span>
                  <span className="font-semibold text-white">$15.00</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-blue-400">$265.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

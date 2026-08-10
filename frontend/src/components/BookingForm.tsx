export default function BookingForm() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-12 lg:px-8">
      <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-400">
              Reserve Seats
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Select fixture & category
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Customize your matchday package, choose seating tiers, and proceed
              directly to ticket confirmation.
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Select Fixture
                </label>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-400">
                  <option>Real Madrid vs Manchester City</option>
                  <option>FC Barcelona vs PSG</option>
                  <option>Bayern Munich vs Inter Milan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Seating Category
                </label>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-400">
                  <option>Category 1 - Pitch Side ($250)</option>
                  <option>Category 2 - Lower Tier ($150)</option>
                  <option>Category 3 - Upper Tier ($85)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Tickets Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  defaultValue="1"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-400"
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

          <div className="border-t border-slate-200 bg-slate-50/80 p-8 dark:border-slate-800 dark:bg-slate-900/50 lg:border-l lg:border-t-0 lg:p-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Order Summary
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Base Price
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    $250.00
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Service Fee
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    $15.00
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    $265.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

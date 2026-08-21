import { Link, Outlet, useLocation } from "react-router-dom"

export default function Booking() {
  const { pathname } = useLocation()

  if (pathname.endsWith("/form")) {
    return <Outlet />
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="w-full overflow-hidden rounded-2xl border border-foot-border bg-foot-surface shadow-2xl shadow-black/20">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-foot-red/40 bg-foot-red/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-foot-rose">
              Booking
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your matchday seat starts here.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foot-text-secondary">
              Choose a fixture, select your section, and secure your place in
              the stands before the whistle blows.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/booking/form"
                className="rounded-full bg-foot-red px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-foot-red/25 transition-all hover:-translate-y-0.5 hover:bg-foot-red-hover hover:shadow-foot-red/40 active:translate-y-0"
              >
                Continue to booking
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Live availability", "See open sections at a glance"],
                ["Clear pricing", "Know the total before checkout"],
                ["Flexible sections", "From general admission to VIP"],
                ["Fast checkout", "A focused path to your tickets"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-xl border border-foot-border bg-foot-surface-elevated/60 p-4"
                >
                  <div className="font-semibold text-white">{title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-foot-text-muted">
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-foot-border bg-foot-bg/35 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="rounded-xl border border-foot-border bg-foot-carbon p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-foot-rose">
                Booking at a glance
              </div>
              <div className="mt-5 space-y-3 text-sm text-foot-text-secondary">
                <div className="rounded-lg border border-foot-border bg-foot-surface p-4">
                  Availability updates as sections fill.
                </div>
                <div className="rounded-lg border border-foot-border bg-foot-surface p-4">
                  Compare seating tiers without leaving the flow.
                </div>
                <div className="rounded-lg border border-foot-border bg-foot-surface p-4">
                  Review your order before confirming payment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

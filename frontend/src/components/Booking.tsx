import { Link, Outlet, useLocation } from "react-router-dom"

export default function Booking() {
  const { pathname } = useLocation()

  if (pathname.endsWith("/form")) {
    return <Outlet />
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-12 lg:px-8">
      <section className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="p-8 lg:p-10">
            <span className="inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-blue-900/60 text-blue-400">
              Booking
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
              Choose your seats with a calm, premium interface.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              Seat selection, pricing, and matchday details should feel easy to
              scan. This layout keeps everything bright, structured, and clearly
              separated.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/booking/form"
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Continue to booking
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Blue-first palette", "Clarity over visual noise"],
                ["Soft surfaces", "Cards with gentle depth"],
                ["Bold hierarchy", "Typography that guides the eye"],
                ["Fast decisions", "Designed for seat selection"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-800 bg-slate-800/40"
                >
                  <div className="font-semibold text-white">
                    {title}
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-400">
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-900/50 lg:border-l lg:border-t-0 lg:p-10">
            <div className="rounded-2xl border p-6 border-slate-800 bg-slate-950">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Match details
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-xl border px-4 border-slate-800 bg-slate-900">
                  Seat availability updates live in this panel.
                </div>
                <div className="rounded-xl border px-4 border-slate-800 bg-slate-900">
                  A cleaner step-by-step booking flow can live here.
                </div>
                <div className="rounded-xl border px-4 border-slate-800 bg-slate-900">
                  Keep the action focused with strong contrast and spacing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

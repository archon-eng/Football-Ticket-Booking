import { NavLink, Outlet, useLocation } from "react-router-dom"

export default function SignUp() {
  const location = useLocation()

  if (location.pathname !== "/signup") {
    return <Outlet />
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-10 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-4xl border shadow-2xl border-slate-800 bg-slate-900 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative order-2 overflow-hidden bg-linear-to-br from-rose-600 via-red-600 to-orange-500 p-8 text-white lg:order-1 lg:p-12">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/15" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              Join the crowd
            </span>
            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Make match day yours.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-rose-50">
              Create an account to discover fixtures, choose your seats, and
              keep every booking close.
            </p>
          </div>
        </div>

        <div className="order-1 flex flex-col justify-center p-8 lg:order-2 lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
              Create account as
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Choose your starting point
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Pick the account type that fits how you use the venue.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <NavLink
              to="user_signup"
              className="group flex items-center justify-between rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg border-red-900/70 hover:border-red-700 hover:bg-red-950/60"
            >
              <span>
                <span className="block text-base font-bold text-white">
                  User Sign Up
                </span>
                <span className="mt-1 block text-sm text-slate-400">
                  Save seats and follow your bookings
                </span>
              </span>
              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </NavLink>

            <NavLink
              to="admin_signup"
              className="group flex items-center justify-between rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:hover:shadow-lg border-slate-800 hover:border-blue-900 hover:bg-blue-950/30"
            >
              <span>
                <span className="block text-base font-bold text-white">
                  Admin Sign Up
                </span>
                <span className="mt-1 block text-sm text-slate-400">
                  Set up venue and fixture management
                </span>
              </span>
              <span className="text-xl transition-transform text-blue-400">
                →
              </span>
            </NavLink>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already registered?{" "}
            <NavLink to="/login" className="font-semibold hover:underline!">
              Log in
            </NavLink>
          </p>
        </div>
      </section>
    </div>
  )
}

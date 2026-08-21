import { NavLink, Outlet, useLocation } from "react-router-dom"

export default function LogIn() {
  const location = useLocation()

  if (location.pathname !== "/login") {
    return <Outlet />
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-10 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-4xl border shadow-2xl border-slate-800 bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500 p-8 text-white lg:p-12">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/15" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              Welcome back
            </span>
            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Your seat is waiting.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-blue-50">
              Choose the account type that matches your place in the stadium.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              Sign in as
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Select your account
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Continue to the secure login for your role.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <NavLink
              to="user_login"
              className="group flex items-center justify-between rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg border-blue-900/70 hover:border-blue-700 hover:bg-blue-950/60"
            >
              <span>
                <span className="block text-base font-bold text-white">
                  User Log In
                </span>
                <span className="mt-1 block text-sm text-slate-400">
                  Book seats and manage your tickets
                </span>
              </span>
              <span className="text-xl transition-transform text-blue-400">
                →
              </span>
            </NavLink>

            <NavLink
              to="admin_login"
              className="group flex items-center justify-between rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:border-red-300 hover:hover:shadow-lg border-slate-800 hover:border-red-900 hover:bg-red-950/30"
            >
              <span>
                <span className="block text-base font-bold text-white">
                  Admin Log In
                </span>
                <span className="mt-1 block text-sm text-slate-400">
                  Manage fixtures, venues, and bookings
                </span>
              </span>
              <span className="text-xl transition-transform text-red-400">
                →
              </span>
            </NavLink>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Not registered?{" "}
            <NavLink to="/signup" className="font-semibold hover:underline!">
              Create account
            </NavLink>
          </p>
        </div>
      </section>
    </div>
  )
}

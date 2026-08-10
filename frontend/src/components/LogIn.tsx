import { NavLink } from "react-router-dom"

export default function LogIn() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center px-5 py-12 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-linear-to-br from-blue-600 to-sky-500 p-8 text-white lg:p-10">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            Welcome back
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Sign in with a cleaner UEFA-inspired visual rhythm.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-blue-50">
            Keep authentication calm, bright, and trustworthy with blue-white
            contrast and strong hierarchy.
          </p>
        </div>

        <div className="flex flex-col justify-between p-8 lg:p-10">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Login form
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="sr-only" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <p className="flex items-center justify-center gap-1.5">
              <span>Not registered?</span>
              <NavLink
                to="/signup"
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Create account
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

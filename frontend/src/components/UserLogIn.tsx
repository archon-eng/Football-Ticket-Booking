import { useState, type SubmitEvent } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { validateUserCredentials } from "../context/validateUserCredentials"

export default function UserLogIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [serverError, setServerError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.message || "Login failed")
        return
      }

      if (data.user) {
        setUser(validateUserCredentials(data.user))
      }

      navigate("/dashboard")
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500 p-8 text-white lg:p-12">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/15" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              User account
            </span>
            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Welcome back.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-blue-50">
              Sign in to pick up where you left off and keep your match-day
              plans together.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Supporter sign in
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Access your account
              </h2>
            </div>
            <NavLink
              to="/login"
              className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-slate-400 transition-colors hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              ← Back
            </NavLink>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Use the email connected to your supporter account.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-300"
                htmlFor="user-login-email"
              >
                Email address
              </label>
              <input
                id="user-login-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15"
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-300"
                htmlFor="user-login-password"
              >
                Password
              </label>
              <input
                id="user-login-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          {serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300"
            >
              {serverError}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-slate-400">
            <p className="flex items-center justify-center gap-1.5">
              <span>Not registered?</span>
              <NavLink
                to="/signup/user_signup"
                className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
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

import { useState, type SubmitEvent } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { catchError } from "../context/catchError"

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
        setUser(catchError(data.user))
      }

      navigate("/dashboard")
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-10 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-4xl border shadow-2xl border-slate-800 bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
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

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                User sign in
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                Access your account
              </h2>
            </div>
            <NavLink
              to="/login"
              className="shrink-0 text-sm font-semibold transition-colors text-slate-400 hover:text-blue-400"
            >
              ← Back
            </NavLink>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/50">
            <div className="text-sm text-slate-400">
              Use the email connected to your venue account.
            </div>

            <form onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 border-slate-800 text-white focus:border-blue-400"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 border-slate-800 text-white focus:border-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-500/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>

            {serverError && (
              <div className="mt-4 rounded-xl border border-red-500/30 0/10 p-3 text-center text-xs font-medium text-red-500">
                {serverError}
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p className="flex items-center justify-center gap-1.5">
              <span>Not registered?</span>
              <NavLink to="/signup" className="font-semibold hover:underline!">
                Create account
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

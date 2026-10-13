import { useState, type SubmitEvent } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { validateUserCredentials } from "../context/validateUserCredentials"

export default function AdminSignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [serverErrors, setServerErrors] = useState("")
  const [submitting, setSubmitting] = useState<boolean>(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setServerErrors("")
    setSubmitting(true)
    const role = "admin"

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setServerErrors(data.message || "Registration Failed!")
        }
        return
      }

      if (res.status === 202) {
        setServerErrors(data.message)
        return
      }

      if (data.user) {
        setUser(validateUserCredentials(data.user))
      }

      navigate("/dashboard")
    } catch (error) {
      setServerErrors(`Server error: ${error}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
          <div className="relative overflow-hidden bg-linear-to-br from-rose-600 via-red-600 to-orange-500 p-8 text-white lg:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/15" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
                Admin account
              </span>
              <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Run your venue.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-rose-50">
                Create an administrator account to manage fixtures, venues, and
                bookings from one place.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center border-t border-slate-800 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                  Administrator sign up
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Create admin account
                </h2>
              </div>
              <NavLink
                to="/signup"
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-slate-400 transition-colors hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                ← Back
              </NavLink>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Add your details to start managing match-day operations.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-red-400 focus:ring-4 focus:ring-red-400/15"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-red-400 focus:ring-4 focus:ring-red-400/15"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-red-400 focus:ring-4 focus:ring-red-400/15"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-red-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            {Object.values(errors)
              .flat()
              .map((error) => (
                <div
                  key={error}
                  role="alert"
                  className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300"
                >
                  {error}
                </div>
              ))}

            {serverErrors && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300"
              >
                {serverErrors}
              </div>
            )}

            <div className="mt-6 text-center text-sm text-slate-400">
              Already registered?{" "}
              <NavLink
                to="/login/admin_login"
                className="font-semibold text-red-400 hover:text-red-300 hover:underline"
              >
                Log In
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// name is what user decides, whatever he chooses, or can leave it empty
// email is required
// ID will be generated by using email
// password is required and must be unique

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
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-10 lg:px-8">
      <section className="w-full overflow-hidden rounded-4xl border shadow-2xl border-slate-800 bg-slate-900">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
          <div className="relative overflow-hidden bg-linear-to-br from-rose-600 via-red-600 to-orange-500 p-8 text-white lg:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/15" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
                User account
              </span>
              <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Make match day yours.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-rose-50">
                Create a personal account to discover fixtures, choose seats,
                and keep every booking close.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 lg:border-l lg:border-t-0 lg:p-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                  User sign up
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  Create your account
                </h2>
              </div>
              <NavLink
                to="/signup"
                className="shrink-0 text-sm font-semibold transition-colors text-slate-400 hover:text-red-400"
              >
                ← Back
              </NavLink>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/50">
              <div className="text-sm text-slate-400">
                Set up your details to start booking seats.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mt-6 space-y-4">
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
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-4 border-slate-800 text-white focus:border-red-400"
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
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-4 border-slate-800 text-white focus:border-red-400"
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
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-4 border-slate-800 text-white focus:border-red-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-500/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </form>

              {Object.values(errors)
                .flat()
                .map((error) => (
                  <div
                    key={error}
                    className="mt-4 rounded-xl border border-red-500/30 0/10 p-3 text-center text-xs font-medium text-red-500"
                  >
                    {error}
                  </div>
                ))}

              {serverErrors && (
                <div className="mt-4 rounded-xl border border-red-500/30 0/10 p-3 text-center text-xs font-medium text-red-500">
                  {serverErrors}
                </div>
              )}

              <div className="mt-6 text-center text-xs text-slate-400">
                Already registered?{" "}
                <NavLink to="/login" className="font-semibold hover:underline!">
                  Log In
                </NavLink>
              </div>
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

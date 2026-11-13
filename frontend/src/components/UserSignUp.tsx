import { useState, type SubmitEvent } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function UserSignUp() {
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
    const role = "user"

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: name, email, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setServerErrors(
            data.message || "We couldn't create your account. Please try again.",
          )
        }
        return
      }

      if (data.user) {
        setUser(data.user)
      }

      navigate("/dashboard")
    } catch {
      setServerErrors("We couldn't complete your request. Please try again shortly.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lux-auth mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-2xl">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
          <div className="relative isolate overflow-hidden bg-linear-to-br from-surface-elevated via-surface to-background p-8 text-text-primary lg:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-champagne/20" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-champagne/15" />
            <div className="absolute -right-10 top-1/3 h-40 w-40 rounded-full bg-champagne/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-champagne/30 bg-background/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-champagne backdrop-blur-md">
                User account
              </span>
              <h1 className="mt-6 max-w-md font-display text-4xl font-semibold leading-tight tracking-normal text-beige sm:text-5xl">
                Make room for matchday.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
                Create a user account to explore fixtures, review seating
                estimates, and plan your matchday.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center border-t border-border bg-background/55 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
                  User account
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal text-beige">
                  Create your account
                </h2>
              </div>
              <NavLink
                to="/signup"
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-muted transition-colors hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
              >
                ← Back
              </NavLink>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Enter your details to create your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="mb-1.5 block text-xs font-medium text-text-secondary"
                >
                  Name{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-beige outline-none transition placeholder:text-muted focus:border-champagne focus:ring-4 focus:ring-champagne/15"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 block text-xs font-medium text-text-secondary"
                >
                  Email <span className="text-champagne">*</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-beige outline-none transition placeholder:text-muted focus:border-champagne focus:ring-4 focus:ring-champagne/15"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-1.5 block text-xs font-medium text-text-secondary"
                >
                  Password <span className="text-champagne">*</span>
                </label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-beige outline-none transition placeholder:text-muted focus:border-champagne focus:ring-4 focus:ring-champagne/15"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="luxury-button luxury-button-primary w-full rounded-xl px-5 py-3.5 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-beige active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating your account..." : "Create account"}
              </button>
            </form>

            {Object.values(errors)
              .flat()
              .map((error) => (
                <div
                  key={error}
                  role="alert"
                  className="mt-4 rounded-xl border border-border-strong bg-surface-elevated px-4 py-3 text-sm leading-relaxed text-beige"
                >
                  {error}
                </div>
              ))}

            {serverErrors && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-border-strong bg-surface-elevated px-4 py-3 text-sm leading-relaxed text-beige"
              >
                {serverErrors}
              </div>
            )}

            <div className="mt-6 text-center text-sm text-muted">
              Already registered?{" "}
              <NavLink
                to="/login/user_login"
                className="font-semibold text-champagne hover:text-beige hover:underline"
              >
                Sign in
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

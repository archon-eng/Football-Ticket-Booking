import { useState, type SubmitEvent } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { catchError } from "../context/catchError"

export default function SignUp() {
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

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
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

      if (data.user) {
        setUser(catchError(data.user))
      }

      navigate("/dashboard")
    } catch (error) {
      setServerErrors(`Server error: ${error}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center px-5 py-12 lg:px-8">
      <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
          <div className="p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-400">
              Create account
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Join with a clean, modern registration screen.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              The sign-up view matches the same bright blue-white system so the
              app feels cohesive from first visit to checkout.
            </p>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/80 p-8 dark:border-slate-800 dark:bg-slate-900/50 lg:border-l lg:border-t-0 lg:p-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Registration form
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Name{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-password"
                      className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
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
                    className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs font-medium text-red-500"
                  >
                    {error}
                  </div>
                ))}

              {serverErrors && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs font-medium text-red-500">
                  {serverErrors}
                </div>
              )}

              <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Already registered?{" "}
                <NavLink
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
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

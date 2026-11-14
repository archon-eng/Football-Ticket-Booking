import { useState, type SubmitEvent } from "react"
import { useAuth } from "../context/AuthContext"
import validateUserCredentials from "../context/validateUserCredentials"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export default function Profile() {
  const { user, setUser } = useAuth()
  const [username, setUsername] = useState(user?.username ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setServerError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email }),
      })
      const data: unknown = await response.json()

      if (!response.ok) {
        if (isRecord(data) && isRecord(data.errors)) {
          setErrors(
            Object.fromEntries(
              Object.entries(data.errors).filter(
                (entry): entry is [string, string[]] =>
                  Array.isArray(entry[1]) &&
                  entry[1].every((message) => typeof message === "string"),
              ),
            ),
          )
        }
        setServerError(
          isRecord(data) && typeof data.message === "string"
            ? data.message
            : "We couldn't update your profile. Please try again.",
        )
        return
      }

      if (!isRecord(data) || !("user" in data)) {
        throw new Error("The profile response has an invalid shape.")
      }

      const updatedUser = validateUserCredentials(data.user)
      setUser(updatedUser)
      setUsername(updatedUser.username)
      setEmail(updatedUser.email)
      setSuccess("Your profile has been updated.")
    } catch (error) {
      console.error("Profile update failed:", error)
      setServerError("We couldn't update your profile. Please try again shortly.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <section className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
          Account
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-beige">
          Profile
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          Update the name and email address associated with your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="luxury-card mt-8 space-y-5 p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="profile-username"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Name
            </label>
            <input
              id="profile-username"
              type="text"
              autoComplete="name"
              required
              maxLength={64}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-beige outline-none transition placeholder:text-muted focus:border-champagne focus:ring-4 focus:ring-champagne/15"
            />
            {errors.username?.map((error) => (
              <p key={error} className="mt-2 text-sm text-champagne">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Email address
            </label>
            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-beige outline-none transition placeholder:text-muted focus:border-champagne focus:ring-4 focus:ring-champagne/15"
            />
            {errors.email?.map((error) => (
              <p key={error} className="mt-2 text-sm text-champagne">
                {error}
              </p>
            ))}
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-champagne">
              {serverError}
            </p>
          )}
          {success && (
            <p role="status" className="text-sm text-champagne">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="luxury-button luxury-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>
    </div>
  )
}

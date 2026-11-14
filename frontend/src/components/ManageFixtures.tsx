import { useState, type SubmitEvent } from "react"
import { useAuth, type Fixture } from "../context/AuthContext"

interface FixtureDraft {
  competition: string
  home: string
  away: string
  date: string
  time: string
  venue: string
}

const emptyDraft: FixtureDraft = {
  competition: "",
  home: "",
  away: "",
  date: "",
  time: "",
  venue: "",
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const getApiMessage = (value: unknown, fallback: string) => {
  if (isRecord(value) && typeof value.message === "string") {
    return value.message
  }
  if (isRecord(value) && isRecord(value.errors)) {
    const messages = Object.values(value.errors)
      .filter((errors): errors is string[] =>
        Array.isArray(errors) &&
        errors.every((message) => typeof message === "string"),
      )
      .flat()
    if (messages.length) return messages.join(" ")
  }
  return fallback
}

const getFixtureDate = (date: string) => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? date
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
      }).format(parsedDate)
}

export default function ManageFixtures() {
  const { fixtures, loadingFixtures, refreshFixtures } = useAuth()
  const [draft, setDraft] = useState<FixtureDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const resetForm = () => {
    setDraft(emptyDraft)
    setEditingId(null)
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError("")
    setSuccess("")
    setSubmitting(true)

    let response: Response
    try {
      response = await fetch(
        editingId
          ? `/api/auth/fixture/${encodeURIComponent(editingId)}`
          : "/api/auth/fixture",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(draft),
        },
      )
    } catch (error) {
      console.error("Fixture save request failed:", error)
      setServerError("We couldn't save the fixture. Please try again shortly.")
      setSubmitting(false)
      return
    }

    let data: unknown
    try {
      data = await response.json()
    } catch (error) {
      console.error("Fixture save response was invalid:", error)
      setServerError("The server returned an invalid response. Please try again.")
      setSubmitting(false)
      return
    }

    if (!response.ok) {
      setServerError(
        getApiMessage(data, "We couldn't save the fixture. Please try again."),
      )
      setSubmitting(false)
      return
    }

    try {
      await refreshFixtures()
    } catch (error) {
      console.error("Fixture list refresh failed after saving:", error)
      setServerError("The fixture was saved, but the list couldn't be refreshed.")
      setSubmitting(false)
      return
    }

    setSuccess(editingId ? "Fixture updated." : "Fixture added.")
    resetForm()
    setSubmitting(false)
  }

  const handleDelete = async (fixture: Fixture) => {
    if (!fixture._id) {
      setServerError("This fixture cannot be deleted because it has no ID.")
      return
    }
    if (
      !window.confirm(
        `Delete ${fixture.home} vs ${fixture.away}? This cannot be undone.`,
      )
    ) {
      return
    }

    setServerError("")
    setSuccess("")
    setDeletingId(fixture._id)
    try {
      const response = await fetch(
        `/api/auth/fixture/${encodeURIComponent(fixture._id)}`,
        { method: "DELETE", credentials: "include" },
      )
      const data: unknown = await response.json()
      if (!response.ok) {
        setServerError(
          getApiMessage(data, "We couldn't delete the fixture. Please try again."),
        )
        return
      }

      await refreshFixtures()
      setSuccess("Fixture deleted.")
      if (editingId === fixture._id) resetForm()
    } catch (error) {
      console.error("Fixture deletion failed:", error)
      setServerError("We couldn't delete the fixture. Please try again shortly.")
    } finally {
      setDeletingId(null)
    }
  }

  const beginEditing = (fixture: Fixture) => {
    if (!fixture._id) return
    setServerError("")
    setSuccess("")
    setEditingId(fixture._id)
    setDraft({
      competition: fixture.competition,
      home: fixture.home,
      away: fixture.away,
      date: fixture.date.slice(0, 10),
      time: fixture.time,
      venue: fixture.venue,
    })
  }

  const updateDraft = (field: keyof FixtureDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
          Administration
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-beige">
          Update Fixtures
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">
          Add fixtures, edit their details, or remove fixtures that are no
          longer listed.
        </p>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <form
          onSubmit={handleSubmit}
          className="luxury-card h-fit space-y-5 p-6 sm:p-8"
        >
          <div>
            <h2 className="font-display text-xl font-semibold text-beige">
              {editingId ? "Edit fixture" : "Add a fixture"}
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Enter the match details below.
            </p>
          </div>

          {(
            [
              ["competition", "Competition"],
              ["home", "Home team"],
              ["away", "Away team"],
              ["date", "Date"],
              ["time", "Time"],
              ["venue", "Venue"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label
                htmlFor={`fixture-${field}`}
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                {label}
              </label>
              <input
                id={`fixture-${field}`}
                type={
                  field === "date" ? "date" : field === "time" ? "time" : "text"
                }
                required
                value={draft[field]}
                onChange={(event) => updateDraft(field, event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-beige outline-none transition placeholder:text-muted focus:border-champagne focus:ring-4 focus:ring-champagne/15"
              />
            </div>
          ))}

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

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="luxury-button luxury-button-primary px-5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add fixture"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="luxury-button luxury-button-secondary px-5"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          <h2 className="font-display text-xl font-semibold text-beige">
            Current fixtures
          </h2>
          {loadingFixtures ? (
            <p className="mt-4 text-sm text-text-muted" role="status">
              Loading fixtures...
            </p>
          ) : fixtures === null ? (
            <p className="mt-4 text-sm text-text-muted" role="alert">
              Fixtures couldn't be loaded. You can still add a fixture.
            </p>
          ) : fixtures.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">
              No fixtures are currently listed.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {fixtures.map((fixture, index) => (
                <li
                  key={
                    fixture._id ??
                    `${fixture.home}-${fixture.away}-${fixture.date}-${index}`
                  }
                  className="luxury-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-beige">
                      {fixture.home} <span className="text-text-muted">vs</span>{" "}
                      {fixture.away}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {fixture.competition} · {getFixtureDate(fixture.date)} ·{" "}
                      {fixture.time}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {fixture.venue}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => beginEditing(fixture)}
                      disabled={!fixture._id || deletingId === fixture._id}
                      className="rounded-lg border border-border px-3 py-2 text-sm text-beige transition-colors hover:border-champagne disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(fixture)}
                      disabled={!fixture._id || deletingId === fixture._id}
                      className="rounded-lg border border-border px-3 py-2 text-sm text-beige transition-colors hover:border-champagne disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === fixture._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

import { useAuth } from "../context/AuthContext"
import VenueVariable from "./ui/VenueVariable"

export default function Venues() {
  const { fixtures, loadingFixtures } = useAuth()

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="max-w-3xl border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
          The venue collection
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-normal text-beige sm:text-5xl">
          Great grounds. Unrivalled atmosphere.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
          Explore the grounds hosting matches in the fixture list.
        </p>
      </header>

      {loadingFixtures ? (
        <p className="py-10 text-sm text-text-muted" role="status">
          Loading venues...
        </p>
      ) : fixtures === null ? (
        <p className="py-10 text-sm text-text-muted" role="status">
          Venues are unavailable right now. Please try again later.
        </p>
      ) : fixtures.length === 0 ? (
        <p className="py-10 text-sm text-text-muted">
          No venues are listed at the moment.
        </p>
      ) : (
        <VenueVariable fixtures={fixtures} />
      )}
    </div>
  )
}

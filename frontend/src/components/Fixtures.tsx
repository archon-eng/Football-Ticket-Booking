import { useAuth } from "../context/AuthContext"
import FixtureVariable from "./ui/FixtureVariable"

export default function Fixtures() {
  const { fixtures, loadingFixtures } = useAuth()

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <section>
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              The fixture list
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-normal text-beige sm:text-5xl">
              Find a fixture worth looking forward to.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
              Browse listed matches, compare the details, and consider your
              next day at the ground.
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs leading-5 text-text-muted">
          Fixture details and availability are subject to change.
        </p>

        {loadingFixtures ? (
          <p
            className="luxury-card my-8 px-6 py-10 text-sm text-text-muted"
            role="status"
          >
            Preparing your fixture list...
          </p>
        ) : fixtures === null ? (
          <p
            className="luxury-card my-8 px-6 py-10 text-sm text-text-muted"
            role="status"
          >
            Fixtures are temporarily unavailable. Please try again shortly.
          </p>
        ) : fixtures.length === 0 ? (
          <p className="luxury-card my-8 px-6 py-10 text-sm text-text-muted">
            No fixtures are currently listed.
          </p>
        ) : (
          <FixtureVariable fixtures={fixtures} />
        )}
      </section>
    </div>
  )
}

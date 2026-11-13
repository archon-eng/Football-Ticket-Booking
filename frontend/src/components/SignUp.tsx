import { NavLink, Outlet, useLocation } from "react-router-dom"

export default function SignUp() {
  const location = useLocation()

  if (location.pathname !== "/signup") {
    return <Outlet />
  }

  return (
    <div className="lux-auth mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-5 py-12 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-2xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative isolate order-1 overflow-hidden bg-linear-to-br from-surface-elevated via-surface to-background p-8 text-text-primary md:order-1 lg:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-champagne/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-champagne/15" />
          <div className="pointer-events-none absolute bottom-12 right-10 h-40 w-40 rounded-full border border-champagne/10" />
          <div className="relative flex h-full flex-col justify-between gap-16">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-champagne/25 bg-background/40 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-champagne backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-champagne shadow-[0_0_12px_var(--color-champagne)]" />
              Your matchday, your way
            </span>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-champagne/80">
                Your place in the stands
              </p>
              <h1 className="max-w-md font-display text-4xl font-semibold leading-[1.05] tracking-normal text-beige sm:text-5xl lg:text-6xl">
                Make matchday yours.
              </h1>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-text-secondary">
                Explore fixtures, select your preferred seats, and keep
                your ticket details in one place.
              </p>
            </div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">
              The Matchday <span className="mx-2 text-champagne/50">/</span>{" "}
              Ticket house
            </p>
          </div>
        </div>

        <div className="order-2 flex flex-col justify-center bg-background/70 p-7 sm:p-10 md:order-2 lg:p-12">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-champagne">
              Begin your experience
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal text-beige">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Choose the account that suits how you enjoy matchday.
            </p>
          </div>

          <div className="mt-8 grid gap-3.5">
            <NavLink
              to="user_signup"
              className="luxury-card-interactive group flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface/80 p-4 text-left sm:p-5"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-champagne/25 bg-background text-xs font-semibold tracking-widest text-champagne transition-colors group-hover:bg-champagne group-hover:text-background">
                  01
                </span>
                <span>
                  <span className="block text-base font-semibold text-beige">
                    User account
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    Browse fixtures and plan your matchday
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-xl text-champagne transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </NavLink>

            <NavLink
              to="admin_signup"
              className="luxury-card-interactive group flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface/80 p-4 text-left sm:p-5"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-champagne/25 bg-background text-xs font-semibold tracking-widest text-champagne transition-colors group-hover:bg-champagne group-hover:text-background">
                  02
                </span>
                <span>
                  <span className="block text-base font-semibold text-beige">
                    Venue administration
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    For venue and fixture administration
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-xl text-champagne transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </NavLink>
          </div>

          <p className="mt-8 border-t border-border-subtle pt-6 text-center text-sm text-muted">
            Already part of The Matchday?{" "}
            <NavLink
              to="/login"
              className="font-semibold text-champagne hover:text-beige hover:underline!"
            >
              Sign in
            </NavLink>
          </p>
        </div>
      </section>
    </div>
  )
}

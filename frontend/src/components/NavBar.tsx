import { NavLink } from "react-router-dom"
import account_logo from "../assets/account_symbol.svg"
import logo from "../assets/football_logo.svg"
import { useAuth } from "../context/AuthContext"

export default function NavBar() {
  const { user, loading, logout } = useAuth()

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-3 after:h-px after:w-[calc(100%-1.5rem)] after:origin-center after:scale-x-0 after:bg-champagne after:transition-transform after:duration-300 hover:text-beige hover:after:scale-x-100 ${
      isActive ? "text-beige after:scale-x-100" : "text-muted"
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/85 px-4 shadow-[0_8px_32px_rgb(0_0_0_/_16%)] backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-2 sm:min-h-20 sm:grid-cols-[1fr_auto_1fr] sm:py-0">
        <NavLink to="/dashboard" className="flex w-fit items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-champagne/40 bg-surface shadow-[inset_0_1px_0_rgb(242_235_221_/_5%)]">
            <img src={logo} alt="" className="h-6 w-auto" />
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-sm font-semibold tracking-[0.08em] text-beige">
              THE MATCHDAY
            </span>
            <span className="mt-0.5 block text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              Ticket house
            </span>
          </span>
        </NavLink>

        <nav
          aria-label="Main navigation"
          className="col-span-2 row-start-2 -mx-4 flex items-center justify-center gap-0.5 overflow-x-auto border-t border-border-subtle px-2 py-1 sm:col-span-1 sm:row-start-auto sm:mx-0 sm:gap-3 sm:overflow-visible sm:border-0 sm:px-0 sm:py-0"
        >
          <NavLink to="/dashboard" className={navClass}>
            Discover
          </NavLink>
          <NavLink to="/venues" className={navClass}>
            Venues
          </NavLink>
          <NavLink to="/fixtures" className={navClass}>
            Fixtures
          </NavLink>
          <NavLink to="/guideline" className={`${navClass} hidden md:block`}>
            The experience
          </NavLink>
          <NavLink to="/faq" className={`${navClass} hidden lg:block`}>
            Help
          </NavLink>
        </nav>

        <div className="flex justify-self-end">
          {loading ? (
            <span className="h-9 w-24 animate-pulse border border-border-subtle bg-surface" />
          ) : user ? (
            <span className="group relative">
              <button
                type="button"
                onClick={logout}
                aria-label={`Sign out ${user.username}`}
                className="luxury-button luxury-button-secondary gap-2 px-3 py-2 text-xs sm:px-4"
              >
                <img src={account_logo} alt="" className="h-4 w-4 opacity-70" />
                <span>
                  {user.username.length > 7
                    ? `${user.username.slice(0, 7)}...`
                    : user.username}
                </span>
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs text-beige opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
              >
                Sign out
              </span>
            </span>
          ) : (
            <NavLink
              to="/login"
              className="luxury-button luxury-button-primary gap-2 px-3 py-2 text-xs sm:px-4"
            >
              <img src={account_logo} alt="" className="h-4 w-4 opacity-70" />
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

import { NavLink } from "react-router-dom"
import account_logo from "../assets/account_symbol.svg"
import logo from "../assets/football_logo.svg"
import { useAuth } from "../context/AuthContext"

export default function NavBar() {
  const { user, loading, logout } = useAuth()

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-3 after:h-px after:w-[calc(100%-1.5rem)] after:origin-center after:scale-x-0 after:bg-champagne after:transition-transform after:duration-300 hover:text-beige hover:after:scale-x-100 ${
      isActive ? "text-beige after:scale-x-100" : "text-muted"
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-2 sm:min-h-20 sm:grid-cols-[1fr_auto_1fr] sm:py-0">
        <NavLink to="/dashboard" className="flex w-fit items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-champagne/40 bg-surface">
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
          <NavLink to="/dashboard" className={getNavClass}>
            Discover
          </NavLink>
          <NavLink to="/booking" className={getNavClass}>
            Venues
          </NavLink>
          <NavLink to="/fixtures" className={getNavClass}>
            Fixtures
          </NavLink>
          <NavLink to="/guideline" className={`${getNavClass} hidden md:block`}>
            The experience
          </NavLink>
          <NavLink to="/faq" className={`${getNavClass} hidden lg:block`}>
            Help
          </NavLink>
        </nav>

        <div className="flex justify-self-end">
          {loading ? (
            <span className="h-9 w-24 animate-pulse border border-border-subtle bg-surface" />
          ) : user ? (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-champagne/50 hover:text-beige sm:px-4"
            >
              <span className="hidden sm:inline">Sign out</span>
              <img src={account_logo} alt="" className="h-4 w-4 opacity-70" />
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-2 border border-champagne/50 px-3 py-2 text-xs font-semibold text-beige transition-colors hover:bg-champagne hover:text-background sm:px-4"
            >
              <span>Sign in</span>
              <img src={account_logo} alt="" className="h-4 w-4 opacity-70" />
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

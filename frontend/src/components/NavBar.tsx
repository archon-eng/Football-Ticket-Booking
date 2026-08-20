import { NavLink } from "react-router-dom"
import account_logo from "../assets/account_symbol.svg"
import logo from "../assets/football_logo.svg"
import { useAuth } from "../context/AuthContext"

export default function NavBar() {
  const { user, loading, logout } = useAuth()

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 after:absolute after:bottom-1 after:left-3 after:h-0.5 after:w-[calc(100%-1.5rem)] after:origin-center after:scale-x-0 after:rounded-full after:bg-foot-red dark:after:bg-foot-red after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive
        ? "text-slate-900 dark:text-white after:scale-x-100"
        : "text-slate-600 dark:text-slate-300"
    }`

  return (
    <div className="sticky top-0 z-30 grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-slate-200/80 bg-white/80 px-4 py-2.5 backdrop-blur-xl lg:px-8 dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="flex items-center justify-center">
        <NavLink
          to="/dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-sky-400 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
        >
          <img src={logo} alt="Football Logo" className="h-7 w-auto" />
        </NavLink>
      </div>

      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <NavLink to="/dashboard" className={getNavClass}>
          Dashboard
        </NavLink>
        <NavLink to="/booking" className={getNavClass}>
          Booking
        </NavLink>
        <NavLink to="/fixtures" className={getNavClass}>
          Fixtures
        </NavLink>
        <NavLink to="/guideline" className={getNavClass}>
          Guideline
        </NavLink>
        <NavLink to="/faq" className={getNavClass}>
          FAQ
        </NavLink>
      </div>

      <div className="flex items-center justify-center">
        {loading ? (
          <span className="h-9 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        ) : user ? (
          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-linear-to-br from-red-600 to-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:from-red-500 hover:to-rose-400 hover:shadow-lg hover:shadow-red-500/30 active:translate-y-0"
          >
            <span className="tracking-wide">Log Out</span>
            <img
              src={account_logo}
              alt="Account"
              className="h-4 w-4 brightness-0 invert"
            />
          </button>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-linear-to-br from-red-600 to-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:from-red-500 hover:to-rose-400 hover:shadow-lg hover:shadow-red-500/30 active:translate-y-0"
          >
            <span className="tracking-wide">Log In</span>
            <img
              src={account_logo}
              alt="Account"
              className="h-4 w-4 brightness-0 invert"
            />
          </NavLink>
        )}
      </div>
    </div>
  )
}

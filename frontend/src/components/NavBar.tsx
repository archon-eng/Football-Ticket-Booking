import { useState } from "react"
import { NavLink } from "react-router-dom"
import account_logo from "../assets/account_symbol.svg"
import logo from "../assets/football_logo.svg"
import { useAuth } from "../context/AuthContext"
import ConfirmDialog from "./ConfirmDialog"

export default function NavBar() {
  const { user, loading, logout } = useAuth()
  const [logoutError, setLogoutError] = useState("")
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleLogout = async () => {
    setLogoutError("")
    setSigningOut(true)
    try {
      await logout()
      setShowSignOutConfirm(false)
    } catch (error) {
      console.error("Sign-out failed:", error)
      setLogoutError("We couldn't sign you out. Please try again.")
    } finally {
      setSigningOut(false)
    }
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-2.5 py-1.5 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-2.5 after:h-px after:w-[calc(100%-1.25rem)] after:origin-center after:scale-x-0 after:bg-champagne after:transition-transform after:duration-300 hover:text-beige hover:after:scale-x-100 ${
      isActive ? "text-beige after:scale-x-100" : "text-muted"
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/85 px-3 shadow-[0_8px_32px_rgb(0_0_0_/16%)] backdrop-blur-xl sm:px-5 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-1.5 sm:min-h-18 sm:grid-cols-[1fr_auto_1fr] sm:py-0">
        <NavLink to="/dashboard" className="flex w-fit items-center gap-3">
          <span className="luxury-brand-mark flex h-10 w-10 items-center justify-center rounded-md border border-champagne/40 bg-surface shadow-[inset_0_1px_0_rgb(242_235_221_/5%)]">
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
            <div className="group relative">
              <button
                type="button"
                aria-label={`Account options for ${user.username}`}
                className="luxury-button luxury-button-secondary gap-2 px-1 py-1 text-xs sm:px-1"
              >
                <img src={account_logo} alt="" className="h-4 w-4 opacity-70" />
                <span className="text-[0.6875rem]">
                  {user.username.length > 7
                    ? `${user.username.slice(0, 7)}...`
                    : user.username}
                </span>
              </button>
              <div className="invisible absolute right-0 top-full z-50 w-48 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface p-1 shadow-xl">
                  <NavLink
                    to="/profile"
                    className="block rounded-lg px-3 py-2 text-sm text-beige transition-colors hover:bg-surface-elevated focus-visible:bg-surface-elevated"
                  >
                    Profile
                  </NavLink>
                  {user.role === "admin" && (
                    <NavLink
                      to="/admin/fixtures"
                      className="block rounded-lg px-3 py-2 text-sm text-beige transition-colors hover:bg-surface-elevated focus-visible:bg-surface-elevated"
                    >
                      Update Fixtures
                    </NavLink>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setLogoutError("")
                      setShowSignOutConfirm(true)
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-beige transition-colors hover:bg-surface-elevated focus-visible:bg-surface-elevated"
                  >
                    Sign out
                  </button>
                  {logoutError && (
                    <p
                      role="alert"
                      className="px-3 py-2 text-xs text-champagne"
                    >
                      {logoutError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="luxury-button luxury-button-primary luxury-button-compact"
            >
              <img
                src={account_logo}
                alt=""
                className="h-4 w-4 brightness-0 opacity-70"
              />
              <span>Sign in</span>
            </NavLink>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={showSignOutConfirm}
        prompt="Are you sure you would like to sign out of your account?"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        onCancel={() => {
          if (!signingOut) setShowSignOutConfirm(false)
        }}
        onConfirm={handleLogout}
        confirming={signingOut}
      />
    </header>
  )
}

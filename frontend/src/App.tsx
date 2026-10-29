import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import AdminLogIn from "./components/AdminLogIn"
import AdminSignUp from "./components/AdminSignUp"
import Booking from "./components/Booking.tsx"
import BookingRecipt from "./components/BookingForm"
import Dashboard from "./components/Dashboard"
import FAQ from "./components/FAQ"
import Fixtures from "./components/Fixtures"
import Guidline from "./components/Guidline"
import LogIn from "./components/LogIn"
import NavBar from "./components/NavBar"
import SignUp from "./components/SignUp"
import UserLogIn from "./components/UserLogIn"
import UserSignUp from "./components/UserSignUp"

function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col text-text-primary">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border-subtle px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-text-muted sm:flex-row sm:items-center">
          <p className="font-display text-sm font-semibold tracking-[0.08em] text-beige">
            THE MATCHDAY{" "}
            <span className="font-sans font-normal text-text-muted">
              · Ticket house
            </span>
          </p>
          <nav aria-label="Footer navigation" className="flex gap-5">
            <NavLink
              to="/fixtures"
              className="transition-colors hover:text-beige"
            >
              Fixtures
            </NavLink>
            <NavLink
              to="/booking"
              className="transition-colors hover:text-beige"
            >
              Venues
            </NavLink>
            <NavLink to="/faq" className="transition-colors hover:text-beige">
              Guest services
            </NavLink>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="signup" element={<SignUp />}>
            <Route path="admin_signup" element={<AdminSignUp />} />
            <Route path="user_signup" element={<UserSignUp />} />
          </Route>
          <Route path="login" element={<LogIn />}>
            <Route path="admin_login" element={<AdminLogIn />} />
            <Route path="user_login" element={<UserLogIn />} />
          </Route>
          <Route path="fixtures" element={<Fixtures />} />
          <Route path="booking" element={<Booking />}>
            <Route path="form" element={<BookingRecipt />} />
          </Route>
          <Route path="guideline" element={<Guidline />} />
          <Route path="faq" element={<FAQ />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App

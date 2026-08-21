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
    <div className="min-h-screen w-full text-foot-text-primary">
      <NavBar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-foot-bg">
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

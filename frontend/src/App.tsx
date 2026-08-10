import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import Booking from "./components/Booking.tsx"
import BookingRecipt from "./components/BookingForm.tsx"
import Dashboard from "./components/Dashboard.tsx"
import FAQ from "./components/FAQ.tsx"
import Fixtures from "./components/Fixtures.tsx"
import Guidline from "./components/Guidline.tsx"
import LogIn from "./components/LogIn.tsx"
import NavBar from "./components/NavBar.tsx"
import SignUp from "./components/SignUp.tsx"

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
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<LogIn />} />
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

import validateUserCredentials from "./validateUserCredentials"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

// User type definition
export interface User {
  username: string
  email: string
  _id: string
  role: "user" | "admin"
}

export interface Fixture {
  competition: string
  home: string
  away: string
  date: Date
  time: string
  venue: string
}

// Interface defining all values and functions provided by this context
interface AuthContextUserType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  logout: () => Promise<void>
}

interface AuthContextFixturesType {
  fixtures: Fixture[] | null
  setFixtures: (fixtures: Fixture[] | null) => void
  loading: boolean
}

// 1. Create Context with an undefined default value for safety
const AuthContext = createContext<AuthContextUserType | undefined>(undefined)

// 2. AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [fixtures, setFixtures] = useState<Fixture[] | null>(null)

  // Fetch current user session on app start / page refresh
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Sends the httpOnly JWT cookie automatically
        })

        if (res.ok) {
          const data = await res.json()
          setUser(validateUserCredentials(data.user))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to verify session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    const fetchFixtures = async () => {
      try {
        const res = await fetch("/api/auth/get_fixtures", {
          method: "GET",
          credentials: "include",
        })
      } catch (error) {
        console.error("Failed to fetch fixtures:", error)
        setFixtures(null)
      }
    }

    fetchMe()
    fetchFixtures()
  }, [])

  // Centralized logout handler
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom Hook to easily consume AuthContext anywhere in the app
// This hook is intentionally exported with the provider from this context module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextUserType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

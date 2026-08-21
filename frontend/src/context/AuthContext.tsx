import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { validateUserCredentials } from "./validateUserCredentials"

// User type definition
export interface User {
  _id: string
  username: string
  email: string
  ID: string
  role: string
}

// Interface defining all values and functions provided by this context
interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  logout: () => Promise<void>
}

// 1. Create Context with an undefined default value for safety
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

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

    fetchMe()
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
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

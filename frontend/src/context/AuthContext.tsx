import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

interface User {
  _id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("auth/api/me", {
          method: "GET",
          credentials: "include",
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to verify authentication session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [])

  const logout = async () => {
    try {
      await fetch("auth/api/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Error logging out:", error)
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

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an auth provider!")
  }

  return context
}

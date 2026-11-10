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
  _id?: string
  competition: string
  home: string
  away: string
  date: string
  time: string
  venue: string
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

const parseFixture = (value: unknown): Fixture | null => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null
  }

  const record = value as Record<string, unknown>
  const { competition, home, away, date, time, venue, _id } = record
  const dateValue =
    date instanceof Date
      ? Number.isNaN(date.getTime())
        ? ""
        : date.toISOString()
      : date

  if (
    !isNonEmptyString(competition) ||
    !isNonEmptyString(home) ||
    !isNonEmptyString(away) ||
    !isNonEmptyString(dateValue) ||
    Number.isNaN(Date.parse(dateValue)) ||
    !isNonEmptyString(time) ||
    !isNonEmptyString(venue)
  ) {
    return null
  }

  return {
    ...(isNonEmptyString(_id) ? { _id: _id.trim() } : {}),
    competition: competition.trim(),
    home: home.trim(),
    away: away.trim(),
    date: dateValue,
    time: time.trim(),
    venue: venue.trim(),
  }
}

const parseFixturesResponse = (value: unknown): Fixture[] | null => {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    !Array.isArray((value as Record<string, unknown>).fixtures)
  ) {
    return null
  }

  return (value as { fixtures: unknown[] }).fixtures.flatMap((fixture) => {
    const parsedFixture = parseFixture(fixture)
    return parsedFixture ? [parsedFixture] : []
  })
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
  loadingFixtures: boolean
}

// 1. Create Context with an undefined default value for safety
const AuthContext = createContext<
  (AuthContextUserType & AuthContextFixturesType) | undefined
>(undefined)

// 2. AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [fixtures, setFixtures] = useState<Fixture[] | null>(null)
  const [loadingFixtures, setLoadingFixtures] = useState<boolean>(true)

  // Fetch current user session on app start / page refresh
  useEffect(() => {
    const controller = new AbortController()

    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Sends the httpOnly JWT cookie automatically
          signal: controller.signal,
        })

        if (res.ok) {
          const data = await res.json()
          setUser(validateUserCredentials(data.user))
        } else {
          setUser(null)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to verify session:", error)
          setUser(null)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    const fetchFixtures = async () => {
      try {
        const res = await fetch("/api/auth/get_fixtures", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new Error(`Fixture request failed with status ${res.status}`)
        }

        const data: unknown = await res.json()
        const parsedFixtures = parseFixturesResponse(data)
        if (parsedFixtures === null) {
          throw new Error("Fixture response has an invalid shape")
        }
        setFixtures(parsedFixtures)
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch fixtures:", error)
          setFixtures(null)
        }
      } finally {
        if (!controller.signal.aborted) setLoadingFixtures(false)
      }
    }

    fetchMe()
    fetchFixtures()

    return () => controller.abort()
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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fixtures,
        setFixtures,
        loadingFixtures,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom Hook to easily consume AuthContext anywhere in the app
// This hook is intentionally exported with the provider from this context module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextUserType & AuthContextFixturesType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// isNotEmptyString function and the controller/aboart logics are written by AI.

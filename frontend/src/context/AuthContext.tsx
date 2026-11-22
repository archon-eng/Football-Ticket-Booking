import validateUserCredentials from "./validateUserCredentials"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

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
    (_id !== undefined && !isNonEmptyString(_id)) ||
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

  const parsedFixtures = (value as { fixtures: unknown[] }).fixtures.map(
    parseFixture,
  )
  if (parsedFixtures.some((fixture) => fixture === null)) {
    return null
  }

  return parsedFixtures.filter(
    (fixture): fixture is Fixture => fixture !== null,
  )
}

interface AuthContextUserType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  logout: () => Promise<void>
}

interface AuthContextFixturesType {
  fixtures: Fixture[] | null
  loadingFixtures: boolean
  refreshFixtures: (signal?: AbortSignal) => Promise<void>
}

const AuthContext = createContext<
  (AuthContextUserType & AuthContextFixturesType) | undefined
>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [fixtures, setFixtures] = useState<Fixture[] | null>(null)
  const [loadingFixtures, setLoadingFixtures] = useState<boolean>(true)

  // Centralized logout handler
  const logout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    if (!res.ok) {
      throw new Error(`Logout request failed with status ${res.status}`)
    }

    setUser(null)
  }

  const refreshFixtures = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch("/api/auth/get_fixtures", {
      method: "GET",
      credentials: "include",
      signal,
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
  }, [])

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

        if (res.status === 401) {
          setUser(null)
        } else if (res.status === 403) {
          setUser(null)
          console.log(
            "Error 403. Access forbidden: You do not have permission to access this resource.",
          )
        }

        if (res.ok) {
          const data = await res.json()
          setUser(validateUserCredentials(data.user))
        } else {
          throw new Error(`Session request failed with status ${res.status}`)
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
        await refreshFixtures(controller.signal)
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
  }, [refreshFixtures])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fixtures,
        loadingFixtures,
        refreshFixtures,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextUserType & AuthContextFixturesType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

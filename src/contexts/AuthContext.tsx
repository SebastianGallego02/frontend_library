import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/auth'
import { authService } from '../services/auth.service'
import type { LoginRequest } from '../types/LoginRequest'
import type { RegisterRequest } from '../types/RegisterRequest'
import type { User } from '../types/User'
interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Persists JWT and user profile after a successful auth response.
 * Login page and register flow both rely on this helper.
 */
function persistSession(token: string, user: User): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

function readStoredUser(): User | null {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on first load (e.g. page refresh)
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      setUser(readStoredUser())
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const { token, user: authenticatedUser } = await authService.login(credentials)
    persistSession(token, authenticatedUser)
    setUser(authenticatedUser)
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const { token, user: registeredUser } = await authService.register(data)
    persistSession(token, registeredUser)
    setUser(registeredUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user) && Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

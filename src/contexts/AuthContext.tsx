import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/auth'
import { authService } from '../services/auth.service'
import type { LoginRequest } from '../types/LoginRequest'
import type { RegisterRequest } from '../types/RegisterRequest'
import type { User } from '../types/User'
interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
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
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64)
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

function buildUserFromToken(token: string): User | null {
  const claims = decodeJwtPayload(token)
  if (!claims) return null

  const email = String(
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
      claims.email ??
      '',
  )

  const userName = String(
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      claims.name ??
      email.split('@')[0] ??
      '',
  )

  const role = String(
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] ??
      claims.role ??
      '',
  )

  return {
    id: String(claims.sub ?? ''),
    email,
    userName,
    role: role || undefined,
  }
}

function persistSession(token: string, user: User, refreshToken?: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  if (refreshToken) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken)
  }
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
      const storedUser = readStoredUser()
      const tokenUser = buildUserFromToken(token)
      if (storedUser) {
        setUser({ ...storedUser, ...(tokenUser ?? {}) })
      } else if (tokenUser) {
        setUser(tokenUser)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const { token, refreshToken, user: authenticatedUser } = await authService.login(credentials)
    const userProfile = authenticatedUser ?? buildUserFromToken(token)
    if (!userProfile) {
      throw new Error('No se pudo obtener el perfil de usuario después del login.')
    }
    persistSession(token, userProfile, refreshToken)
    setUser(userProfile)
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const { token, refreshToken, user: registeredUser } = await authService.register(data)
    const userProfile = registeredUser ?? buildUserFromToken(token)
    if (!userProfile) {
      throw new Error('No se pudo obtener el perfil de usuario después del registro.')
    }
    persistSession(token, userProfile, refreshToken)
    setUser(userProfile)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user) && Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
      isAdmin: Boolean(user?.role === 'Admin'),
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

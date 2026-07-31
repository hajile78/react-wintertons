import { createContext, useContext, ReactNode } from 'react'
import {
  authClient,
  hasRole as userHasRole,
  login as authLogin,
  logout as authLogout,
  type AuthUser,
  type LoginCredentials,
} from '../services/auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession()

  const login = async (credentials: LoginCredentials) => {
    await authLogin(credentials)
  }

  const logout = async () => {
    await authLogout()
  }

  const hasRole = (role: string) => {
    return userHasRole(session?.user ?? null, role)
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isAuthenticated: !!session,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthService, Session } from './auth-service'

interface AuthContextValue {
  session: Session | null
  login: (email: string, password: string) => Promise<Session>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ service, children }: { service: AuthService; children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => service.getSession())

  const login = useCallback(
    async (email: string, password: string) => {
      const next = await service.login(email, password)
      setSession(next)
      return next
    },
    [service],
  )

  const logout = useCallback(() => {
    try {
      service.logout()
    } catch {
      // The local session is cleared regardless: a failed remote logout must not trap the user.
    }
    setSession(null)
  }, [service])

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}

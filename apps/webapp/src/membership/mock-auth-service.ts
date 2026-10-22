import { InvalidCredentialsError, type AuthService, type Session } from './auth-service'

export const SESSION_STORAGE_KEY = 'learnn.session'

// Demo users: documented in the README, not secrets.
const DEMO_USERS = [
  { email: 'abbonato@learnn.com', password: 'Learnn2026!', name: 'Abbonato Demo' },
  { email: 'demo@learnn.com', password: 'Demo2026!', name: 'Demo Learnn' },
]

interface Options {
  latencyMs?: number
  storage?: Storage
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const { token, user } = value as Partial<Session>
  return (
    typeof token === 'string' &&
    typeof user === 'object' &&
    user !== null &&
    typeof user.email === 'string' &&
    typeof user.name === 'string'
  )
}

export function createMockAuthService({
  latencyMs = 600,
  storage = localStorage,
}: Options = {}): AuthService {
  return {
    async login(email, password) {
      await new Promise((resolve) => setTimeout(resolve, latencyMs))
      const normalized = email.trim().toLowerCase()
      const user = DEMO_USERS.find((u) => u.email === normalized && u.password === password)
      if (!user) throw new InvalidCredentialsError()
      const session: Session = {
        token: crypto.randomUUID(),
        user: { email: user.email, name: user.name },
      }
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      return session
    },

    getSession() {
      const raw = storage.getItem(SESSION_STORAGE_KEY)
      if (raw === null) return null
      try {
        const parsed: unknown = JSON.parse(raw)
        return isSession(parsed) ? parsed : null
      } catch {
        return null
      }
    },

    logout() {
      storage.removeItem(SESSION_STORAGE_KEY)
    },
  }
}

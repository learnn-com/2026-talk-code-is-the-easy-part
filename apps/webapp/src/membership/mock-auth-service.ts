import { InvalidCredentialsError, type AuthService, type Session } from './auth-service'

export const SESSION_STORAGE_KEY = 'learnn.session'

// Demo users: documented in the README, not secrets.
const DEMO_USERS = [
  { email: 'abbonato@learnn.com', password: 'password!42', name: 'Abbonato Demo' },
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

// getRandomValues works in insecure contexts; randomUUID does not.
function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function createMockAuthService({
  latencyMs = 600,
  storage: injected,
}: Options = {}): AuthService {
  // Resolved lazily: a denied localStorage accessor throws on access.
  const getStorage = () => injected ?? localStorage
  return {
    async login(email, password) {
      await new Promise((resolve) => setTimeout(resolve, latencyMs))
      const normalized = email.trim().toLowerCase()
      const user = DEMO_USERS.find((u) => u.email === normalized && u.password === password)
      if (!user) throw new InvalidCredentialsError()
      const session: Session = {
        token: newToken(),
        user: { email: user.email, name: user.name },
      }
      getStorage().setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      return session
    },

    getSession() {
      try {
        const raw = getStorage().getItem(SESSION_STORAGE_KEY)
        if (raw === null) return null
        const parsed: unknown = JSON.parse(raw)
        return isSession(parsed) ? parsed : null
      } catch {
        return null
      }
    },

    logout() {
      getStorage().removeItem(SESSION_STORAGE_KEY)
    },
  }
}

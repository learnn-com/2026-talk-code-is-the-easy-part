import { InvalidCredentialsError } from './auth-service'
import { SESSION_STORAGE_KEY, createMockAuthService } from './mock-auth-service'

const DEMO = { email: 'abbonato@learnn.com', password: 'password!42' }
const DEMO_2 = { email: 'demo@learnn.com', password: 'Demo2026!' }

const make = () => createMockAuthService({ latencyMs: 0 })

describe('mock auth service', () => {
  it('has no session at start', () => {
    expect(make().getSession()).toBeNull()
  })

  it.each([DEMO, DEMO_2])('logs in demo user $email', async ({ email, password }) => {
    const session = await make().login(email, password)
    expect(session.user.email).toBe(email)
    expect(session.token).toBeTruthy()
  })

  it('matches email case-insensitively and ignoring surrounding spaces', async () => {
    const session = await make().login(`  ${DEMO.email.toUpperCase()} `, DEMO.password)
    expect(session.user.email).toBe(DEMO.email)
  })

  it('rejects a wrong password with InvalidCredentialsError', async () => {
    await expect(make().login(DEMO.email, 'wrong')).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('rejects an unknown email with the same error and message as a wrong password', async () => {
    const service = make()
    const wrongPassword = await service.login(DEMO.email, 'wrong').catch((e: Error) => e)
    const unknownEmail = await service.login('ghost@learnn.com', 'wrong').catch((e: Error) => e)
    expect(unknownEmail).toBeInstanceOf(InvalidCredentialsError)
    expect(unknownEmail).toEqual(wrongPassword)
  })

  it('does not persist a session after a failed login', async () => {
    const service = make()
    await service.login(DEMO.email, 'wrong').catch(() => undefined)
    expect(service.getSession()).toBeNull()
  })

  it('persists the session across service instances (reload)', async () => {
    const session = await make().login(DEMO.email, DEMO.password)
    expect(make().getSession()).toEqual(session)
  })

  it('logout clears the persisted session', async () => {
    const service = make()
    await service.login(DEMO.email, DEMO.password)
    service.logout()
    expect(service.getSession()).toBeNull()
    expect(make().getSession()).toBeNull()
  })

  it.each([
    ['not json', '{oops'],
    ['json null', 'null'],
    ['a string', '"abc"'],
    ['missing token', JSON.stringify({ user: { email: 'a@b.it', name: 'A' } })],
    ['missing user', JSON.stringify({ token: 't' })],
    ['wrong types', JSON.stringify({ token: 1, user: { email: 2, name: 3 } })],
  ])('treats a corrupted persisted session (%s) as absent', (_label, raw) => {
    localStorage.setItem(SESSION_STORAGE_KEY, raw)
    expect(make().getSession()).toBeNull()
  })

  it('waits the simulated latency before resolving', async () => {
    vi.useFakeTimers()
    try {
      const service = createMockAuthService({ latencyMs: 600 })
      let settled = false
      const pending = service.login(DEMO.email, DEMO.password).then(() => (settled = true))
      await vi.advanceTimersByTimeAsync(599)
      expect(settled).toBe(false)
      await vi.advanceTimersByTimeAsync(1)
      await pending
      expect(settled).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('also waits the latency on a failed login', async () => {
    vi.useFakeTimers()
    try {
      const service = createMockAuthService({ latencyMs: 600 })
      let settled = false
      const pending = service.login(DEMO.email, 'wrong').catch(() => (settled = true))
      await vi.advanceTimersByTimeAsync(599)
      expect(settled).toBe(false)
      await vi.advanceTimersByTimeAsync(1)
      await pending
      expect(settled).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })
})

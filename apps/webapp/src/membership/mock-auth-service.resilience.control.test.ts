import { SESSION_STORAGE_KEY, createMockAuthService } from './mock-auth-service'

const DEMO = { email: 'abbonato@learnn.com', password: 'Learnn2026!' }
const MIN_TOKEN_LENGTH = 16

function storageWith(raw: string | null): Storage {
  return {
    get length() {
      return raw === null ? 0 : 1
    },
    clear: () => undefined,
    getItem: (key) => (key === SESSION_STORAGE_KEY ? raw : null),
    key: () => null,
    removeItem: () => undefined,
    setItem: () => undefined,
  }
}

describe('mock auth service controls (r0-2, r0-3)', () => {
  it('a readable valid persisted session is still returned', () => {
    const session = { token: 't', user: { email: DEMO.email, name: 'A' } }
    const storage = storageWith(JSON.stringify(session))
    expect(createMockAuthService({ latencyMs: 0, storage }).getSession()).toEqual(session)
  })

  it('an empty readable storage has no session', () => {
    const storage = storageWith(null)
    expect(createMockAuthService({ latencyMs: 0, storage }).getSession()).toBeNull()
  })

  it('with randomUUID available the token is still non-empty and unique', async () => {
    const service = createMockAuthService({ latencyMs: 0 })
    const first = await service.login(DEMO.email, DEMO.password)
    const second = await service.login(DEMO.email, DEMO.password)
    expect(first.token.length).toBeGreaterThanOrEqual(MIN_TOKEN_LENGTH)
    expect(second.token).not.toBe(first.token)
  })
})

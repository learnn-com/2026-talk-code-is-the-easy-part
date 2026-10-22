import { createMockAuthService } from './mock-auth-service'

const DEMO = { email: 'abbonato@learnn.com', password: 'Learnn2026!' }
const MIN_TOKEN_LENGTH = 16

function throwingStorage(error: unknown): Storage {
  return {
    get length() {
      return 0
    },
    clear: () => undefined,
    getItem: () => {
      throw error
    },
    key: () => null,
    removeItem: () => undefined,
    setItem: () => undefined,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('mock auth service: unreadable storage is no session (r0-2)', () => {
  it('getSession returns null when getItem throws a SecurityError', () => {
    const storage = throwingStorage(new DOMException('denied', 'SecurityError'))
    expect(createMockAuthService({ latencyMs: 0, storage }).getSession()).toBeNull()
  })

  it('getSession returns null when getItem throws any other error', () => {
    const storage = throwingStorage(new Error('boom'))
    expect(createMockAuthService({ latencyMs: 0, storage }).getSession()).toBeNull()
  })

  it('creating the default service and reading the session survive a denied localStorage accessor', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('denied', 'SecurityError')
      },
    })
    try {
      expect(createMockAuthService({ latencyMs: 0 }).getSession()).toBeNull()
    } finally {
      if (original) Object.defineProperty(globalThis, 'localStorage', original)
    }
  })
})

describe('mock auth service: token without crypto.randomUUID (r0-3)', () => {
  function withoutRandomUuid() {
    const real = globalThis.crypto
    vi.stubGlobal('crypto', {
      getRandomValues: (array: ArrayBufferView<ArrayBuffer>) => real.getRandomValues(array),
    })
  }

  it('login resolves with a non-empty, unguessable-length token', async () => {
    withoutRandomUuid()
    const session = await createMockAuthService({ latencyMs: 0 }).login(DEMO.email, DEMO.password)
    expect(typeof session.token).toBe('string')
    expect(session.token.length).toBeGreaterThanOrEqual(MIN_TOKEN_LENGTH)
  })

  it('two logins get different tokens', async () => {
    withoutRandomUuid()
    const service = createMockAuthService({ latencyMs: 0 })
    const first = await service.login(DEMO.email, DEMO.password)
    const second = await service.login(DEMO.email, DEMO.password)
    expect(second.token).not.toBe(first.token)
  })

  it('the persisted session carries the generated token', async () => {
    withoutRandomUuid()
    const service = createMockAuthService({ latencyMs: 0 })
    const session = await service.login(DEMO.email, DEMO.password)
    expect(service.getSession()).toEqual(session)
  })
})

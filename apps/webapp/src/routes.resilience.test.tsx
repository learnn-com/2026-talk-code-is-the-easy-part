import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { AuthProvider } from './membership/auth-provider'
import type { AuthService } from './membership/auth-service'
import { createMockAuthService } from './membership/mock-auth-service'
import { routes } from './routes'

const DEMO = { email: 'abbonato@learnn.com', password: 'password!42' }

function throwingStorage(): Storage {
  return {
    get length() {
      return 0
    },
    clear: () => undefined,
    getItem: () => {
      throw new DOMException('denied', 'SecurityError')
    },
    key: () => null,
    removeItem: () => undefined,
    setItem: () => undefined,
  }
}

function renderApp(service: AuthService, initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  render(
    <AuthProvider service={service}>
      <RouterProvider router={router} />
    </AuthProvider>,
  )
  return { router, user: userEvent.setup() }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('routing resilience', () => {
  it('r0-2: opening Home with unreadable storage redirects to Login', () => {
    const service = createMockAuthService({ latencyMs: 0, storage: throwingStorage() })
    const { router } = renderApp(service, ['/'])
    expect(screen.getByRole('heading', { name: 'Benvenuto' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })

  it('r0-2: opening Home with a denied default localStorage redirects to Login', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('denied', 'SecurityError')
      },
    })
    try {
      renderApp(createMockAuthService({ latencyMs: 0 }), ['/'])
      expect(screen.getByRole('heading', { name: 'Benvenuto' })).toBeInTheDocument()
    } finally {
      if (original) Object.defineProperty(globalThis, 'localStorage', original)
    }
  })

  it('r0-3: demo credentials land on Home when crypto.randomUUID is unavailable', async () => {
    const real = globalThis.crypto
    vi.stubGlobal('crypto', {
      getRandomValues: (array: ArrayBufferView<ArrayBuffer>) => real.getRandomValues(array),
    })
    const { user } = renderApp(createMockAuthService({ latencyMs: 0 }), ['/'])
    await user.type(screen.getByLabelText('Email'), DEMO.email)
    await user.type(screen.getByLabelText('Password'), DEMO.password)
    await user.click(screen.getByRole('button', { name: 'Accedi' }))
    expect(await screen.findByRole('banner')).toHaveTextContent('Learnn')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

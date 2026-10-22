import { act, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './auth-provider'
import type { AuthService, Session } from './auth-service'

const session: Session = { token: 't', user: { email: 'a@learnn.com', name: 'A' } }

function fakeService(initial: Session | null): AuthService {
  let current = initial
  return {
    login: vi.fn(async () => (current = session)),
    getSession: () => current,
    logout: vi.fn(() => {
      current = null
    }),
  }
}

function Probe() {
  const { session, login, logout } = useAuth()
  return (
    <div>
      <p>{session ? session.user.email : 'anonymous'}</p>
      <button onClick={() => void login('a@learnn.com', 'x')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

const renderWith = (service: AuthService, ui: ReactNode = <Probe />) =>
  render(<AuthProvider service={service}>{ui}</AuthProvider>)

describe('AuthProvider', () => {
  it('starts from the persisted session (reload)', () => {
    renderWith(fakeService(session))
    expect(screen.getByText('a@learnn.com')).toBeInTheDocument()
  })

  it('starts anonymous without a persisted session', () => {
    renderWith(fakeService(null))
    expect(screen.getByText('anonymous')).toBeInTheDocument()
  })

  it('exposes the session after login', async () => {
    const service = fakeService(null)
    renderWith(service)
    await act(async () => screen.getByText('login').click())
    expect(service.login).toHaveBeenCalledWith('a@learnn.com', 'x')
    expect(screen.getByText('a@learnn.com')).toBeInTheDocument()
  })

  it('clears the session on logout', async () => {
    const service = fakeService(session)
    renderWith(service)
    await act(async () => screen.getByText('logout').click())
    expect(service.logout).toHaveBeenCalled()
    expect(screen.getByText('anonymous')).toBeInTheDocument()
  })

  it('useAuth outside the provider throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<Probe />)).toThrow(/AuthProvider/)
  })
})

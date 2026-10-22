import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { AuthProvider } from './membership/auth-provider'
import { createMockAuthService, SESSION_STORAGE_KEY } from './membership/mock-auth-service'
import { routes } from './routes'

function renderApp(initialEntries: string[], initialIndex?: number) {
  const router = createMemoryRouter(routes, { initialEntries, initialIndex })
  const service = createMockAuthService({ latencyMs: 0 })
  render(
    <AuthProvider service={service}>
      <RouterProvider router={router} />
    </AuthProvider>,
  )
  return { router, user: userEvent.setup() }
}

const persist = (name: string, photoUrl?: string) =>
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ token: 't', user: { email: 'a@learnn.com', name, photoUrl } }),
  )

const loginScreen = () => screen.queryByRole('heading', { name: 'Benvenuto' })
const avatarButton = () => screen.getByRole('button', { name: /Menu utente/ })

async function logOut(user: ReturnType<typeof userEvent.setup>) {
  await user.click(avatarButton())
  await user.click(await screen.findByRole('menuitem', { name: 'Logout' }))
}

describe('Home header', () => {
  it('AC1: logo on the left, avatar on the right, no Home / My Learnn links', () => {
    persist('Abbonato Demo')
    renderApp(['/'])
    const header = screen.getByRole('banner')
    expect(within(header).getByText('Learnn')).toBeInTheDocument()
    expect(within(header).getByRole('button', { name: /Menu utente/ })).toBeInTheDocument()
    expect(within(header).queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^home$|my learnn/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/my learnn/i)).not.toBeInTheDocument()
    const children = Array.from(header.children)
    expect(children[0]).toHaveTextContent('Learnn')
    expect(children.at(-1)).toContainElement(avatarButton())
  })

  it('AC2: the avatar shows the initials of the session name', () => {
    persist('Demo Learnn')
    renderApp(['/'])
    expect(avatarButton()).toHaveTextContent('DL')
  })
})

describe('Logout', () => {
  it('AC5: Logout ends on Login with the session cleared, via replace', async () => {
    persist('Abbonato Demo')
    const { router, user } = renderApp(['/'])
    await logOut(user)
    expect(loginScreen()).toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.historyAction).toBe('REPLACE')
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })

  it('AC6: Back after logout does not return to Home', async () => {
    persist('Abbonato Demo')
    const { router, user } = renderApp(['/', '/'], 1)
    await logOut(user)
    await act(() => router.navigate(-1))
    expect(await screen.findByRole('heading', { name: 'Benvenuto' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('AC6: reloading after logout stays on Login', async () => {
    persist('Abbonato Demo')
    const first = renderApp(['/'])
    await logOut(first.user)
    expect(loginScreen()).toBeInTheDocument()
    document.body.replaceChildren()
    renderApp(['/'])
    expect(loginScreen()).toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('an already-expired session: Logout still lands on Login, no error', async () => {
    persist('Abbonato Demo')
    const { user } = renderApp(['/'])
    localStorage.removeItem(SESSION_STORAGE_KEY)
    await logOut(user)
    expect(loginScreen()).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('a failing service logout still ends on Login', async () => {
    persist('Abbonato Demo')
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    const service = createMockAuthService({ latencyMs: 0 })
    service.logout = () => {
      throw new Error('boom')
    }
    render(
      <AuthProvider service={service}>
        <RouterProvider router={router} />
      </AuthProvider>,
    )
    await logOut(userEvent.setup())
    expect(loginScreen()).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })

  it('after logout a new login works and shows that user in the menu', async () => {
    persist('Abbonato Demo')
    const { user } = renderApp(['/'])
    await logOut(user)
    await user.type(screen.getByLabelText('Email'), 'demo@learnn.com')
    await user.type(screen.getByLabelText('Password'), 'Demo2026!')
    await user.click(screen.getByRole('button', { name: 'Accedi' }))
    expect(await screen.findByRole('button', { name: 'Menu utente: Demo Learnn' })).toBeVisible()
  })
})

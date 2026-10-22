import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { AuthProvider } from './membership/auth-provider'
import { createMockAuthService, SESSION_STORAGE_KEY } from './membership/mock-auth-service'
import { routes } from './routes'

const DEMO = { email: 'abbonato@learnn.com', password: 'password!42' }

function renderApp(initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  const service = createMockAuthService({ latencyMs: 0 })
  const utils = render(
    <AuthProvider service={service}>
      <RouterProvider router={router} />
    </AuthProvider>,
  )
  return { router, user: userEvent.setup(), ...utils }
}

async function logIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Email'), DEMO.email)
  await user.type(screen.getByLabelText('Password'), DEMO.password)
  await user.click(screen.getByRole('button', { name: 'Accedi' }))
}

const loginScreen = () => screen.queryByRole('heading', { name: 'Benvenuto' })
const homeHeader = () => screen.queryByRole('banner')

describe('routing and session', () => {
  describe('AC7 - guards', () => {
    it('opening Home without a session goes to Login', () => {
      const { router } = renderApp(['/'])
      expect(loginScreen()).toBeInTheDocument()
      expect(homeHeader()).not.toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/login')
    })

    it('opening Login with an active session goes to Home', () => {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ token: 't', user: { email: DEMO.email, name: 'A' } }),
      )
      const { router } = renderApp(['/login'])
      expect(homeHeader()).toBeInTheDocument()
      expect(loginScreen()).not.toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/')
    })

    it('a corrupted persisted session behaves as no session', () => {
      localStorage.setItem(SESSION_STORAGE_KEY, '{oops')
      renderApp(['/'])
      expect(loginScreen()).toBeInTheDocument()
    })

    it('an unknown path ends on Login without a session', () => {
      renderApp(['/nope'])
      expect(loginScreen()).toBeInTheDocument()
    })
  })

  describe('AC5 - login to Home', () => {
    it('demo credentials land on Home with the Learnn logo in the header', async () => {
      const { router, user } = renderApp(['/'])
      await logIn(user)
      const header = await screen.findByRole('banner')
      expect(header).toHaveTextContent('Learnn')
      expect(loginScreen()).not.toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/')
    })

    it('wrong credentials stay on Login', async () => {
      const { router, user } = renderApp(['/login'])
      await user.type(screen.getByLabelText('Email'), DEMO.email)
      await user.type(screen.getByLabelText('Password'), 'wrong')
      await user.click(screen.getByRole('button', { name: 'Accedi' }))
      expect(await screen.findByRole('alert')).toHaveTextContent('Email o password non corrette')
      expect(router.state.location.pathname).toBe('/login')
    })

    it('Back from Home after login does not return to Login', async () => {
      const { router, user } = renderApp(['/'])
      await logIn(user)
      await screen.findByRole('banner')
      expect(router.state.historyAction).toBe('REPLACE')
      await router.navigate(-1)
      expect(router.state.location.pathname).toBe('/')
      expect(loginScreen()).not.toBeInTheDocument()
    })
  })

  describe('AC6 - reload', () => {
    it('stays logged in after a reload', async () => {
      const first = renderApp(['/'])
      await logIn(first.user)
      await screen.findByRole('banner')
      first.unmount()

      renderApp(['/'])
      expect(homeHeader()).toBeInTheDocument()
      expect(loginScreen()).not.toBeInTheDocument()
    })
  })
})

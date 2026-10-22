import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { AuthProvider } from './auth-provider'
import type { AuthService, Session } from './auth-service'
import { UserMenu } from './user-menu'

const session = (name: string): Session => ({ token: 't', user: { email: 'a@learnn.com', name } })

function fakeService(initial: Session | null): AuthService {
  let current = initial
  return {
    login: vi.fn(async () => session('x')),
    getSession: () => current,
    logout: vi.fn(() => {
      current = null
    }),
  }
}

function setup(name = 'Abbonato Demo', ui: ReactNode = <UserMenu />) {
  const service = fakeService(session(name))
  render(
    <AuthProvider service={service}>
      <p>outside</p>
      {ui}
    </AuthProvider>,
  )
  return {
    service, // Radix disables pointer events on the page while a menu is open.
    user: userEvent.setup({ pointerEventsCheck: 0 }),
  }
}

const trigger = () => screen.getByRole('button', { name: /Menu utente/ })

describe('UserMenu', () => {
  it('the trigger is named after the user and the menu starts closed', () => {
    setup()
    expect(trigger()).toHaveAccessibleName('Menu utente: Abbonato Demo')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('AC3: tapping the avatar opens the menu with name and Logout', async () => {
    const { user } = setup()
    await user.click(trigger())
    const menu = await screen.findByRole('menu')
    expect(menu).toHaveTextContent('Abbonato Demo')
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeInTheDocument()
  })

  it.each(['{Enter}', ' '])('AC3: keyboard %j on the avatar opens the menu', async (key) => {
    const { user } = setup()
    await user.tab()
    expect(trigger()).toHaveFocus()
    await user.keyboard(key)
    expect(await screen.findByRole('menu')).toBeInTheDocument()
  })

  it('AC4: Esc closes the menu and focus returns to the avatar', async () => {
    const { user } = setup()
    await user.click(trigger())
    await screen.findByRole('menu')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger()).toHaveFocus()
  })

  it('AC4: tapping outside closes the menu and focus returns to the avatar', async () => {
    const { user } = setup()
    await user.click(trigger())
    await screen.findByRole('menu')
    await user.click(screen.getByText('outside'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger()).toHaveFocus()
  })

  it('AC5: Logout calls the service once', async () => {
    const { service, user } = setup()
    await user.click(trigger())
    await user.click(await screen.findByRole('menuitem', { name: 'Logout' }))
    expect(service.logout).toHaveBeenCalledTimes(1)
  })

  it('AC5: Logout is reachable and fires from the keyboard', async () => {
    const { service, user } = setup()
    await user.tab()
    await user.keyboard('{Enter}')
    await screen.findByRole('menu')
    await user.keyboard('{Enter}')
    expect(service.logout).toHaveBeenCalledTimes(1)
  })

  it('renders nothing without a session', () => {
    render(
      <AuthProvider service={fakeService(null)}>
        <UserMenu />
      </AuthProvider>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('a long name stays inside the menu without horizontal scroll (truncated)', async () => {
    const long = 'Bartolomeo '.repeat(20).trim()
    const { user } = setup(long)
    await user.click(trigger())
    const label = (await screen.findByRole('menu')).querySelector('[data-testid="user-name"]')
    expect(label).toHaveTextContent(long)
    expect(label).toHaveClass('truncate')
    expect(screen.getByRole('menu').className).toMatch(/max-w-/)
  })
})

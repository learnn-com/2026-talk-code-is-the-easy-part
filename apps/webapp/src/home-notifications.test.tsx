import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { CatalogProvider } from './catalog/catalog-provider'
import { createMockCatalogService } from './catalog/mock-catalog-service'
import { AuthProvider } from './membership/auth-provider'
import { createMockAuthService, SESSION_STORAGE_KEY } from './membership/mock-auth-service'
import { routes } from './routes'

function renderHome() {
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ token: 't', user: { email: 'a@learnn.com', name: 'Abbonato Demo' } }),
  )
  render(
    <AuthProvider service={createMockAuthService({ latencyMs: 0 })}>
      <CatalogProvider service={createMockCatalogService({ latencyMs: 0 })}>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />
      </CatalogProvider>
    </AuthProvider>,
  )
  return userEvent.setup()
}

const header = () => screen.getByRole('banner')
const bell = () => within(header()).getByRole('button', { name: /^Notifiche/ })

describe('Home notifications', () => {
  it('AC1: the header shows the bell with the unread badge, next to the avatar', async () => {
    renderHome()
    expect(await within(header()).findByTestId('notification-badge')).toHaveTextContent('4')
    const children = Array.from(header().children)
    expect(children[0]).toHaveTextContent('Learnn')
    const actions = children.at(-1) as HTMLElement
    expect(actions).toContainElement(bell())
    expect(actions).toContainElement(within(header()).getByRole('button', { name: /Menu utente/ }))
    expect(within(header()).queryByRole('link')).not.toBeInTheDocument()
  })

  it('AC2-AC4: open, badge zeroed, tap = read, no navigation', async () => {
    const user = renderHome()
    await within(header()).findByTestId('notification-badge')
    await user.click(bell())
    const panel = await screen.findByRole('dialog', { name: 'Notifiche' })
    const rows = within(panel).getAllByRole('button', { name: /Non letta/ })
    expect(rows.length).toBeGreaterThanOrEqual(3)
    expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument()
    await user.click(rows[0])
    expect(within(panel).getAllByRole('button', { name: /Non letta/ })).toHaveLength(
      rows.length - 1,
    )
    expect(screen.queryByRole('heading', { name: 'Benvenuto' })).not.toBeInTheDocument()
  })

  it('AC6: reloading the Home restarts from the initial state', async () => {
    const user = renderHome()
    await within(header()).findByTestId('notification-badge')
    await user.click(bell())
    await user.click((await screen.findAllByRole('button', { name: /Non letta/ }))[0])
    await user.keyboard('{Escape}')
    document.body.replaceChildren()
    const reloaded = renderHome()
    expect(await within(header()).findByTestId('notification-badge')).toHaveTextContent('4')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await reloaded.click(bell())
    expect(await screen.findAllByRole('button', { name: /Non letta/ })).toHaveLength(4)
  })

  it('does not break the avatar menu', async () => {
    const user = renderHome()
    await user.click(screen.getByRole('button', { name: /Menu utente/ }))
    expect(await screen.findByRole('menuitem', { name: 'Logout' })).toBeVisible()
  })
})

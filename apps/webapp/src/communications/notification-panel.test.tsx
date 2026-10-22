import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationPanel } from './notification-panel'
import type { AppNotification, NotificationService } from './notification-service'
import { NotificationsProvider } from './notifications-provider'

function stubDesktop(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  )
}
afterEach(() => vi.unstubAllGlobals())

const MIN = 60_000
const items = (): AppNotification[] => [
  { id: 'a', title: 'Titolo A', body: 'Testo A', createdAt: Date.now() - 5 * MIN, courseId: 'x' },
  {
    id: 'b',
    title: 'Titolo B',
    body: 'Testo B',
    createdAt: Date.now() - 3 * 60 * MIN,
    courseId: 'y',
  },
  {
    id: 'c',
    title: 'Titolo C',
    body: 'Testo C',
    createdAt: Date.now() - 30 * 60 * MIN,
    courseId: 'z',
  },
]

function setup(service: NotificationService = { list: () => Promise.resolve(items()) }) {
  render(
    <NotificationsProvider service={service}>
      <NotificationPanel />
    </NotificationsProvider>,
  )
  return userEvent.setup()
}

const bell = () => screen.getByRole('button', { name: /^Notifiche/ })
const badge = () => screen.queryByTestId('notification-badge')
const row = (title: string) => screen.getByRole('button', { name: new RegExp(title) })

describe.each([
  ['mobile (sheet)', false, 'dialog'],
  ['desktop (dropdown)', true, 'dialog'],
])('NotificationPanel on %s', (_, desktop, role) => {
  beforeEach(() => stubDesktop(desktop))

  it('AC2: tapping the bell opens a panel with title, text, relative date and state per notification', async () => {
    const user = setup()
    await screen.findByTestId('notification-badge')
    expect(screen.queryByRole(role)).not.toBeInTheDocument()
    await user.click(bell())
    const panel = await screen.findByRole(role, { name: 'Notifiche' })
    expect(within(panel).getAllByRole('listitem')).toHaveLength(3)
    const first = within(panel).getByRole('button', { name: /Titolo A/ })
    expect(first).toHaveTextContent('Testo A')
    expect(first).toHaveTextContent('5 min fa')
    expect(first).toHaveTextContent('Non letta')
    expect(within(panel).getByRole('button', { name: /Titolo B/ })).toHaveTextContent('3 h fa')
    expect(within(panel).getByRole('button', { name: /Titolo C/ })).toHaveTextContent('ieri')
  })

  it('AC3: opening zeroes the badge, notifications stay unread', async () => {
    const user = setup()
    expect(await screen.findByTestId('notification-badge')).toHaveTextContent('3')
    await user.click(bell())
    await screen.findByRole(role)
    expect(badge()).not.toBeInTheDocument()
    for (const title of ['Titolo A', 'Titolo B', 'Titolo C'])
      expect(row(title)).toHaveTextContent('Non letta')
  })

  it('AC4: tapping a notification marks it read, stays on the panel, navigates nowhere', async () => {
    const user = setup()
    await screen.findByTestId('notification-badge')
    await user.click(bell())
    await user.click(await screen.findByRole('button', { name: /Titolo B/ }))
    expect(row('Titolo B')).toHaveTextContent('Letta')
    expect(row('Titolo B')).not.toHaveTextContent('Non letta')
    expect(row('Titolo A')).toHaveTextContent('Non letta')
    expect(screen.getByRole(role)).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })

  it('tapping an already-read notification keeps it read', async () => {
    const user = setup()
    await screen.findByTestId('notification-badge')
    await user.click(bell())
    await user.click(await screen.findByRole('button', { name: /Titolo A/ }))
    await user.click(row('Titolo A'))
    expect(row('Titolo A')).toHaveTextContent(/^.*Letta$/)
    expect(row('Titolo A')).not.toHaveTextContent('Non letta')
  })

  it('AC5: an empty list shows "Nessuna notifica"', async () => {
    const user = setup({ list: () => Promise.resolve([]) })
    await user.click(bell())
    const panel = await screen.findByRole(role)
    expect(within(panel).getByText('Nessuna notifica')).toBeInTheDocument()
    expect(within(panel).queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('a failing service shows no badge and "Nessuna notifica", no error', async () => {
    const user = setup({ list: () => Promise.reject(new Error('boom')) })
    await user.click(bell())
    const panel = await screen.findByRole(role)
    expect(badge()).not.toBeInTheDocument()
    expect(within(panel).getByText('Nessuna notifica')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('Esc closes the panel and returns focus to the bell', async () => {
    const user = setup()
    await screen.findByTestId('notification-badge')
    await user.click(bell())
    const panel = await screen.findByRole(role)
    expect(panel).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole(role)).not.toBeInTheDocument()
    expect(bell()).toHaveFocus()
  })

  it('keyboard: the bell opens with Enter, focus moves inside the panel and stays there on Tab', async () => {
    const user = setup()
    await screen.findByTestId('notification-badge')
    bell().focus()
    await user.keyboard('{Enter}')
    const panel = await screen.findByRole(role)
    expect(panel).toContainElement(document.activeElement as HTMLElement)
    for (let i = 0; i < 8; i++) {
      await user.tab()
      expect(panel).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it('reopening keeps the badge at 0 and the read state', async () => {
    const user = setup()
    await screen.findByTestId('notification-badge')
    await user.click(bell())
    await user.click(await screen.findByRole('button', { name: /Titolo A/ }))
    await user.keyboard('{Escape}')
    await user.click(bell())
    await screen.findByRole(role)
    expect(badge()).not.toBeInTheDocument()
    expect(row('Titolo A')).not.toHaveTextContent('Non letta')
    expect(row('Titolo B')).toHaveTextContent('Non letta')
  })
})

describe('NotificationPanel form factor', () => {
  it('mobile: sheet has a close button', async () => {
    stubDesktop(false)
    const user = setup()
    await user.click(bell())
    await user.click(await screen.findByRole('button', { name: 'Chiudi' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('desktop: the dropdown has no sheet close button', async () => {
    stubDesktop(true)
    const user = setup()
    await user.click(bell())
    await screen.findByRole('dialog')
    expect(screen.queryByRole('button', { name: 'Chiudi' })).not.toBeInTheDocument()
  })
})

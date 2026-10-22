import { act, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { NotificationBell } from './notification-bell'
import type { AppNotification, NotificationService } from './notification-service'
import { NotificationsProvider, useNotifications } from './notifications-provider'

const make = (count: number): AppNotification[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `n${i}`,
    title: `t${i}`,
    body: `b${i}`,
    createdAt: 0,
    courseId: 'c',
  }))

const serviceOf = (count: number): NotificationService => ({
  list: () => Promise.resolve(make(count)),
})

let api: ReturnType<typeof useNotifications>
function Spy() {
  api = useNotifications()
  return null
}
const renderBell = (count: number, extra?: ReactNode) =>
  render(
    <NotificationsProvider service={serviceOf(count)}>
      <NotificationBell />
      <Spy />
      {extra}
    </NotificationsProvider>,
  )

describe('NotificationBell', () => {
  it('AC1: shows a badge with the unread count', async () => {
    renderBell(4)
    expect(await screen.findByTestId('notification-badge')).toHaveTextContent('4')
    expect(screen.getByRole('button', { name: 'Notifiche: 4 non lette' })).toBeInTheDocument()
  })

  it('AC1: no unread = no badge, plain accessible name', async () => {
    renderBell(0)
    await act(async () => {})
    expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notifiche' })).toBeInTheDocument()
  })

  it('exactly 9 unread shows "9", 10 or more shows "9+" (name keeps the real count)', async () => {
    const nine = renderBell(9)
    expect(await screen.findByTestId('notification-badge')).toHaveTextContent(/^9$/)
    nine.unmount()
    renderBell(12)
    expect(await screen.findByTestId('notification-badge')).toHaveTextContent(/^9\+$/)
    expect(screen.getByRole('button', { name: 'Notifiche: 12 non lette' })).toBeInTheDocument()
  })

  it('AC3: the badge disappears once the panel has been opened', async () => {
    renderBell(4)
    await screen.findByTestId('notification-badge')
    act(() => api.markOpened())
    expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notifiche' })).toBeInTheDocument()
  })

  it('the badge follows reads before opening', async () => {
    renderBell(4)
    await screen.findByTestId('notification-badge')
    act(() => api.markRead('n0'))
    await waitFor(() => expect(screen.getByTestId('notification-badge')).toHaveTextContent('3'))
  })

  it('is a real button, hidden icon, focus ring', () => {
    renderBell(0)
    const bell = screen.getByRole('button', { name: 'Notifiche' })
    expect(bell).toHaveAttribute('type', 'button')
    expect(bell.className).toMatch(/focus-visible:ring-2/)
    expect(bell.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})

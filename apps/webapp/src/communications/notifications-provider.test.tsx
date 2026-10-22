import { act, render, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createMockNotificationService } from './mock-notification-service'
import type { NotificationService } from './notification-service'
import { NotificationsProvider, useNotifications } from './notifications-provider'

function setup(service: NotificationService = createMockNotificationService()) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NotificationsProvider service={service}>{children}</NotificationsProvider>
  )
  return renderHook(() => useNotifications(), { wrapper })
}

describe('NotificationsProvider', () => {
  it('loads the list from the service; badge = unread count', async () => {
    const { result } = setup()
    expect(result.current.notifications).toEqual([])
    expect(result.current.badge).toBe(0)
    await waitFor(() => expect(result.current.notifications).toHaveLength(4))
    expect(result.current.badge).toBe(4)
    expect(result.current.notifications.every((n) => !result.current.isRead(n.id))).toBe(true)
  })

  it('markOpened zeroes the badge but leaves every notification unread', async () => {
    const { result } = setup()
    await waitFor(() => expect(result.current.badge).toBe(4))
    act(() => result.current.markOpened())
    expect(result.current.badge).toBe(0)
    expect(result.current.notifications.every((n) => !result.current.isRead(n.id))).toBe(true)
  })

  it('markRead marks only that notification, idempotently', async () => {
    const { result } = setup()
    await waitFor(() => expect(result.current.badge).toBe(4))
    const [first, second] = result.current.notifications
    act(() => result.current.markRead(first.id))
    act(() => result.current.markRead(first.id))
    expect(result.current.isRead(first.id)).toBe(true)
    expect(result.current.isRead(second.id)).toBe(false)
    expect(result.current.badge).toBe(3)
  })

  it('reading after opening keeps the badge at 0', async () => {
    const { result } = setup()
    await waitFor(() => expect(result.current.badge).toBe(4))
    act(() => result.current.markOpened())
    act(() => result.current.markRead(result.current.notifications[0].id))
    expect(result.current.badge).toBe(0)
  })

  it('every mount restarts from the initial state (nothing persisted)', async () => {
    const first = setup()
    await waitFor(() => expect(first.result.current.badge).toBe(4))
    act(() => first.result.current.markOpened())
    act(() => first.result.current.markRead(first.result.current.notifications[0].id))
    first.unmount()
    const second = setup()
    await waitFor(() => expect(second.result.current.badge).toBe(4))
    expect(
      second.result.current.notifications.every((n) => !second.result.current.isRead(n.id)),
    ).toBe(true)
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
  })

  it.each([
    ['rejects', () => createMockNotificationService({ fail: true })],
    [
      'throws synchronously',
      (): NotificationService => ({
        list: () => {
          throw new Error('boom')
        },
      }),
    ],
  ])('a service that %s = empty list, no badge', async (_, make) => {
    const { result } = setup(make())
    await act(async () => {})
    expect(result.current.notifications).toEqual([])
    expect(result.current.badge).toBe(0)
  })

  it('an empty service = no badge', async () => {
    const { result } = setup({ list: () => Promise.resolve([]) })
    await act(async () => {})
    expect(result.current.badge).toBe(0)
  })

  it('ignores a late answer after unmount', async () => {
    let resolve!: (v: never[]) => void
    const service = { list: () => new Promise<never[]>((r) => (resolve = r)) }
    const { unmount } = setup(service)
    await act(async () => {})
    unmount()
    await act(async () => resolve([]))
  })

  it('useNotifications outside the provider throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(/NotificationsProvider/)
    spy.mockRestore()
  })
})

function Probe() {
  useNotifications()
  return null
}

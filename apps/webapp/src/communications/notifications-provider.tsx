import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createMockNotificationService } from './mock-notification-service'
import type { AppNotification, NotificationService } from './notification-service'

interface NotificationsState {
  notifications: AppNotification[]
  isRead: (id: string) => boolean
  /** Unread count shown on the bell: zeroed once the panel has been opened. */
  badge: number
  /** The panel became visible: zeroes the badge, notifications stay unread. */
  markOpened: () => void
  markRead: (id: string) => void
}

const NotificationsContext = createContext<NotificationsState | null>(null)
const defaultService = createMockNotificationService()

// In-memory only: a new mount (page reload) always restarts from the service's initial state.
export function NotificationsProvider({
  service = defaultService,
  children,
}: {
  service?: NotificationService
  children: ReactNode
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set())
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    let current = true
    // A failing (or throwing) service is a non-blocking secondary feature: empty list.
    Promise.resolve()
      .then(() => service.list())
      .then(
        (list) => current && setNotifications(list),
        () => current && setNotifications([]),
      )
    return () => {
      current = false
    }
  }, [service])

  const markOpened = useCallback(() => setOpened(true), [])
  const markRead = useCallback((id: string) => setReadIds((ids) => new Set(ids).add(id)), [])

  const value = useMemo<NotificationsState>(() => {
    const unread = notifications.filter((n) => !readIds.has(n.id)).length
    return {
      notifications,
      isRead: (id) => readIds.has(id),
      badge: opened ? 0 : unread,
      markOpened,
      markRead,
    }
  }, [notifications, readIds, opened, markOpened, markRead])

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications(): NotificationsState {
  const value = useContext(NotificationsContext)
  if (!value) throw new Error('useNotifications must be used inside NotificationsProvider')
  return value
}

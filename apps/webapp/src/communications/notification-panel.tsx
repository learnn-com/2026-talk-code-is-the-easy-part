import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useDesktop } from '@/catalog/use-desktop'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from './format-relative-time'
import { NotificationBell } from './notification-bell'
import { useNotifications } from './notifications-provider'

const TITLE_CLASS = 'px-4 py-3 text-base font-semibold'

function NotificationList() {
  const { notifications, isRead, markRead } = useNotifications()
  // Fixed when the panel opens (the list mounts with it), so dates do not drift under the user.
  const [now] = useState(() => Date.now())
  if (notifications.length === 0)
    return <p className="px-4 py-6 text-sm text-muted-foreground">Nessuna notifica</p>
  return (
    <ul className="overflow-y-auto">
      {notifications.map((n) => {
        const read = isRead(n.id)
        return (
          <li key={n.id} className="border-t border-border">
            <button
              type="button"
              onClick={() => markRead(n.id)}
              className="flex min-h-11 w-full gap-3 px-4 py-3 text-left hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span
                aria-hidden
                className={cn('mt-1.5 size-2 shrink-0 rounded-full', !read && 'bg-destructive')}
              />
              <span className="min-w-0 flex-1 break-words">
                <span
                  className={cn('block text-sm', read ? 'text-muted-foreground' : 'font-semibold')}
                >
                  {n.title}
                </span>
                <span className="block text-sm text-muted-foreground">{n.body}</span>
                <time
                  dateTime={new Date(n.createdAt).toISOString()}
                  className="block text-xs text-muted-foreground"
                >
                  {formatRelativeTime(n.createdAt, now)}
                </time>
              </span>
              <span className="sr-only">{read ? 'Letta' : 'Non letta'}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// Opening the panel (either form) zeroes the bell badge; notifications stay unread until tapped.
// Desktop (md+): dropdown popover; mobile: sheet. Both trap focus and close on Esc.
export function NotificationPanel() {
  const desktop = useDesktop()
  const { markOpened } = useNotifications()
  const onOpenChange = (open: boolean) => open && markOpened()

  if (desktop)
    return (
      <Popover modal onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <NotificationBell />
        </PopoverTrigger>
        <PopoverContent align="end" aria-label="Notifiche" className="max-h-[70vh] overflow-y-auto">
          <h2 className={TITLE_CLASS}>Notifiche</h2>
          <NotificationList />
        </PopoverContent>
      </Popover>
    )

  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <NotificationBell />
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className={TITLE_CLASS}>Notifiche</SheetTitle>
        <div className="flex-1 overflow-y-auto">
          <NotificationList />
        </div>
      </SheetContent>
    </Sheet>
  )
}

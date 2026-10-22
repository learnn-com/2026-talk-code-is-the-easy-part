import { Bell } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { useNotifications } from './notifications-provider'

const MAX_BADGE = 9

// The accessible name carries the real unread count; the visual badge is capped ("9+").
export function NotificationBell({ className, ...props }: React.ComponentProps<'button'>) {
  const { badge } = useNotifications()
  return (
    <button
      type="button"
      aria-label={badge > 0 ? `Notifiche: ${badge} non lette` : 'Notifiche'}
      className={cn(
        'relative inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    >
      <Bell aria-hidden className="size-5" />
      {badge > 0 && (
        <span
          aria-hidden
          data-testid="notification-badge"
          className="absolute right-0 top-0 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold leading-5 text-primary-foreground"
        >
          {badge > MAX_BADGE ? `${MAX_BADGE}+` : badge}
        </span>
      )}
    </button>
  )
}

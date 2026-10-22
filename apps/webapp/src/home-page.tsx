import { SeriesSection } from './catalog/series-section'
import { ThemeSections } from './catalog/theme-sections'
import { NotificationPanel } from './communications/notification-panel'
import { NotificationsProvider } from './communications/notifications-provider'
import { UserMenu } from './membership/user-menu'

export function HomePage() {
  return (
    <NotificationsProvider>
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <span className="text-2xl font-bold tracking-tight">Learnn</span>
        <div className="flex items-center gap-2">
          <NotificationPanel />
          <UserMenu />
        </div>
      </header>
      <main className="flex flex-col gap-8 px-6 py-8">
        <h1 className="sr-only">Home</h1>
        <SeriesSection />
        <ThemeSections />
      </main>
    </NotificationsProvider>
  )
}

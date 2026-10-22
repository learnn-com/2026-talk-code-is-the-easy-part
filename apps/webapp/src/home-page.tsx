import { SeriesSection } from './catalog/series-section'
import { ThemeSections } from './catalog/theme-sections'
import { UserMenu } from './membership/user-menu'

export function HomePage() {
  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <span className="text-2xl font-bold tracking-tight">Learnn</span>
        <UserMenu />
      </header>
      <main className="flex flex-col gap-8 px-6 py-8">
        <h1 className="sr-only">Home</h1>
        <SeriesSection />
        <ThemeSections />
      </main>
    </>
  )
}

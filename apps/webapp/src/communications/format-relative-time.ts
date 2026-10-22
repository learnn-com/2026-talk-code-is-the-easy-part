const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatRelativeTime(at: number, now: number): string {
  const diff = now - at
  if (diff < MINUTE) return 'adesso'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min fa`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} h fa`
  if (diff < 2 * DAY) return 'ieri'
  return `${Math.floor(diff / DAY)} giorni fa`
}

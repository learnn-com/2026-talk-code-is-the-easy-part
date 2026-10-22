export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return [hours > 0 && `${hours}h`, minutes > 0 && `${minutes}min`].filter(Boolean).join(' ')
}

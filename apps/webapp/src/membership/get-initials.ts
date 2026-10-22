/** First letter of the first two words (name and surname), uppercase; '' when the name is blank. */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0].toLocaleUpperCase())
    .join('')
}

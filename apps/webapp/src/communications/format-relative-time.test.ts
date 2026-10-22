import { formatRelativeTime } from './format-relative-time'

const NOW = Date.parse('2026-10-22T12:00:00Z')
const ago = (ms: number) => formatRelativeTime(NOW - ms, NOW)
const MIN = 60_000
const H = 60 * MIN
const D = 24 * H

describe('formatRelativeTime', () => {
  it.each([
    [0, 'adesso'],
    [59_999, 'adesso'],
    [MIN, '1 min fa'],
    [59 * MIN + 59_999, '59 min fa'],
    [H, '1 h fa'],
    [23 * H + 59 * MIN, '23 h fa'],
    [D, 'ieri'],
    [2 * D - 1, 'ieri'],
    [2 * D, '2 giorni fa'],
    [10 * D, '10 giorni fa'],
  ])('%i ms ago = %s', (ms, expected) => expect(ago(ms)).toBe(expected))

  it('a date in the future reads "adesso"', () => {
    expect(formatRelativeTime(NOW + H, NOW)).toBe('adesso')
  })
})

import { formatDuration } from './format-duration'

describe('formatDuration', () => {
  it.each([
    [80, '1h 20min'],
    [24, '24min'],
    [60, '1h'],
    [125, '2h 5min'],
    [1, '1min'],
  ])('%i minutes -> %s', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected)
  })
})

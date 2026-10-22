import { cn } from './utils'

describe('cn', () => {
  it('merges conflicting tailwind classes, last wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('drops falsy values', () => {
    expect(cn('a', null, undefined, 'c')).toBe('a c')
  })
})

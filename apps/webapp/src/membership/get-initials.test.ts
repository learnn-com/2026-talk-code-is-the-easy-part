import { getInitials } from './get-initials'

describe('getInitials', () => {
  it.each([
    ['Abbonato Demo', 'AD'],
    ['mario rossi', 'MR'],
    ['Mario', 'M'],
    ['mario', 'M'],
    ['  Mario   Rossi  ', 'MR'],
    ['Mario De Rossi', 'MD'],
    ['Éva Ångström', 'ÉÅ'],
    ['', ''],
    ['   ', ''],
  ])('%j -> %j', (name, expected) => {
    expect(getInitials(name)).toBe(expected)
  })

  it('keeps an astral first character whole', () => {
    expect(getInitials('𝒜lice')).toBe('𝒜')
  })
})

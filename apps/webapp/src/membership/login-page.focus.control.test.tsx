import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MIN_NON_TEXT_CONTRAST,
  WHITE_INPUT_BACKGROUND,
  contrast,
  focusRingRgb,
} from '../test-support/focus-ring'
import { AuthProvider } from './auth-provider'
import type { AuthService } from './auth-service'
import { LoginPage } from './login-page'

function setup() {
  const service: AuthService = {
    login: vi.fn(() => Promise.reject(new Error('unused'))),
    getSession: () => null,
    logout: vi.fn(),
  }
  render(
    <AuthProvider service={service}>
      <LoginPage />
    </AuthProvider>,
  )
  return userEvent.setup()
}

const toggle = (name: 'Mostra password' | 'Nascondi password' = 'Mostra password') =>
  screen.getByRole('button', { name })

describe('LoginPage password toggle focus indicator controls (r0-1)', () => {
  it('oracle calibration: a white ring is 1:1 and a black ring passes on the white input', async () => {
    expect(
      contrast(await focusRingRgb('focus-visible:ring-ring'), WHITE_INPUT_BACKGROUND),
    ).toBeCloseTo(1, 5)
    expect(
      contrast(await focusRingRgb('focus-visible:ring-black'), WHITE_INPUT_BACKGROUND),
    ).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST)
  })

  it('keeps a visible ring width on keyboard focus', () => {
    setup()
    expect(toggle().className).toMatch(/(^|\s)focus-visible:ring-[1-9]\d*(\s|$)/)
  })

  it('is reachable by Tab from the password field', async () => {
    const user = setup()
    await user.click(screen.getByLabelText('Password'))
    await user.tab()
    expect(toggle()).toHaveFocus()
  })
})

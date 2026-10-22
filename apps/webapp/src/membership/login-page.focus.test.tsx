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

describe('LoginPage password toggle focus indicator (r0-1)', () => {
  it('focus ring contrasts at least 3:1 against the white input (Mostra password)', async () => {
    setup()
    const ratio = contrast(await focusRingRgb(toggle().className), WHITE_INPUT_BACKGROUND)
    expect(ratio).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST)
  })

  it('focus ring contrasts at least 3:1 against the white input (Nascondi password)', async () => {
    const user = setup()
    await user.click(toggle())
    const ratio = contrast(
      await focusRingRgb(toggle('Nascondi password').className),
      WHITE_INPUT_BACKGROUND,
    )
    expect(ratio).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST)
  })
})

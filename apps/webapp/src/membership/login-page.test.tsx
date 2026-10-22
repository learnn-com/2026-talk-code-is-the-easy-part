import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './auth-provider'
import { InvalidCredentialsError, type AuthService, type Session } from './auth-service'
import { LoginPage } from './login-page'

const session: Session = { token: 't', user: { email: 'a@learnn.com', name: 'A' } }

function setup(login: AuthService['login'] = () => Promise.resolve(session)) {
  const service: AuthService = { login: vi.fn(login), getSession: () => null, logout: vi.fn() }
  render(
    <AuthProvider service={service}>
      <LoginPage />
    </AuthProvider>,
  )
  return { service, user: userEvent.setup() }
}

const email = () => screen.getByLabelText('Email')
const password = () => screen.getByLabelText('Password')
const submit = () => screen.getByRole('button', { name: /accedi|accesso in corso/i })

function deferred<T>() {
  let resolve!: (v: T) => void
  let reject!: (e: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('LoginPage', () => {
  describe('AC1 - fields', () => {
    it('shows email, masked password and Accedi', () => {
      setup()
      expect(email()).toBeInTheDocument()
      expect(password()).toHaveAttribute('type', 'password')
      expect(screen.getByRole('button', { name: 'Accedi' })).toBeInTheDocument()
    })

    it('has no "Password dimenticata?" link', () => {
      setup()
      expect(screen.queryByText(/password dimenticata/i)).not.toBeInTheDocument()
    })

    it('toggles password visibility with an accessible button', async () => {
      const { user } = setup()
      await user.click(screen.getByRole('button', { name: 'Mostra password' }))
      expect(password()).toHaveAttribute('type', 'text')
      await user.click(screen.getByRole('button', { name: 'Nascondi password' }))
      expect(password()).toHaveAttribute('type', 'password')
    })
  })

  describe('AC2 - validation without service call', () => {
    it('empty fields: errors under both fields, no call, focus on email', async () => {
      const { service, user } = setup()
      await user.click(submit())
      expect(email()).toHaveAccessibleDescription('Inserisci la tua email')
      expect(password()).toHaveAccessibleDescription('Inserisci la password')
      expect(email()).toBeInvalid()
      expect(password()).toBeInvalid()
      expect(email()).toHaveFocus()
      expect(service.login).not.toHaveBeenCalled()
    })

    it.each(['abc', 'a@b', 'a b@c.it', '@c.it', 'a@.it', 'a@b.', 'a@@b.it', 'a@b..it'])(
      'invalid email %j: error, no call',
      async (value) => {
        const { service, user } = setup()
        await user.type(email(), value)
        await user.type(password(), 'x')
        await user.click(submit())
        expect(email()).toHaveAccessibleDescription('Inserisci un’email valida')
        expect(service.login).not.toHaveBeenCalled()
      },
    )

    it('valid email, empty password: focus moves to password', async () => {
      const { service, user } = setup()
      await user.type(email(), 'a@learnn.com')
      await user.click(submit())
      expect(email()).toBeValid()
      expect(password()).toHaveAccessibleDescription('Inserisci la password')
      expect(password()).toHaveFocus()
      expect(service.login).not.toHaveBeenCalled()
    })

    it('clears the field errors once the inputs are valid', async () => {
      const { service, user } = setup()
      await user.click(submit())
      await user.type(email(), 'a@learnn.com')
      await user.type(password(), 'x')
      await user.click(submit())
      expect(email()).toBeValid()
      expect(password()).toBeValid()
      expect(service.login).toHaveBeenCalledTimes(1)
    })

    it('does not call the service when submitting via Enter with invalid data', async () => {
      const { service, user } = setup()
      await user.type(email(), 'nope{Enter}')
      expect(service.login).not.toHaveBeenCalled()
    })
  })

  describe('AC3 - loading', () => {
    it('disables the button and shows loading while waiting, no double submit', async () => {
      const pending = deferred<Session>()
      const { service, user } = setup(() => pending.promise)
      await user.type(email(), 'a@learnn.com')
      await user.type(password(), 'x{Enter}')
      expect(submit()).toBeDisabled()
      expect(submit()).toHaveTextContent(/accesso in corso/i)
      expect(submit()).toHaveAttribute('aria-busy', 'true')
      await user.type(password(), '{Enter}')
      await user.click(submit())
      fireEvent.submit(submit().closest('form')!)
      expect(service.login).toHaveBeenCalledTimes(1)
      pending.resolve(session)
      await waitFor(() => expect(submit()).toBeEnabled())
      expect(submit()).toHaveTextContent('Accedi')
    })
  })

  describe('AC4 - wrong credentials', () => {
    it('shows the generic message, clears password, keeps email, focuses password', async () => {
      const { user } = setup(() => Promise.reject(new InvalidCredentialsError()))
      await user.type(email(), 'a@learnn.com')
      await user.type(password(), 'wrong')
      await user.click(submit())
      expect(await screen.findByRole('alert')).toHaveTextContent('Email o password non corrette')
      expect(email()).toHaveValue('a@learnn.com')
      expect(password()).toHaveValue('')
      expect(password()).toHaveFocus()
      expect(submit()).toBeEnabled()
    })

    it('hides the credentials error when retrying', async () => {
      const pending = deferred<Session>()
      let first = true
      const { user } = setup(() => {
        if (first) {
          first = false
          return Promise.reject(new InvalidCredentialsError())
        }
        return pending.promise
      })
      await user.type(email(), 'a@learnn.com')
      await user.type(password(), 'wrong{Enter}')
      await screen.findByRole('alert')
      await user.type(password(), 'right{Enter}')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows a distinct generic message on unexpected errors', async () => {
      const { user } = setup(() => Promise.reject(new Error('boom')))
      await user.type(email(), 'a@learnn.com')
      await user.type(password(), 'x')
      await user.click(submit())
      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Qualcosa è andato storto. Riprova.')
      expect(alert).not.toHaveTextContent('boom')
      expect(submit()).toBeEnabled()
    })
  })

  it('passes the typed credentials to the service', async () => {
    const { service, user } = setup()
    await user.type(email(), 'a@learnn.com')
    await user.type(password(), 'secret')
    await user.click(submit())
    expect(service.login).toHaveBeenCalledWith('a@learnn.com', 'secret')
  })
})

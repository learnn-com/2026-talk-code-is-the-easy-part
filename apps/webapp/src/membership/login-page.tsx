import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from './auth-provider'
import { InvalidCredentialsError } from './auth-service'

const EMAIL_FORMAT = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

interface FieldErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email.trim()) errors.email = 'Inserisci la tua email'
  else if (!EMAIL_FORMAT.test(email.trim())) errors.email = 'Inserisci un’email valida'
  if (!password) errors.password = 'Inserisci la password'
  return errors
}

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    setFormError(null)

    const errors = validate(email, password)
    setFieldErrors(errors)
    if (errors.email) return emailRef.current?.focus()
    if (errors.password) return passwordRef.current?.focus()

    setSubmitting(true)
    try {
      await login(email, password)
    } catch (error) {
      setPassword('')
      setFormError(
        error instanceof InvalidCredentialsError
          ? error.message
          : 'Qualcosa è andato storto. Riprova.',
      )
      passwordRef.current?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-10">
      <form noValidate onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="mb-4 text-center text-3xl font-bold">Benvenuto</h1>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            ref={emailRef}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="px-4 text-sm text-destructive">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <div className="relative">
            <Input
              ref={passwordRef}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              className="pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-1 -translate-y-1/2 text-black hover:bg-black/10 focus-visible:ring-black focus-visible:ring-offset-white"
            >
              {showPassword ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
            </Button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="px-4 text-sm text-destructive">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {formError && (
          <p role="alert" className="px-4 text-center text-sm text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={submitting} aria-busy={submitting} className="mt-4">
          {submitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Accesso in corso…
            </>
          ) : (
            'Accedi'
          )}
        </Button>
      </form>
    </main>
  )
}

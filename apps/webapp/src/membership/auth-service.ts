export interface User {
  email: string
  name: string
  photoUrl?: string
}

export interface Session {
  token: string
  user: User
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email o password non corrette')
    this.name = 'InvalidCredentialsError'
  }
}

/** Membership port: the mock and the future Strapi implementation both satisfy it. */
export interface AuthService {
  login(email: string, password: string): Promise<Session>
  getSession(): Session | null
  logout(): void
}

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './membership/auth-provider'
import type { AuthService } from './membership/auth-service'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export function App({ service }: { service: AuthService }) {
  return (
    <AuthProvider service={service}>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

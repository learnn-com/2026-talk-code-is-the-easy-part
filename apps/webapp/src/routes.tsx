import { Navigate, Outlet, type RouteObject } from 'react-router-dom'
import { HomePage } from './home-page'
import { useAuth } from './membership/auth-provider'
import { LoginPage } from './membership/login-page'

function ProtectedRoute() {
  const { session } = useAuth()
  return session ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicOnlyRoute() {
  const { session } = useAuth()
  return session ? <Navigate to="/" replace /> : <Outlet />
}

export const routes: RouteObject[] = [
  { element: <ProtectedRoute />, children: [{ path: '/', element: <HomePage /> }] },
  { element: <PublicOnlyRoute />, children: [{ path: '/login', element: <LoginPage /> }] },
  { path: '*', element: <Navigate to="/" replace /> },
]

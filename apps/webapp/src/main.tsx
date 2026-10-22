import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'
import './index.css'
import { createMockAuthService } from './membership/mock-auth-service'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App service={createMockAuthService()} />
  </StrictMode>,
)

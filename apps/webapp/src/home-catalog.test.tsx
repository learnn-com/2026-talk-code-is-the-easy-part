import { render, screen, waitFor, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { CatalogProvider } from './catalog/catalog-provider'
import { createMockCatalogService } from './catalog/mock-catalog-service'
import { AuthProvider } from './membership/auth-provider'
import { createMockAuthService, SESSION_STORAGE_KEY } from './membership/mock-auth-service'
import { routes } from './routes'

function renderHome(catalog = createMockCatalogService({ latencyMs: 0 })) {
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ token: 't', user: { email: 'a@learnn.com', name: 'Abbonato Demo' } }),
  )
  render(
    <AuthProvider service={createMockAuthService({ latencyMs: 0 })}>
      <CatalogProvider service={catalog}>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />
      </CatalogProvider>
    </AuthProvider>,
  )
}

describe('Home catalog slider', () => {
  it('AC1: Home shows the "Corsi e webinar" slider with ~8 cards below the header', async () => {
    renderHome()
    const slider = await screen.findByRole('region', { name: 'Corsi e webinar' })
    expect(within(slider).getAllByRole('article')).toHaveLength(8)
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { level: 2, name: 'Corsi e webinar' })).toBeVisible()
    expect(main).toContainElement(slider)
  })

  it('AC4: skeletons show while the service answers', () => {
    renderHome({ listSeries: () => new Promise(() => {}) })
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThan(0)
  })

  it('AC5: on failure the header stays visible and Riprova is offered', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, fail: true }))
    expect(await screen.findByText('Non riusciamo a caricare i contenuti')).toBeVisible()
    const header = screen.getByRole('banner')
    expect(within(header).getByText('Learnn')).toBeVisible()
    expect(within(header).getByRole('button', { name: /Menu utente/ })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Riprova' })).toBeVisible()
  })

  it('empty catalog: Home renders with no slider and no error', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, series: [] }))
    await waitFor(() => expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument())
    expect(screen.getByRole('banner')).toBeVisible()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

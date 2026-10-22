import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { CatalogProvider } from './catalog/catalog-provider'
import type { CatalogService, SingleContent } from './catalog/catalog-service'
import { createMockCatalogService, type ThemeData } from './catalog/mock-catalog-service'
import { AuthProvider } from './membership/auth-provider'
import { createMockAuthService, SESSION_STORAGE_KEY } from './membership/mock-auth-service'
import { routes } from './routes'

function renderHome(catalog: CatalogService = createMockCatalogService({ latencyMs: 0 })) {
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
    renderHome({
      ...createMockCatalogService({ latencyMs: 0 }),
      listSeries: () => new Promise(() => {}),
    })
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThan(0)
  })

  it('AC5: on failure the header stays visible and Riprova is offered', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, fail: true }))
    expect(await screen.findAllByText('Non riusciamo a caricare i contenuti')).toHaveLength(2)
    const header = screen.getByRole('banner')
    expect(within(header).getByText('Learnn')).toBeVisible()
    expect(within(header).getByRole('button', { name: /Menu utente/ })).toBeVisible()
    expect(screen.getAllByRole('button', { name: 'Riprova' })).toHaveLength(2)
  })

  it('empty catalog: Home renders with no slider and no error', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, series: [], themes: [] }))
    await waitFor(() => expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument())
    expect(screen.getByRole('banner')).toBeVisible()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

const content = (id: string, title = `Titolo ${id}`): SingleContent => ({
  id,
  title,
  professional: 'Luca Mastella',
  role: 'Designer',
  durationMinutes: 45,
  coverUrl: '/covers/funnel-discovery.jpg',
})

const themes: ThemeData[] = [
  { id: 'z', name: 'Zeta', contents: [content('z1'), content('z2')] },
  { id: 'v', name: 'Vuoto', contents: [] },
  { id: 'a', name: 'Alfa', contents: [content('a1')] },
]

describe('Home theme sliders', () => {
  it('AC1: one slider per dataset theme, below "Corsi e webinar", titled with the theme name', async () => {
    renderHome()
    await screen.findByRole('region', { name: 'Marketing' })
    const names = ['Marketing', 'Vendite', 'AI', 'Produttività']
    const main = screen.getByRole('main')
    const headings = within(main)
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent)
    expect(headings).toEqual(['Corsi e webinar', ...names])
    for (const name of names) {
      const slider = screen.getByRole('region', { name })
      expect(main).toContainElement(slider)
      expect(within(slider).getAllByRole('article').length).toBeGreaterThanOrEqual(6)
    }
  })

  it('AC1: themes appear in the order the service returns them', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, themes }))
    await screen.findByRole('region', { name: 'Zeta' })
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings.slice(1)).toEqual(['Zeta', 'Alfa'])
  })

  it('AC2: theme cards show title, author line and duration, with no episodes, label or "Vedi tutto"', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, themes }))
    const slider = await screen.findByRole('region', { name: 'Alfa' })
    const card = within(slider).getByRole('article')
    expect(within(card).getByRole('heading', { name: 'Titolo a1' })).toBeVisible()
    expect(within(card).getByText('Luca Mastella – Designer')).toBeVisible()
    expect(within(card).getByText('45min')).toBeVisible()
    expect(within(card).queryByText(/puntat|CORSO|WEBINAR/)).not.toBeInTheDocument()
    expect(screen.queryByText(/vedi tutto/i)).not.toBeInTheDocument()
  })

  it('AC3: a theme without contents shows no slider and no error, the others stay', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, themes }))
    await screen.findByRole('region', { name: 'Zeta' })
    expect(screen.queryByRole('region', { name: 'Vuoto' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Vuoto' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Alfa' })).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('AC3: all themes empty shows no theme slider and no error', async () => {
    const empty = themes.map((t) => ({ ...t, contents: [] }))
    renderHome(createMockCatalogService({ latencyMs: 0, themes: empty }))
    await screen.findByRole('region', { name: 'Corsi e webinar' })
    await waitFor(() => expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument())
    expect(screen.getAllByRole('region')).toHaveLength(1)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('AC4: skeletons show in the theme block while the service answers', () => {
    renderHome({
      ...createMockCatalogService({ latencyMs: 0 }),
      listThemes: () => new Promise(() => {}),
    })
    const loading = screen.getByRole('status', { name: 'Caricamento temi' })
    expect(within(loading).getAllByTestId('card-skeleton').length).toBeGreaterThan(0)
  })

  it('AC4: when only the theme calls fail: message + Riprova, header and series slider stay', async () => {
    renderHome({
      ...createMockCatalogService({ latencyMs: 0 }),
      listThemes: () => Promise.reject(new Error('boom')),
    })
    const alert = await screen.findByRole('alert')
    expect(within(alert).getByText('Non riusciamo a caricare i contenuti')).toBeVisible()
    expect(within(alert).getByRole('button', { name: 'Riprova' })).toBeVisible()
    expect(screen.getByRole('banner')).toBeVisible()
    expect(await screen.findByRole('region', { name: 'Corsi e webinar' })).toBeVisible()
  })

  it('AC4: Riprova reloads the themes', async () => {
    const base = createMockCatalogService({ latencyMs: 0 })
    const listThemes = vi
      .fn<CatalogService['listThemes']>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockImplementation(base.listThemes)
    renderHome({ ...base, listThemes })
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Riprova' }))
    expect(await screen.findByRole('region', { name: 'Marketing' })).toBeVisible()
    expect(listThemes).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('AC4: a broken image falls back to the title and leaves the rest of the slider intact', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, themes }))
    const slider = await screen.findByRole('region', { name: 'Zeta' })
    const [first, second] = within(slider).getAllByRole('article')
    first.querySelector('img')!.dispatchEvent(new Event('error'))
    expect(await within(first).findByTestId('cover-fallback')).toHaveTextContent('Titolo z1')
    expect(second.querySelector('img')).toBeInTheDocument()
  })

  it('AC6: theme cards are not interactive', async () => {
    renderHome(createMockCatalogService({ latencyMs: 0, themes }))
    const slider = await screen.findByRole('region', { name: 'Alfa' })
    const card = within(slider).getByRole('article')
    expect(card.querySelector('a, button, [tabindex], [role="button"]')).toBeNull()
  })
})

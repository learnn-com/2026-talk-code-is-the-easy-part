import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CatalogProvider } from './catalog-provider'
import { CatalogUnavailableError, type CatalogService, type Series } from './catalog-service'
import { createMockCatalogService } from './mock-catalog-service'
import { SeriesSection } from './series-section'

const one: Series = {
  id: 's1',
  kind: 'course',
  title: 'Funnel discovery',
  professional: 'Luca Mastella',
  role: 'Designer',
  durationMinutes: 80,
  episodes: 12,
  coverUrl: '/covers/funnel-discovery.jpg',
}

const renderWith = (service: CatalogService) =>
  render(
    <CatalogProvider service={service}>
      <SeriesSection />
    </CatalogProvider>,
  )

describe('SeriesSection', () => {
  it('AC4: while loading, skeleton cards replace the cards', () => {
    renderWith({ listSeries: () => new Promise<Series[]>(() => {}) })
    expect(screen.getByRole('heading', { name: 'Corsi e webinar' })).toBeInTheDocument()
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThanOrEqual(2)
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Caricamento contenuti' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  })

  it('AC1/AC3: once loaded, about 8 cards in the "Corsi e webinar" slider, skeletons gone', async () => {
    renderWith(createMockCatalogService({ latencyMs: 0 }))
    const slider = await screen.findByRole('region', { name: 'Corsi e webinar' })
    expect(within(slider).getAllByRole('article')).toHaveLength(8)
    expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Corsi e webinar' })).toBeInTheDocument()
  })

  it('AC5: a failing service shows the message and Riprova, no slider', async () => {
    renderWith(createMockCatalogService({ latencyMs: 0, fail: true }))
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Non riusciamo a caricare i contenuti')
    expect(within(alert).getByRole('button', { name: 'Riprova' })).toBeInTheDocument()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument()
  })

  it('AC5: Riprova repeats the loading: skeleton, then the cards', async () => {
    const listSeries = vi
      .fn<CatalogService['listSeries']>()
      .mockRejectedValueOnce(new CatalogUnavailableError())
      .mockResolvedValueOnce([one])
    renderWith({ listSeries })
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Riprova' }))
    expect(listSeries).toHaveBeenCalledTimes(2)
    expect(await screen.findByRole('article')).toHaveTextContent('Funnel discovery')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('AC5: Riprova failing again shows the error again', async () => {
    const listSeries = vi
      .fn<CatalogService['listSeries']>()
      .mockRejectedValue(new CatalogUnavailableError())
    renderWith({ listSeries })
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Riprova' }))
    await waitFor(() => expect(listSeries).toHaveBeenCalledTimes(2))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('empty list: no slider, no heading, no error', async () => {
    const listSeries = vi.fn<CatalogService['listSeries']>().mockResolvedValue([])
    const { container } = renderWith({ listSeries })
    await waitFor(() => expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument())
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('AC6: one broken image does not affect the other cards', async () => {
    renderWith({ listSeries: () => Promise.resolve([one, { ...one, id: 's2', title: 'Altro' }]) })
    const cards = await screen.findAllByRole('article')
    const img = cards[0].querySelector('img')!
    img.dispatchEvent(new Event('error'))
    await within(cards[0]).findByTestId('cover-fallback')
    expect(cards[1].querySelector('img')).toBeInTheDocument()
    expect(within(cards[1]).queryByTestId('cover-fallback')).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CatalogProvider } from './catalog-provider'
import { CatalogUnavailableError, type CatalogService, type Series } from './catalog-service'
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

const noThemes = {
  listThemes: () => Promise.resolve([]),
  listThemeContents: () => Promise.resolve([]),
}

const renderWith = (service: Pick<CatalogService, 'listSeries'>) =>
  render(
    <CatalogProvider service={{ ...noThemes, ...service }}>
      <SeriesSection />
    </CatalogProvider>,
  )

const section = () => screen.getByRole('heading', { name: 'Corsi e webinar' }).closest('section')!

const expectFocusInSection = () => {
  expect(document.activeElement).not.toBe(document.body)
  expect(section()).toContainElement(document.activeElement as HTMLElement)
}

const deferred = () => {
  let reject!: (e: Error) => void
  const promise = new Promise<Series[]>((_, r) => {
    reject = r
  })
  return { promise, reject }
}

const failThenPending = () => {
  const second = deferred()
  const listSeries = vi
    .fn<CatalogService['listSeries']>()
    .mockRejectedValueOnce(new CatalogUnavailableError())
    .mockReturnValueOnce(second.promise)
    .mockRejectedValue(new CatalogUnavailableError())
  return { listSeries, second }
}

const focusRiprova = async () => {
  const button = await screen.findByRole('button', { name: 'Riprova' })
  button.focus()
  expect(button).toHaveFocus()
}

describe('SeriesSection keyboard focus across Riprova (r0-3)', () => {
  it('r0-3-enter-loading: Enter on Riprova keeps focus inside the section while loading', async () => {
    const { listSeries } = failThenPending()
    renderWith({ listSeries })
    const user = userEvent.setup()
    await focusRiprova()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('status', { name: 'Caricamento contenuti' })).toBeInTheDocument()
    expectFocusInSection()
  })

  it('r0-3-enter-error-again: after Riprova fails again, focus is still inside the section', async () => {
    const { listSeries, second } = failThenPending()
    renderWith({ listSeries })
    const user = userEvent.setup()
    await focusRiprova()
    await user.keyboard('{Enter}')
    second.reject(new CatalogUnavailableError())
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expectFocusInSection()
  })

  it('r0-3-space-loading: Space on Riprova keeps focus inside the section while loading', async () => {
    const { listSeries } = failThenPending()
    renderWith({ listSeries })
    const user = userEvent.setup()
    await focusRiprova()
    await user.keyboard(' ')
    expect(screen.getByRole('status', { name: 'Caricamento contenuti' })).toBeInTheDocument()
    expectFocusInSection()
  })

  it('r0-3-enter-success: after Riprova succeeds, focus is still inside the section', async () => {
    const listSeries = vi
      .fn<CatalogService['listSeries']>()
      .mockRejectedValueOnce(new CatalogUnavailableError())
      .mockResolvedValueOnce([one])
    renderWith({ listSeries })
    const user = userEvent.setup()
    await focusRiprova()
    await user.keyboard('{Enter}')
    await screen.findByRole('article')
    expectFocusInSection()
  })

  it('r0-3-second-retry: a second Riprova round keeps focus inside the section', async () => {
    const second = deferred()
    const third = deferred()
    const listSeries = vi
      .fn<CatalogService['listSeries']>()
      .mockRejectedValueOnce(new CatalogUnavailableError())
      .mockReturnValueOnce(second.promise)
      .mockReturnValueOnce(third.promise)
    renderWith({ listSeries })
    const user = userEvent.setup()
    await focusRiprova()
    await user.keyboard('{Enter}')
    second.reject(new CatalogUnavailableError())
    await screen.findByRole('alert')
    await focusRiprova()
    await user.keyboard('{Enter}')
    expect(listSeries).toHaveBeenCalledTimes(3)
    expect(screen.getByRole('status', { name: 'Caricamento contenuti' })).toBeInTheDocument()
    expectFocusInSection()
    third.reject(new CatalogUnavailableError())
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expectFocusInSection()
  })

  it('r0-3-no-focus-steal: first render (pending, success or error) does not move focus', async () => {
    const pending = renderWith({ listSeries: () => new Promise<Series[]>(() => {}) })
    expect(screen.getByRole('status', { name: 'Caricamento contenuti' })).toBeInTheDocument()
    expect(document.activeElement).toBe(document.body)
    pending.unmount()
    const ok = renderWith({ listSeries: () => Promise.resolve([one]) })
    await screen.findByRole('article')
    expect(document.activeElement).toBe(document.body)
    ok.unmount()
    renderWith({ listSeries: () => Promise.reject(new CatalogUnavailableError()) })
    await screen.findByRole('alert')
    expect(document.activeElement).toBe(document.body)
  })
})

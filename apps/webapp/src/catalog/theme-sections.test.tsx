import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CatalogProvider } from './catalog-provider'
import { CatalogUnavailableError, type CatalogService } from './catalog-service'
import { createMockCatalogService } from './mock-catalog-service'
import { ThemeSections } from './theme-sections'

const renderWith = (service: CatalogService) =>
  render(
    <CatalogProvider service={service}>
      <ThemeSections />
    </CatalogProvider>,
  )

const failThenPending = () => {
  const base = createMockCatalogService({ latencyMs: 0 })
  return {
    ...base,
    listThemes: vi
      .fn<CatalogService['listThemes']>()
      .mockRejectedValueOnce(new CatalogUnavailableError())
      .mockReturnValueOnce(new Promise(() => {})),
  }
}

describe('ThemeSections keyboard focus across Riprova', () => {
  it('Enter on Riprova keeps focus inside the theme block while loading', async () => {
    const { container } = renderWith(failThenPending())
    const button = await screen.findByRole('button', { name: 'Riprova' })
    button.focus()
    await userEvent.setup().keyboard('{Enter}')
    expect(screen.getByRole('status', { name: 'Caricamento temi' })).toBeVisible()
    expect(document.activeElement).not.toBe(document.body)
    expect(container).toContainElement(document.activeElement as HTMLElement)
  })

  it('renders nothing while empty-success and one slider per theme otherwise', async () => {
    const { container, unmount } = renderWith(
      createMockCatalogService({ latencyMs: 0, themes: [] }),
    )
    await vi.waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(container).toBeEmptyDOMElement()
    unmount()
    renderWith(createMockCatalogService({ latencyMs: 0 }))
    expect(await screen.findAllByRole('region')).toHaveLength(4)
    const first = screen.getByRole('region', { name: 'Marketing' })
    expect(within(first).getAllByRole('article').length).toBeGreaterThan(0)
  })
})

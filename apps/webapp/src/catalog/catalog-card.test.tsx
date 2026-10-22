import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardSkeleton } from './card-skeleton'
import { CatalogCard } from './catalog-card'
import type { Series } from './catalog-service'

const series: Series = {
  id: 's1',
  kind: 'webinar',
  title: 'Funnel discovery',
  professional: 'Luca Mastella',
  role: 'Designer',
  durationMinutes: 80,
  episodes: 16,
  coverUrl: '/covers/funnel-discovery.jpg',
}

describe('CatalogCard', () => {
  it('AC2: shows kind label, episodes, title, "Professionista – Ruolo" and total duration', () => {
    render(<CatalogCard series={series} />)
    expect(screen.getByText('WEBINAR')).toBeInTheDocument()
    expect(screen.getByText('16')).toHaveTextContent('16 puntate')
    expect(screen.getByRole('heading', { name: 'Funnel discovery' })).toBeInTheDocument()
    expect(screen.getByText('Luca Mastella – Designer')).toBeInTheDocument()
    expect(screen.getByText('1h 20min')).toBeInTheDocument()
  })

  it('AC2: a course is labelled CORSO', () => {
    render(<CatalogCard series={{ ...series, kind: 'course' }} />)
    expect(screen.getByText('CORSO')).toBeInTheDocument()
    expect(screen.queryByText('WEBINAR')).not.toBeInTheDocument()
  })

  it('AC2: cover is 4:5 and carries the cover url', () => {
    const { container } = render(<CatalogCard series={series} />)
    expect(container.querySelector('img')).toHaveAttribute('src', series.coverUrl)
    expect(screen.getByTestId('cover')).toHaveClass('aspect-[4/5]')
  })

  it('AC2: no HD/CC/AU/TX pills, no "Vedi tutto"', () => {
    render(<CatalogCard series={series} />)
    for (const pill of ['HD', 'CC', 'AU', 'TX']) {
      expect(screen.queryByText(pill)).not.toBeInTheDocument()
    }
    expect(screen.queryByText(/vedi tutto/i)).not.toBeInTheDocument()
  })

  it('AC6: a failing image is replaced by a fallback showing the title', () => {
    const { container } = render(<CatalogCard series={series} />)
    expect(screen.queryByTestId('cover-fallback')).not.toBeInTheDocument()
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    const fallback = screen.getByTestId('cover-fallback')
    expect(within(fallback).getByText('Funnel discovery')).toBeInTheDocument()
    // the rest of the card stays intact
    expect(screen.getByText('WEBINAR')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
    expect(screen.getByText('Luca Mastella – Designer')).toBeInTheDocument()
  })

  it('AC7: the card is not interactive: no link, no button, not focusable, click is a no-op', async () => {
    const { container } = render(<CatalogCard series={series} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(container.querySelector('a, button, [tabindex], [role="button"]')).toBeNull()
    const before = container.innerHTML
    await userEvent.setup().click(screen.getByRole('heading', { name: 'Funnel discovery' }))
    expect(container.innerHTML).toBe(before)
  })
})

describe('CardSkeleton', () => {
  it('AC4: 4:5 placeholder hidden from assistive tech, with no text', () => {
    render(<CardSkeleton />)
    const skeleton = screen.getByTestId('card-skeleton')
    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    expect(skeleton).toHaveTextContent('')
    expect(within(skeleton).getByTestId('cover')).toHaveClass('aspect-[4/5]')
  })
})

import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SingleContentCard } from './catalog-card'
import type { SingleContent } from './catalog-service'

const content: SingleContent = {
  id: 'c1',
  title: 'Posizionamento che si ricorda',
  professional: 'Luca Mastella',
  role: 'Designer',
  durationMinutes: 80,
  coverUrl: '/covers/funnel-discovery.jpg',
}

describe('SingleContentCard', () => {
  it('AC2: shows title, "Professionista – Ruolo" and duration', () => {
    render(<SingleContentCard content={content} />)
    expect(screen.getByRole('heading', { name: content.title })).toBeInTheDocument()
    expect(screen.getByText('Luca Mastella – Designer')).toBeInTheDocument()
    expect(screen.getByText('1h 20min')).toBeInTheDocument()
  })

  it('AC2: same 4:5 cover as the series card, carrying the cover url', () => {
    const { container } = render(<SingleContentCard content={content} />)
    expect(container.querySelector('img')).toHaveAttribute('src', content.coverUrl)
    expect(screen.getByTestId('cover')).toHaveClass('aspect-[4/5]')
  })

  it('AC2: no episode count, no kind label, no pills, no "Vedi tutto"', () => {
    const { container } = render(<SingleContentCard content={content} />)
    for (const text of ['CORSO', 'WEBINAR', 'HD', 'CC', 'AU', 'TX']) {
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    }
    expect(screen.queryByText(/puntat/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/vedi tutto/i)).not.toBeInTheDocument()
    // only the cover image, the title, the author line and the duration carry text
    expect(container.querySelector('span')).toBeNull()
  })

  it('AC4: a failing image is replaced by a fallback showing the title, the rest stays', () => {
    const { container } = render(<SingleContentCard content={content} />)
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(within(screen.getByTestId('cover-fallback')).getByText(content.title)).toBeVisible()
    expect(screen.getByText('Luca Mastella – Designer')).toBeInTheDocument()
    expect(screen.getByText('1h 20min')).toBeInTheDocument()
  })

  it('AC6: not interactive: no link, no button, not focusable, click is a no-op', async () => {
    const { container } = render(<SingleContentCard content={content} />)
    expect(container.querySelector('a, button, [tabindex], [role="button"]')).toBeNull()
    const before = container.innerHTML
    await userEvent.setup().click(screen.getByRole('heading', { name: content.title }))
    expect(container.innerHTML).toBe(before)
  })
})

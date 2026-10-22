import { render, screen, waitFor } from '@testing-library/react'
import { stubImageLoading } from '@/test-support/image-stub'
import { UserAvatar } from './user-avatar'

const PHOTO = 'https://cdn.learnn.test/me.png'

afterEach(() => vi.unstubAllGlobals())

describe('UserAvatar', () => {
  it('AC2: shows the photo when it loads', async () => {
    stubImageLoading('load')
    const { container } = render(<UserAvatar name="Abbonato Demo" photoUrl={PHOTO} />)
    await waitFor(() => expect(container.querySelector('img')).toHaveAttribute('src', PHOTO))
    expect(screen.queryByText('AD')).not.toBeInTheDocument()
  })

  it('AC2: shows the initials when the photo is missing', () => {
    const { container } = render(<UserAvatar name="Abbonato Demo" />)
    expect(screen.getByText('AD')).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('AC2: shows the initials when the photo fails to load, no error on screen', async () => {
    stubImageLoading('error')
    const { container } = render(<UserAvatar name="Abbonato Demo" photoUrl={PHOTO} />)
    expect(await screen.findByText('AD')).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the initials while the photo is still loading', () => {
    const { container } = render(<UserAvatar name="Demo Learnn" photoUrl={PHOTO} />)
    expect(screen.getByText('DL')).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('single-word name gives one initial', () => {
    render(<UserAvatar name="mario" />)
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('empty name falls back to a neutral icon, without text', () => {
    const { container } = render(<UserAvatar name="  " />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container).toHaveTextContent('')
  })
})

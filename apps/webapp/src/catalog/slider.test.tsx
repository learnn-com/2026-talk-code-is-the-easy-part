import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Slider } from './slider'

function stubDesktop(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  )
}

function renderSlider() {
  render(
    <Slider label="Corsi e webinar">
      <div>uno</div>
      <div>due</div>
      <div>tre</div>
    </Slider>,
  )
  return screen.getByRole('region', { name: 'Corsi e webinar' })
}

function setGeometry(el: HTMLElement, { scrollLeft = 0, clientWidth = 300, scrollWidth = 900 }) {
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth })
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth })
  Object.defineProperty(el, 'scrollLeft', { configurable: true, writable: true, value: scrollLeft })
  fireEvent.scroll(el)
}

const scrollBy = vi.fn()
beforeEach(() => {
  scrollBy.mockReset()
  HTMLElement.prototype.scrollBy = scrollBy
})
afterEach(() => vi.unstubAllGlobals())

describe('Slider', () => {
  it('AC1: renders every child as a scroll-snap item in a keyboard-scrollable region', () => {
    stubDesktop(true)
    const region = renderSlider()
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveClass('overflow-x-auto', 'snap-x')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('due')).toBeInTheDocument()
  })

  it('AC1 desktop: previous/next arrows have accessible names', () => {
    stubDesktop(true)
    renderSlider()
    expect(screen.getByRole('button', { name: 'Precedente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeInTheDocument()
  })

  it('AC1 desktop: the arrows scroll the track horizontally', async () => {
    stubDesktop(true)
    const region = renderSlider()
    setGeometry(region, { scrollLeft: 300 })
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Successivo' }))
    expect(scrollBy).toHaveBeenLastCalledWith(expect.objectContaining({ left: 240 }))
    await user.click(screen.getByRole('button', { name: 'Precedente' }))
    expect(scrollBy).toHaveBeenLastCalledWith(expect.objectContaining({ left: -240 }))
  })

  it('boundary: first card = previous disabled, next enabled', () => {
    stubDesktop(true)
    setGeometry(renderSlider(), { scrollLeft: 0 })
    expect(screen.getByRole('button', { name: 'Precedente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeEnabled()
  })

  it('boundary: in the middle both enabled', () => {
    stubDesktop(true)
    setGeometry(renderSlider(), { scrollLeft: 300 })
    expect(screen.getByRole('button', { name: 'Precedente' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeEnabled()
  })

  it('boundary: last card = next disabled, previous enabled', () => {
    stubDesktop(true)
    setGeometry(renderSlider(), { scrollLeft: 600 })
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Precedente' })).toBeEnabled()
  })

  it('boundary: fractional scroll positions at the end still count as the end', () => {
    stubDesktop(true)
    setGeometry(renderSlider(), { scrollLeft: 599.5 })
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeDisabled()
  })

  it('boundary: content that fits disables both arrows', () => {
    stubDesktop(true)
    setGeometry(renderSlider(), { scrollLeft: 0, scrollWidth: 300 })
    expect(screen.getByRole('button', { name: 'Precedente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeDisabled()
  })

  it('AC1 mobile: no arrows, swipe only', () => {
    stubDesktop(false)
    renderSlider()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('without matchMedia (no desktop signal) there are no arrows', () => {
    vi.stubGlobal('matchMedia', undefined)
    renderSlider()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('resizing the window re-evaluates the boundaries', () => {
    stubDesktop(true)
    const region = renderSlider()
    setGeometry(region, { scrollLeft: 0, scrollWidth: 900 })
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeEnabled()
    Object.defineProperty(region, 'scrollWidth', { configurable: true, value: 300 })
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeDisabled()
  })
})

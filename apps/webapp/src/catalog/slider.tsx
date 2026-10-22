import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { CARD_WIDTH } from './catalog-card'
import { useDesktop } from './use-desktop'

const SCROLL_FRACTION = 0.8

// Native scroll-snap: swipe on touch, arrow keys on the focused track, buttons on desktop only.
export function Slider({ label, children }: { label: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null)
  const desktop = useDesktop()
  const [edges, setEdges] = useState({ start: true, end: true })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 0,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const scroll = (direction: 1 | -1) =>
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * SCROLL_FRACTION,
      behavior: 'smooth',
    })

  return (
    <div className="relative">
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={update}
        className="snap-x snap-mandatory overflow-x-auto rounded-2xl pb-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex gap-4">
          {Children.map(children, (child) => (
            <li className={`${CARD_WIDTH} shrink-0 snap-start`}>{child}</li>
          ))}
        </ul>
      </div>
      {desktop && (
        <>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Precedente"
            disabled={edges.start}
            onClick={() => scroll(-1)}
            className="absolute top-1/3 left-2 border border-border bg-black/80 hover:bg-black"
          >
            <ChevronLeft aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Successivo"
            disabled={edges.end}
            onClick={() => scroll(1)}
            className="absolute top-1/3 right-2 border border-border bg-black/80 hover:bg-black"
          >
            <ChevronRight aria-hidden />
          </Button>
        </>
      )}
    </div>
  )
}

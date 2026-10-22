import { useRef } from 'react'
import { SingleContentCard } from './catalog-card'
import { SectionError, SectionLoading } from './section-states'
import { Slider } from './slider'
import { useThemeSections } from './use-theme-sections'

// One slider per non-empty theme, in service order. Loading/error/retry are per block, not per slider.
export function ThemeSections() {
  const { status, sections, retry } = useThemeSections()
  const block = useRef<HTMLDivElement>(null)
  const onRetry = () => {
    block.current?.focus()
    retry()
  }
  if (status === 'success' && sections.length === 0) return null

  return (
    <div ref={block} tabIndex={-1} className="flex flex-col gap-8 outline-none">
      {status === 'loading' && <SectionLoading label="Caricamento temi" />}
      {status === 'error' && <SectionError onRetry={onRetry} />}
      {status === 'success' &&
        sections.map(({ theme, contents }) => (
          <section key={theme.id} className="flex flex-col gap-4">
            <h2 className="text-xl">{theme.name}</h2>
            <Slider label={theme.name}>
              {contents.map((c) => (
                <SingleContentCard key={c.id} content={c} />
              ))}
            </Slider>
          </section>
        ))}
    </div>
  )
}

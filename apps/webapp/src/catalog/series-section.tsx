import { useRef } from 'react'
import { CatalogCard } from './catalog-card'
import { SectionError, SectionLoading } from './section-states'
import { Slider } from './slider'
import { useSeries } from './use-series'

const TITLE = 'Corsi e webinar'

export function SeriesSection() {
  const { status, series, retry } = useSeries()
  const heading = useRef<HTMLHeadingElement>(null)
  const onRetry = () => {
    heading.current?.focus()
    retry()
  }
  if (status === 'success' && series.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 ref={heading} tabIndex={-1} className="text-xl outline-none">
        {TITLE}
      </h2>
      {status === 'loading' && <SectionLoading label="Caricamento contenuti" />}
      {status === 'error' && <SectionError onRetry={onRetry} />}
      {status === 'success' && (
        <Slider label={TITLE}>
          {series.map((s) => (
            <CatalogCard key={s.id} series={s} />
          ))}
        </Slider>
      )}
    </section>
  )
}

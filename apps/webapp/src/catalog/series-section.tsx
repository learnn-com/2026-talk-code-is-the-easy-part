import { Button } from '@/components/ui/button'
import { CardSkeleton } from './card-skeleton'
import { CARD_WIDTH, CatalogCard } from './catalog-card'
import { Slider } from './slider'
import { useSeries } from './use-series'

const TITLE = 'Corsi e webinar'
const SKELETON_COUNT = 4

export function SeriesSection() {
  const { status, series, retry } = useSeries()
  if (status === 'success' && series.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl">{TITLE}</h2>
      {status === 'loading' && (
        <div
          role="status"
          aria-busy="true"
          aria-label="Caricamento contenuti"
          className="flex gap-4 overflow-hidden"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div key={i} className={`${CARD_WIDTH} shrink-0`}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="flex flex-col items-start gap-3">
          <p>Non riusciamo a caricare i contenuti</p>
          <Button onClick={retry}>Riprova</Button>
        </div>
      )}
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

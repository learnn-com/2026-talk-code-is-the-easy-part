import { Button } from '@/components/ui/button'
import { CardSkeleton } from './card-skeleton'
import { CARD_WIDTH } from './catalog-card'

const SKELETON_COUNT = 4

export function SectionLoading({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="flex gap-4 overflow-hidden">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <div key={i} className={`${CARD_WIDTH} shrink-0`}>
          <CardSkeleton />
        </div>
      ))}
    </div>
  )
}

export function SectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p>Non riusciamo a caricare i contenuti</p>
      <Button onClick={onRetry}>Riprova</Button>
    </div>
  )
}

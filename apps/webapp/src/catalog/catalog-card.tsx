import { useState } from 'react'
import type { Series } from './catalog-service'
import { formatDuration } from './format-duration'

export const CARD_WIDTH = 'w-40 sm:w-48 md:w-56'

const KIND_LABEL = { course: 'CORSO', webinar: 'WEBINAR' } as const

// Not interactive on purpose (US 2.1 AC3 / US 3.1 are out of scope): no link, no button, no tab stop.
export function CatalogCard({ series }: { series: Series }) {
  const [imageFailed, setImageFailed] = useState(false)
  return (
    <article className="flex flex-col gap-2">
      <div
        data-testid="cover"
        className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-zinc-900"
      >
        {imageFailed ? (
          <div
            data-testid="cover-fallback"
            className="flex size-full items-center justify-center p-4 text-center text-base font-bold"
          >
            {series.title}
          </div>
        ) : (
          <img
            src={series.coverUrl}
            alt=""
            className="size-full object-cover"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="absolute top-2 left-2 rounded-md border border-white/70 bg-black/60 px-2 py-0.5 text-xs font-bold">
          {KIND_LABEL[series.kind]}
        </span>
        <span className="absolute right-3 bottom-2 text-2xl font-bold drop-shadow">
          {series.episodes}
          <span className="sr-only"> puntate</span>
        </span>
      </div>
      <h3 className="text-base leading-tight font-bold">{series.title}</h3>
      <p className="text-sm text-muted-foreground">
        {series.professional} – {series.role}
      </p>
      <p className="text-sm font-bold">{formatDuration(series.durationMinutes)}</p>
    </article>
  )
}

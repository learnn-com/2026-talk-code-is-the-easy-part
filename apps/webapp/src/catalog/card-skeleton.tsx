export function CardSkeleton() {
  return (
    <div
      data-testid="card-skeleton"
      aria-hidden="true"
      className="flex animate-pulse flex-col gap-2"
    >
      <div data-testid="cover" className="aspect-[4/5] rounded-2xl bg-zinc-800" />
      <div className="h-4 w-3/4 rounded bg-zinc-800" />
      <div className="h-3.5 w-1/2 rounded bg-zinc-800" />
      <div className="h-3.5 w-1/3 rounded bg-zinc-800" />
    </div>
  )
}

import { CatalogUnavailableError, type CatalogService, type Series } from './catalog-service'
import dataset from './series.json'

interface Options {
  latencyMs?: number
  fail?: boolean
  series?: Series[]
}

const DATASET = (dataset as { series: Series[] }).series

export function createMockCatalogService({
  latencyMs = 600,
  fail = false,
  series = DATASET,
}: Options = {}): CatalogService {
  return {
    async listSeries() {
      await new Promise((resolve) => setTimeout(resolve, latencyMs))
      if (fail) throw new CatalogUnavailableError()
      return [...series]
    },
  }
}

// Demo knobs (README): VITE_CATALOG_FAIL=true forces the error state, VITE_CATALOG_LATENCY_MS sets the delay.
export function createDefaultCatalogService(): CatalogService {
  const raw = String(import.meta.env.VITE_CATALOG_LATENCY_MS ?? '').trim()
  const latency = raw === '' ? NaN : Number(raw)
  return createMockCatalogService({
    fail: import.meta.env.VITE_CATALOG_FAIL === 'true',
    latencyMs: Number.isFinite(latency) && latency >= 0 ? latency : undefined,
  })
}

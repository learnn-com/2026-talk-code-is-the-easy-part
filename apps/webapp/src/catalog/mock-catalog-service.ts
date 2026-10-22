import {
  CatalogUnavailableError,
  type CatalogService,
  type Series,
  type SingleContent,
  type Theme,
} from './catalog-service'
import seriesDataset from './series.json'
import themesDataset from './themes.json'

export type ThemeData = Theme & { contents: SingleContent[] }

interface Options {
  latencyMs?: number
  fail?: boolean
  series?: Series[]
  themes?: ThemeData[]
}

const SERIES = (seriesDataset as { series: Series[] }).series
const THEMES = (themesDataset as { themes: ThemeData[] }).themes

export function createMockCatalogService({
  latencyMs = 600,
  fail = false,
  series = SERIES,
  themes = THEMES,
}: Options = {}): CatalogService {
  const respond = async <T>(read: () => T): Promise<T> => {
    await new Promise((resolve) => setTimeout(resolve, latencyMs))
    if (fail) throw new CatalogUnavailableError()
    return read()
  }
  return {
    listSeries: () => respond(() => [...series]),
    listThemes: () => respond(() => themes.map(({ id, name }) => ({ id, name }))),
    listThemeContents: (themeId) =>
      respond(() => [...(themes.find((t) => t.id === themeId)?.contents ?? [])]),
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

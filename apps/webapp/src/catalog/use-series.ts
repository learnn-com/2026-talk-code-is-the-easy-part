import type { CatalogService, Series } from './catalog-service'
import { useCatalogLoad } from './use-catalog-load'

const load = (service: CatalogService) => service.listSeries()
const EMPTY: Series[] = []

export function useSeries() {
  const { status, data, retry } = useCatalogLoad(load, EMPTY)
  return { status, series: data, retry }
}

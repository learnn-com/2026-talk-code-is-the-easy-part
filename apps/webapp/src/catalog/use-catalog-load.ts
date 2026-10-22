import { useCallback, useEffect, useState } from 'react'
import { useCatalog } from './catalog-provider'
import type { CatalogService } from './catalog-service'

export type LoadStatus = 'loading' | 'error' | 'success'

// Shared loading/error/retry state of a catalog section. `load` must be a stable function.
export function useCatalogLoad<T>(load: (service: CatalogService) => Promise<T>, empty: T) {
  const service = useCatalog()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ status: LoadStatus; data: T }>({
    status: 'loading',
    data: empty,
  })

  useEffect(() => {
    let current = true
    load(service).then(
      (data) => current && setState({ status: 'success', data }),
      () => current && setState({ status: 'error', data: empty }),
    )
    return () => {
      current = false
    }
  }, [service, load, empty, attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading', data: empty })
    setAttempt((n) => n + 1)
  }, [empty])

  return { ...state, retry }
}

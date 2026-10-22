import { useCallback, useEffect, useState } from 'react'
import { useCatalog } from './catalog-provider'
import type { Series } from './catalog-service'

type State = { status: 'loading' | 'error' | 'success'; series: Series[] }

export function useSeries() {
  const service = useCatalog()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<State>({ status: 'loading', series: [] })

  useEffect(() => {
    let current = true
    service.listSeries().then(
      (series) => current && setState({ status: 'success', series }),
      () => current && setState({ status: 'error', series: [] }),
    )
    return () => {
      current = false
    }
  }, [service, attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading', series: [] })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, retry }
}

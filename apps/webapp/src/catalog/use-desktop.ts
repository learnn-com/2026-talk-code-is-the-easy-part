import { useSyncExternalStore } from 'react'

const QUERY = '(min-width: 768px)'

function subscribe(onChange: () => void) {
  const mql = window.matchMedia?.(QUERY)
  mql?.addEventListener('change', onChange)
  return () => mql?.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia?.(QUERY).matches ?? false

export const useDesktop = () => useSyncExternalStore(subscribe, getSnapshot, () => false)

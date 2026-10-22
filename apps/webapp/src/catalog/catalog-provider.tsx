import { createContext, useContext, type ReactNode } from 'react'
import type { CatalogService } from './catalog-service'
import { createDefaultCatalogService } from './mock-catalog-service'

const defaultService = createDefaultCatalogService()
const CatalogContext = createContext<CatalogService>(defaultService)

export function CatalogProvider({
  service,
  children,
}: {
  service: CatalogService
  children: ReactNode
}) {
  return <CatalogContext.Provider value={service}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)

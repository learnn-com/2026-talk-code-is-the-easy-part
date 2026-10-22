export type SeriesKind = 'course' | 'webinar'

export interface Series {
  id: string
  kind: SeriesKind
  title: string
  professional: string
  role: string
  durationMinutes: number
  episodes: number
  coverUrl: string
}

export interface CatalogService {
  listSeries(): Promise<Series[]>
}

export class CatalogUnavailableError extends Error {
  constructor() {
    super('Catalogo non disponibile')
  }
}

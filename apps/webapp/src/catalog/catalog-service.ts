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

// Categoria = Tema (glossary). Themes are dynamic data from the service, never hardcoded in the UI.
export interface Theme {
  id: string
  name: string
}

export interface SingleContent {
  id: string
  title: string
  professional: string
  role: string
  durationMinutes: number
  coverUrl: string
}

export interface CatalogService {
  listSeries(): Promise<Series[]>
  /** Themes in display order. */
  listThemes(): Promise<Theme[]>
  /** Single contents of one theme; unknown theme = empty list. */
  listThemeContents(themeId: string): Promise<SingleContent[]>
}

export class CatalogUnavailableError extends Error {
  constructor() {
    super('Catalogo non disponibile')
  }
}

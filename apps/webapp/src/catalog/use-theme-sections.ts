import type { CatalogService, SingleContent, Theme } from './catalog-service'
import { useCatalogLoad } from './use-catalog-load'

export interface ThemeSectionData {
  theme: Theme
  contents: SingleContent[]
}

// One load for the whole block: themes first, then each theme's contents; empty themes are dropped.
async function load(service: CatalogService): Promise<ThemeSectionData[]> {
  const themes = await service.listThemes()
  const lists = await Promise.all(themes.map((t) => service.listThemeContents(t.id)))
  return themes
    .map((theme, i) => ({ theme, contents: lists[i] }))
    .filter((section) => section.contents.length > 0)
}
const EMPTY: ThemeSectionData[] = []

export function useThemeSections() {
  const { status, data, retry } = useCatalogLoad(load, EMPTY)
  return { status, sections: data, retry }
}

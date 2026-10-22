import { CatalogUnavailableError, type SingleContent } from './catalog-service'
import { createDefaultCatalogService, createMockCatalogService } from './mock-catalog-service'

const content = (id: string): SingleContent => ({
  id,
  title: `Titolo ${id}`,
  professional: 'Luca Mastella',
  role: 'Designer',
  durationMinutes: 30,
  coverUrl: '/covers/funnel-discovery.jpg',
})

const fixture = [
  { id: 'b', name: 'Beta', contents: [content('b1')] },
  { id: 'a', name: 'Alfa', contents: [content('a1'), content('a2')] },
  { id: 'v', name: 'Vuoto', contents: [] },
]

describe('mock catalog service: themes', () => {
  it('AC1: the dataset has 4 themes with a name each', async () => {
    const themes = await createMockCatalogService({ latencyMs: 0 }).listThemes()
    expect(themes).toHaveLength(4)
    for (const t of themes) {
      expect(t.id).not.toBe('')
      expect(t.name).not.toBe('')
    }
    expect(new Set(themes.map((t) => t.id)).size).toBe(4)
  })

  it('AC1: themes come back in the order of the dataset, without their contents', async () => {
    const service = createMockCatalogService({ latencyMs: 0, themes: fixture })
    expect(await service.listThemes()).toEqual([
      { id: 'b', name: 'Beta' },
      { id: 'a', name: 'Alfa' },
      { id: 'v', name: 'Vuoto' },
    ])
  })

  it('AC5: each dataset theme has 6-8 contents with every domain field and a mockup photo', async () => {
    const service = createMockCatalogService({ latencyMs: 0 })
    for (const theme of await service.listThemes()) {
      const contents = await service.listThemeContents(theme.id)
      expect(contents.length).toBeGreaterThanOrEqual(6)
      expect(contents.length).toBeLessThanOrEqual(8)
      for (const c of contents) {
        expect(c.title).not.toBe('')
        expect(c.professional).not.toBe('')
        expect(c.role).not.toBe('')
        expect(c.durationMinutes).toBeGreaterThan(0)
        expect(c.coverUrl).toMatch(/^\/covers\/.+\.jpg$/)
        expect(c).not.toHaveProperty('episodes')
        expect(c).not.toHaveProperty('kind')
      }
    }
  })

  it('AC5: unique content ids across themes, photos reused in different combinations', async () => {
    const service = createMockCatalogService({ latencyMs: 0 })
    const all = (
      await Promise.all((await service.listThemes()).map((t) => service.listThemeContents(t.id)))
    ).flat()
    expect(new Set(all.map((c) => c.id)).size).toBe(all.length)
    expect(new Set(all.map((c) => c.coverUrl)).size).toBeLessThan(all.length)
  })

  it('AC1: contents of a theme keep the dataset order and belong to that theme only', async () => {
    const service = createMockCatalogService({ latencyMs: 0, themes: fixture })
    expect((await service.listThemeContents('a')).map((c) => c.id)).toEqual(['a1', 'a2'])
    expect((await service.listThemeContents('b')).map((c) => c.id)).toEqual(['b1'])
  })

  it('AC3: an empty theme and an unknown theme give an empty list', async () => {
    const service = createMockCatalogService({ latencyMs: 0, themes: fixture })
    expect(await service.listThemeContents('v')).toEqual([])
    expect(await service.listThemeContents('nope')).toEqual([])
  })

  it('accepts an injected empty dataset', async () => {
    const service = createMockCatalogService({ latencyMs: 0, themes: [] })
    expect(await service.listThemes()).toEqual([])
  })

  it('returns fresh arrays (callers cannot corrupt the dataset)', async () => {
    const service = createMockCatalogService({ latencyMs: 0, themes: fixture })
    ;(await service.listThemes()).pop()
    ;(await service.listThemeContents('a')).pop()
    expect(await service.listThemes()).toHaveLength(3)
    expect(await service.listThemeContents('a')).toHaveLength(2)
  })

  it('AC4: simulated failure rejects both calls with CatalogUnavailableError', async () => {
    const service = createMockCatalogService({ latencyMs: 0, fail: true })
    await expect(service.listThemes()).rejects.toBeInstanceOf(CatalogUnavailableError)
    await expect(service.listThemeContents('marketing')).rejects.toBeInstanceOf(
      CatalogUnavailableError,
    )
  })

  it('AC4: simulates latency on both calls', async () => {
    vi.useFakeTimers()
    try {
      const service = createMockCatalogService({ latencyMs: 500 })
      const themes = vi.fn()
      const contents = vi.fn()
      void service.listThemes().then(themes)
      void service.listThemeContents('marketing').then(contents)
      await vi.advanceTimersByTimeAsync(499)
      expect(themes).not.toHaveBeenCalled()
      expect(contents).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1)
      expect(themes).toHaveBeenCalledOnce()
      expect(contents).toHaveBeenCalledOnce()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('default catalog service: theme knobs', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  it('AC4: VITE_CATALOG_FAIL=true makes the theme calls fail too', async () => {
    vi.stubEnv('VITE_CATALOG_FAIL', 'true')
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', '0')
    const service = createDefaultCatalogService()
    await expect(service.listThemes()).rejects.toBeInstanceOf(CatalogUnavailableError)
    await expect(service.listThemeContents('marketing')).rejects.toBeInstanceOf(
      CatalogUnavailableError,
    )
  })

  it('AC4: VITE_CATALOG_LATENCY_MS delays listThemes', async () => {
    vi.useFakeTimers()
    vi.stubEnv('VITE_CATALOG_FAIL', undefined)
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', '2000')
    const done = vi.fn()
    void createDefaultCatalogService().listThemes().then(done)
    await vi.advanceTimersByTimeAsync(1999)
    expect(done).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(done).toHaveBeenCalledOnce()
  })
})

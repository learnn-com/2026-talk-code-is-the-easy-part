import { CatalogUnavailableError } from './catalog-service'
import { createMockCatalogService } from './mock-catalog-service'

describe('mock catalog service', () => {
  it('AC3: lists about 8 series, each with every domain field', async () => {
    const series = await createMockCatalogService({ latencyMs: 0 }).listSeries()
    expect(series).toHaveLength(8)
    for (const s of series) {
      expect(['course', 'webinar']).toContain(s.kind)
      expect(s.title).not.toBe('')
      expect(s.professional).not.toBe('')
      expect(s.role).not.toBe('')
      expect(s.durationMinutes).toBeGreaterThan(0)
      expect(s.episodes).toBeGreaterThan(0)
      expect(s.coverUrl).toMatch(/^\/covers\/.+\.jpg$/)
    }
  })

  it('AC3: has both kinds, unique ids, and reuses the mockup photos in different combinations', async () => {
    const series = await createMockCatalogService({ latencyMs: 0 }).listSeries()
    expect(new Set(series.map((s) => s.kind))).toEqual(new Set(['course', 'webinar']))
    expect(new Set(series.map((s) => s.id)).size).toBe(series.length)
    expect(new Set(series.map((s) => s.coverUrl)).size).toBeLessThan(series.length)
    expect(new Set(series.map((s) => s.title)).size).toBe(series.length)
  })

  it('simulates latency: not resolved before it elapses', async () => {
    vi.useFakeTimers()
    try {
      const done = vi.fn()
      void createMockCatalogService({ latencyMs: 500 }).listSeries().then(done)
      await vi.advanceTimersByTimeAsync(499)
      expect(done).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1)
      expect(done).toHaveBeenCalledOnce()
    } finally {
      vi.useRealTimers()
    }
  })

  it('AC5: simulated failure rejects with CatalogUnavailableError', async () => {
    const service = createMockCatalogService({ latencyMs: 0, fail: true })
    await expect(service.listSeries()).rejects.toBeInstanceOf(CatalogUnavailableError)
  })

  it('each call returns a fresh array (callers cannot corrupt the dataset)', async () => {
    const service = createMockCatalogService({ latencyMs: 0 })
    const first = await service.listSeries()
    first.pop()
    expect(await service.listSeries()).toHaveLength(8)
  })

  it('accepts an injected dataset (empty list included)', async () => {
    const service = createMockCatalogService({ latencyMs: 0, series: [] })
    expect(await service.listSeries()).toEqual([])
  })
})

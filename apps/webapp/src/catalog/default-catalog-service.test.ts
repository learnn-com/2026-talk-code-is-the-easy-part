import { CatalogUnavailableError } from './catalog-service'
import { createDefaultCatalogService } from './mock-catalog-service'

type Settled = { outcome: 'pending' | 'resolved' | 'rejected'; error?: unknown }

// Starts listSeries on the env-configured service; the returned object tracks its outcome.
function start(): Settled {
  const settled: Settled = { outcome: 'pending' }
  createDefaultCatalogService()
    .listSeries()
    .then(
      () => {
        settled.outcome = 'resolved'
      },
      (error: unknown) => {
        settled.outcome = 'rejected'
        settled.error = error
      },
    )
  return settled
}

async function expectDelay(ms: number) {
  const settled = start()
  await vi.advanceTimersByTimeAsync(ms - 1)
  expect(settled.outcome).toBe('pending')
  await vi.advanceTimersByTimeAsync(1)
  expect(settled.outcome).toBe('resolved')
}

describe('createDefaultCatalogService config knobs', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubEnv('VITE_CATALOG_FAIL', undefined)
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  it('AC5: VITE_CATALOG_FAIL=true rejects with CatalogUnavailableError', async () => {
    vi.stubEnv('VITE_CATALOG_FAIL', 'true')
    const settled = start()
    await vi.advanceTimersByTimeAsync(600)
    expect(settled.outcome).toBe('rejected')
    expect(settled.error).toBeInstanceOf(CatalogUnavailableError)
  })

  it('AC5: VITE_CATALOG_FAIL unset resolves the series', async () => {
    const settled = start()
    await vi.advanceTimersByTimeAsync(600)
    expect(settled.outcome).toBe('resolved')
  })

  it('AC5: VITE_CATALOG_FAIL=false resolves the series', async () => {
    vi.stubEnv('VITE_CATALOG_FAIL', 'false')
    const settled = start()
    await vi.advanceTimersByTimeAsync(600)
    expect(settled.outcome).toBe('resolved')
  })

  it('AC4: VITE_CATALOG_LATENCY_MS=2000 delays exactly 2000 ms', async () => {
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', '2000')
    await expectDelay(2000)
  })

  it('AC4: latency unset defaults to 600 ms', async () => {
    await expectDelay(600)
  })

  it.each(['abc', '-5', 'Infinity'])(
    'AC4: invalid VITE_CATALOG_LATENCY_MS=%s falls back to 600 ms',
    async (value) => {
      vi.stubEnv('VITE_CATALOG_LATENCY_MS', value)
      await expectDelay(600)
    },
  )

  it('AC4: VITE_CATALOG_LATENCY_MS=0 resolves with no delay', async () => {
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', '0')
    const settled = start()
    await vi.advanceTimersByTimeAsync(0)
    expect(settled.outcome).toBe('resolved')
  })

  it('AC4/AC5: VITE_CATALOG_FAIL=true keeps the configured latency before rejecting', async () => {
    vi.stubEnv('VITE_CATALOG_FAIL', 'true')
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', '2000')
    const settled = start()
    await vi.advanceTimersByTimeAsync(1999)
    expect(settled.outcome).toBe('pending')
    await vi.advanceTimersByTimeAsync(1)
    expect(settled.outcome).toBe('rejected')
    expect(settled.error).toBeInstanceOf(CatalogUnavailableError)
  })

  it('AC5: CatalogProvider default service honours the env knobs without a provider', async () => {
    vi.stubEnv('VITE_CATALOG_FAIL', 'true')
    vi.resetModules()
    const { renderHook } = await import('@testing-library/react')
    const { useCatalog } = await import('./catalog-provider')
    const { CatalogUnavailableError: FreshError } = await import('./catalog-service')
    const { result, unmount } = renderHook(() => useCatalog())
    let error: unknown
    let settled = false
    result.current.listSeries().catch((e: unknown) => {
      error = e
      settled = true
    })
    await vi.advanceTimersByTimeAsync(599)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(settled).toBe(true)
    expect(error).toBeInstanceOf(FreshError)
    unmount()
  })
})

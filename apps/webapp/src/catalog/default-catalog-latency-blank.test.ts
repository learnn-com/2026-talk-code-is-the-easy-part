import { CatalogUnavailableError } from './catalog-service'
import { createDefaultCatalogService } from './mock-catalog-service'

type Settled = { outcome: 'pending' | 'resolved' }

// Starts listSeries on the env-configured service; the returned object tracks its outcome.
function start(): Settled {
  const settled: Settled = { outcome: 'pending' }
  void createDefaultCatalogService()
    .listSeries()
    .then(() => {
      settled.outcome = 'resolved'
    })
  return settled
}

async function expectDelay(ms: number) {
  const settled = start()
  await vi.advanceTimersByTimeAsync(ms - 1)
  expect(settled.outcome).toBe('pending')
  await vi.advanceTimersByTimeAsync(1)
  expect(settled.outcome).toBe('resolved')
}

describe('VITE_CATALOG_LATENCY_MS blank handling (r0-2)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubEnv('VITE_CATALOG_FAIL', undefined)
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  it.each([
    ['empty', ''],
    ['spaces', '   '],
    ['tab and newline', '\t\n'],
  ])('AC4: %s value is treated as unset and falls back to 600 ms', async (_name, value) => {
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', value)
    await expectDelay(600)
  })

  it('AC4: VITE_CATALOG_LATENCY_MS=0 still resolves with no delay', async () => {
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', '0')
    const settled = start()
    await vi.advanceTimersByTimeAsync(0)
    expect(settled.outcome).toBe('resolved')
  })

  it('AC4: whitespace-padded valid value keeps its number', async () => {
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', ' 2000 ')
    await expectDelay(2000)
  })

  it.each(['abc', '-5'])('AC4: invalid value %s still falls back to 600 ms', async (value) => {
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', value)
    await expectDelay(600)
  })

  it('AC4/AC5: blank latency with VITE_CATALOG_FAIL=true rejects only after 600 ms', async () => {
    vi.stubEnv('VITE_CATALOG_FAIL', 'true')
    vi.stubEnv('VITE_CATALOG_LATENCY_MS', '')
    let error: unknown
    let settled = false
    createDefaultCatalogService()
      .listSeries()
      .catch((e: unknown) => {
        error = e
        settled = true
      })
    await vi.advanceTimersByTimeAsync(599)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(settled).toBe(true)
    expect(error).toBeInstanceOf(CatalogUnavailableError)
  })
})

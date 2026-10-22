import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { CatalogProvider } from './catalog-provider'
import { CatalogUnavailableError, type CatalogService, type Series } from './catalog-service'
import { useSeries } from './use-series'

const sample: Series = {
  id: 's1',
  kind: 'course',
  title: 'Funnel discovery',
  professional: 'Luca Mastella',
  role: 'Designer',
  durationMinutes: 80,
  episodes: 12,
  coverUrl: '/covers/x.jpg',
}

const wrap = (service: CatalogService) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <CatalogProvider service={service}>{children}</CatalogProvider>
  }

describe('useSeries', () => {
  it('AC4: starts loading, then exposes the series', async () => {
    const service: CatalogService = { listSeries: () => Promise.resolve([sample]) }
    const { result } = renderHook(() => useSeries(), { wrapper: wrap(service) })
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.series).toEqual([sample])
  })

  it('AC5: a failing service gives status error', async () => {
    const service: CatalogService = {
      listSeries: () => Promise.reject(new CatalogUnavailableError()),
    }
    const { result } = renderHook(() => useSeries(), { wrapper: wrap(service) })
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.series).toEqual([])
  })

  it('AC5: retry goes back to loading and reloads', async () => {
    const listSeries = vi
      .fn<CatalogService['listSeries']>()
      .mockRejectedValueOnce(new CatalogUnavailableError())
      .mockResolvedValueOnce([sample])
    const { result } = renderHook(() => useSeries(), { wrapper: wrap({ listSeries }) })
    await waitFor(() => expect(result.current.status).toBe('error'))
    act(() => result.current.retry())
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(listSeries).toHaveBeenCalledTimes(2)
    expect(result.current.series).toEqual([sample])
  })

  it('a stale response (after unmount) is ignored without errors', async () => {
    let resolve!: (value: Series[]) => void
    const service: CatalogService = {
      listSeries: () => new Promise<Series[]>((r) => (resolve = r)),
    }
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { unmount } = renderHook(() => useSeries(), { wrapper: wrap(service) })
    unmount()
    await act(async () => resolve([sample]))
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })

  it('a slow first response does not overwrite a newer retry result', async () => {
    const resolvers: Array<(v: Series[]) => void> = []
    const rejecters: Array<(e: unknown) => void> = []
    const service: CatalogService = {
      listSeries: () =>
        new Promise<Series[]>((res, rej) => {
          resolvers.push(res)
          rejecters.push(rej)
        }),
    }
    const { result } = renderHook(() => useSeries(), { wrapper: wrap(service) })
    act(() => result.current.retry())
    await act(async () => resolvers[1]([sample]))
    await act(async () => rejecters[0](new CatalogUnavailableError()))
    expect(result.current.status).toBe('success')
  })

  it('without a provider the default mock service is used', async () => {
    const { result } = renderHook(() => useSeries())
    expect(result.current.status).toBe('loading')
  })
})

import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { CatalogProvider } from './catalog-provider'
import {
  CatalogUnavailableError,
  type CatalogService,
  type SingleContent,
  type Theme,
} from './catalog-service'
import { useThemeSections } from './use-theme-sections'

const content = (id: string): SingleContent => ({
  id,
  title: `Titolo ${id}`,
  professional: 'Luca Mastella',
  role: 'Designer',
  durationMinutes: 30,
  coverUrl: '/covers/x.jpg',
})

const themes: Theme[] = [
  { id: 'b', name: 'Beta' },
  { id: 'v', name: 'Vuoto' },
  { id: 'a', name: 'Alfa' },
]
const byTheme: Record<string, SingleContent[]> = { b: [content('b1')], v: [], a: [content('a1')] }

const service = (over: Partial<CatalogService> = {}): CatalogService => ({
  listSeries: () => Promise.resolve([]),
  listThemes: () => Promise.resolve(themes),
  listThemeContents: (id) => Promise.resolve(byTheme[id] ?? []),
  ...over,
})

const wrap = (s: CatalogService) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <CatalogProvider service={s}>{children}</CatalogProvider>
  }

describe('useThemeSections', () => {
  it('AC4: starts loading with no sections', () => {
    const { result } = renderHook(() => useThemeSections(), {
      wrapper: wrap(service({ listThemes: () => new Promise(() => {}) })),
    })
    expect(result.current.status).toBe('loading')
    expect(result.current.sections).toEqual([])
  })

  it('AC1/AC3: exposes non-empty themes in service order, empty ones omitted', async () => {
    const { result } = renderHook(() => useThemeSections(), { wrapper: wrap(service()) })
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.sections).toEqual([
      { theme: themes[0], contents: [content('b1')] },
      { theme: themes[2], contents: [content('a1')] },
    ])
  })

  it('AC3: all themes empty gives success with no sections', async () => {
    const { result } = renderHook(() => useThemeSections(), {
      wrapper: wrap(service({ listThemeContents: () => Promise.resolve([]) })),
    })
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.sections).toEqual([])
  })

  it('AC3: no themes at all gives success with no sections', async () => {
    const { result } = renderHook(() => useThemeSections(), {
      wrapper: wrap(service({ listThemes: () => Promise.resolve([]) })),
    })
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.sections).toEqual([])
  })

  it('AC4: listThemes failing gives status error', async () => {
    const { result } = renderHook(() => useThemeSections(), {
      wrapper: wrap(service({ listThemes: () => Promise.reject(new CatalogUnavailableError()) })),
    })
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.sections).toEqual([])
  })

  it('AC4: one theme contents failing gives status error, no partial sections', async () => {
    const { result } = renderHook(() => useThemeSections(), {
      wrapper: wrap(
        service({
          listThemeContents: (id) =>
            id === 'a'
              ? Promise.reject(new CatalogUnavailableError())
              : Promise.resolve([content(id)]),
        }),
      ),
    })
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.sections).toEqual([])
  })

  it('AC4: retry goes back to loading and reloads', async () => {
    const listThemes = vi
      .fn<CatalogService['listThemes']>()
      .mockRejectedValueOnce(new CatalogUnavailableError())
      .mockResolvedValueOnce(themes)
    const { result } = renderHook(() => useThemeSections(), {
      wrapper: wrap(service({ listThemes })),
    })
    await waitFor(() => expect(result.current.status).toBe('error'))
    act(() => result.current.retry())
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(listThemes).toHaveBeenCalledTimes(2)
    expect(result.current.sections).toHaveLength(2)
  })

  it('a stale response (after unmount) is ignored without errors', async () => {
    let resolve!: (value: Theme[]) => void
    const { unmount } = renderHook(() => useThemeSections(), {
      wrapper: wrap(service({ listThemes: () => new Promise<Theme[]>((r) => (resolve = r)) })),
    })
    unmount()
    await act(async () => resolve(themes))
  })
})

import series from '../catalog/series.json'
import { createMockNotificationService } from './mock-notification-service'

const NOW = Date.parse('2026-10-22T12:00:00Z')

describe('mock notification service', () => {
  it('lists 3-5 notifications with title, text, past date and courseId', async () => {
    const list = await createMockNotificationService({ now: () => NOW }).list()
    expect(list.length).toBeGreaterThanOrEqual(3)
    expect(list.length).toBeLessThanOrEqual(5)
    for (const n of list) {
      expect(n.title).not.toBe('')
      expect(n.body).not.toBe('')
      expect(n.createdAt).toBeLessThan(NOW)
      expect(n.courseId).not.toBe('')
    }
  })

  it('has unique ids and cites contents of the mock catalog dataset', async () => {
    const list = await createMockNotificationService().list()
    const catalog = series.series
    expect(new Set(list.map((n) => n.id)).size).toBe(list.length)
    for (const n of list) {
      const content = catalog.find((s) => s.id === n.courseId)
      expect(content, n.courseId).toBeDefined()
      expect(n.body).toContain(content!.title)
    }
  })

  it('dates are relative to "now"', async () => {
    const a = await createMockNotificationService({ now: () => NOW }).list()
    const b = await createMockNotificationService({ now: () => NOW + 60_000 }).list()
    expect(b.map((n) => n.createdAt - 60_000)).toEqual(a.map((n) => n.createdAt))
  })

  it('every call returns a fresh list (mutations do not leak)', async () => {
    const service = createMockNotificationService()
    const first = await service.list()
    first.pop()
    first[0].title = 'changed'
    const second = await service.list()
    expect(second.length).toBeGreaterThan(first.length)
    expect(second[0].title).not.toBe('changed')
  })

  it('fail: rejects', async () => {
    await expect(createMockNotificationService({ fail: true }).list()).rejects.toThrow()
  })
})

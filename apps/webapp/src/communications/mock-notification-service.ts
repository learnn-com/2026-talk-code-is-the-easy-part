import type { AppNotification, NotificationService } from './notification-service'
import dataset from './notifications.json'

interface Seed extends Omit<AppNotification, 'createdAt'> {
  minutesAgo: number
}

interface Options {
  latencyMs?: number
  fail?: boolean
  now?: () => number
  seeds?: Seed[]
}

const SEEDS = (dataset as { notifications: Seed[] }).notifications

export function createMockNotificationService({
  latencyMs = 0,
  fail = false,
  now = Date.now,
  seeds = SEEDS,
}: Options = {}): NotificationService {
  return {
    async list() {
      await new Promise((resolve) => setTimeout(resolve, latencyMs))
      if (fail) throw new Error('Notifiche non disponibili')
      const at = now()
      return seeds.map(({ minutesAgo, ...rest }) => ({
        ...rest,
        createdAt: at - minutesAgo * 60_000,
      }))
    },
  }
}

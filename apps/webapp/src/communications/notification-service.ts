export interface AppNotification {
  id: string
  title: string
  body: string
  /** Epoch ms. */
  createdAt: number
  /** Reserved for the future deep link; not used by the UI. */
  courseId: string
}

export interface NotificationService {
  list(): Promise<AppNotification[]>
}

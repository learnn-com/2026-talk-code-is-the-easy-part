// jsdom never loads images: Radix Avatar needs a load/error event to leave its fallback.
export function stubImageLoading(outcome: 'load' | 'error') {
  class FakeImage {
    referrerPolicy = ''
    crossOrigin: string | null = null
    complete = false
    naturalWidth = 0
    private listeners: Record<string, Array<(event: unknown) => void>> = {}
    addEventListener(type: string, listener: (event: unknown) => void) {
      ;(this.listeners[type] ??= []).push(listener)
    }
    removeEventListener(type: string, listener: (event: unknown) => void) {
      this.listeners[type] = (this.listeners[type] ?? []).filter((l) => l !== listener)
    }
    set src(_value: string) {
      queueMicrotask(() => {
        this.complete = true
        this.naturalWidth = outcome === 'load' ? 1 : 0
        this.listeners[outcome]?.forEach((l) => l({ currentTarget: this }))
      })
    }
  }
  vi.stubGlobal('Image', FakeImage)
}

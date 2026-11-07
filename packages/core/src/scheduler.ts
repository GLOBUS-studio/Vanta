type Tick = (now: number) => void

/**
 * One RAF loop for every effect on the page.
 * The loop stops completely when the tab is hidden or no effects remain.
 */
export class FrameScheduler {
  private readonly ticks = new Set<Tick>()
  private raf = 0
  private running = false
  private visible = true

  constructor() {
    if (typeof document !== 'undefined') {
      this.visible = !document.hidden
      document.addEventListener('visibilitychange', this.onVisibilityChange, { passive: true })
    }
  }

  add(tick: Tick): void {
    this.ticks.add(tick)
    this.start()
  }

  remove(tick: Tick): void {
    this.ticks.delete(tick)
    if (this.ticks.size === 0) this.stop()
  }

  private readonly onVisibilityChange = (): void => {
    this.visible = !document.hidden
    if (this.visible) this.start()
    else this.stop()
  }

  private start(): void {
    if (this.running || !this.visible || this.ticks.size === 0) return
    this.running = true
    this.raf = requestAnimationFrame(this.loop)
  }

  private stop(): void {
    if (!this.running) return
    this.running = false
    cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  private readonly loop = (now: number): void => {
    if (!this.running) return
    for (const tick of [...this.ticks]) {
      try {
        tick(now)
      } catch (error) {
        console.error('[VantaJS2] frame error', error)
      }
    }
    if (this.running) this.raf = requestAnimationFrame(this.loop)
  }

  destroy(): void {
    this.stop()
    this.ticks.clear()
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange)
    }
  }
}

let shared: FrameScheduler | undefined

export function getScheduler(): FrameScheduler {
  return (shared ??= new FrameScheduler())
}

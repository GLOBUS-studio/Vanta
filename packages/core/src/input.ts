export interface PointerTarget {
  handlePointerMove(clientX: number, clientY: number): void
  handlePointerLeave(): void
  invalidatePointerRect(): void
}

/**
 * A single passive pointer listener for the whole page.
 * Individual effects only receive events while the pointer is inside their box.
 */
export class PointerManager {
  private readonly targets = new Set<PointerTarget>()
  private listening = false

  add(target: PointerTarget): void {
    this.targets.add(target)
    this.start()
  }

  remove(target: PointerTarget): void {
    this.targets.delete(target)
    if (this.targets.size === 0) this.stop()
  }

  private start(): void {
    if (this.listening || typeof document === 'undefined') return
    this.listening = true
    document.addEventListener('pointermove', this.onPointerMove, { passive: true })
    document.addEventListener('pointerdown', this.onPointerMove, { passive: true })
    document.addEventListener('pointerleave', this.onPointerLeave, { passive: true })
    window.addEventListener('blur', this.onPointerLeave, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onScroll, { passive: true })
  }

  private stop(): void {
    if (!this.listening) return
    this.listening = false
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerdown', this.onPointerMove)
    document.removeEventListener('pointerleave', this.onPointerLeave)
    window.removeEventListener('blur', this.onPointerLeave)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onScroll)
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    for (const target of this.targets) {
      target.handlePointerMove(event.clientX, event.clientY)
    }
  }

  private readonly onPointerLeave = (): void => {
    for (const target of this.targets) target.handlePointerLeave()
  }

  private readonly onScroll = (): void => {
    for (const target of this.targets) target.invalidatePointerRect()
  }
}

let shared: PointerManager | undefined

export function getPointerManager(): PointerManager {
  return (shared ??= new PointerManager())
}

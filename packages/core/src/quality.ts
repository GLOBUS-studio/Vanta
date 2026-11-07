/**
 * Conservative adaptive quality. It only reacts to sustained low frame rates,
 * never to a single long frame (tab switch, GC, layout).
 */
export class QualityController {
  private level: number
  private lowFrames = 0
  private highFrames = 0
  private samples = 0
  private enabled: boolean

  constructor(initial: number, enabled: boolean) {
    this.level = clamp(initial, 0.5, 1)
    this.enabled = enabled
  }

  get value(): number {
    return this.level
  }

  setLevel(value: number): void {
    this.level = clamp(value, 0.5, 1)
    this.lowFrames = 0
    this.highFrames = 0
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    this.lowFrames = 0
    this.highFrames = 0
  }

  /** Returns a new level when it changes, otherwise null. */
  sample(deltaSeconds: number): number | null {
    if (!this.enabled) return null
    this.samples++
    // Ignore startup and one-off hitches.
    if (this.samples < 90) return null

    const deltaMs = deltaSeconds * 1000
    if (deltaMs > 26) {
      this.lowFrames++
      this.highFrames = 0
    } else if (deltaMs < 18) {
      this.highFrames++
      this.lowFrames = 0
    } else {
      this.lowFrames = 0
      this.highFrames = 0
    }

    if (this.lowFrames >= 30 && this.level > 0.5) {
      this.level = Math.max(0.5, this.level - 0.15)
      this.lowFrames = 0
      return this.level
    }

    // Upgrade slowly, only after a long stable period.
    if (this.highFrames >= 240 && this.level < 1) {
      this.level = Math.min(1, this.level + 0.1)
      this.highFrames = 0
      return this.level
    }

    return null
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export interface Size {
  width: number
  height: number
  dpr: number
}

export interface Pointer {
  /** Pointer X in CSS pixels, relative to the container. */
  x: number
  /** Pointer Y in CSS pixels, relative to the container. */
  y: number
  /** Normalized X in the 0..1 range. */
  nx: number
  /** Normalized Y in the 0..1 range. */
  ny: number
  /** Whether the pointer is currently inside the container. */
  active: boolean
}

export interface FrameInfo {
  /** Effect time in seconds, already scaled by the `speed` option. */
  time: number
  /** Clamped delta in seconds since the previous rendered frame. */
  delta: number
  /** Wall-clock seconds since the effect started. */
  elapsed: number
  pointer: Readonly<Pointer>
  size: Readonly<Size>
  /** Current quality multiplier in the 0.5..1 range. */
  quality: number
}

export interface Stats {
  fps: number
  frameTime: number
  quality: number
  dpr: number
  frames: number
  visible: boolean
  paused: boolean
}

export interface CommonOptions {
  /** A selector or an element. The canvas is inserted as its first child. */
  el: string | HTMLElement
  /** Reuse an existing canvas instead of creating one. Init-only. */
  canvas?: HTMLCanvasElement
  /** Explicit device pixel ratio. Defaults to the device value, capped by maxPixelRatio. */
  pixelRatio?: number
  /** Upper bound for devicePixelRatio. Defaults to 2. */
  maxPixelRatio?: number
  minWidth?: number
  minHeight?: number
  /** Enable pointer input. Defaults to true. */
  mouseControls?: boolean
  /** Enable device orientation input. Defaults to false. */
  gyroControls?: boolean
  /** Animation speed multiplier. Defaults to 1. */
  speed?: number
  /** Limit rendering to N frames per second. 0 means vsync. Defaults to 0. */
  fpsCap?: number
  /** Pause when the container leaves the viewport. Defaults to true. */
  autoPause?: boolean
  /** Respect prefers-reduced-motion. Defaults to "respect". */
  reducedMotion?: 'respect' | 'ignore'
  /** CSS background used when WebGL2 is unavailable or setup fails. */
  fallback?: string | null
  /** Raise static children above the canvas (legacy-friendly). Defaults to true. Init-only. */
  raiseContent?: boolean
  className?: string
  zIndex?: number
  /** Initial quality multiplier. Adaptive quality may lower it. Defaults to 1. */
  quality?: number
  /** Allow the runtime to lower quality under load. Defaults to true. */
  adaptiveQuality?: boolean
}

export type EffectOptions<D extends object> = Partial<D> & CommonOptions
export type ResolvedOptions<D extends object> = CommonOptions & D

export interface EffectHost {
  readonly canvas: HTMLCanvasElement
  readonly container: HTMLElement
  readonly size: Readonly<Size>
  readonly quality: number
  readonly reducedMotion: boolean
  requestRender(): void
  onResize(listener: (size: Size) => void): () => void
  onQualityChange(listener: (quality: number) => void): () => void
  onPointerMove(listener: (pointer: Pointer) => void): () => void
}

export interface EffectInstance<D extends object> {
  /** Called once per rendered frame. */
  render(frame: FrameInfo): void
  /** Called when the container size or DPR changes. */
  resize?(size: Size): void
  /** Called when options change. The instance may ignore options it cannot update live. */
  setOptions?(options: Readonly<ResolvedOptions<D>>): void
  /** Called when adaptive quality changes the quality multiplier. */
  onQualityChange?(quality: number): void
  /** Release every GPU and DOM resource owned by the effect. */
  dispose(): void
}

export interface EffectDefinition<D extends object> {
  readonly name: string
  readonly defaults: D
  setup(host: EffectHost, options: Readonly<ResolvedOptions<D>>): EffectInstance<D>
}

export interface EffectEventMap<D extends object> {
  ready: EffectHandle<D>
  options: Readonly<ResolvedOptions<D>>
  resize: Readonly<Size>
  pause: undefined
  resume: undefined
  destroy: undefined
  error: Error
  unsupported: { reason: string }
  contextlost: Event
  contextrestored: Event
  qualitychange: number
}

export interface EffectHandle<D extends object> {
  readonly name: string
  readonly el: HTMLElement
  readonly canvas: HTMLCanvasElement
  readonly supported: boolean
  readonly error: Error | null
  readonly options: Readonly<ResolvedOptions<D>>
  readonly stats: Readonly<Stats>
  readonly ready: Promise<EffectHandle<D>>
  setOptions(options: Partial<ResolvedOptions<D>>): void
  pause(): void
  resume(): void
  resize(): void
  destroy(): void
  on<K extends keyof EffectEventMap<D>>(
    event: K,
    listener: (payload: EffectEventMap<D>[K]) => void,
  ): () => void
}

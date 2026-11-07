import { Emitter } from './emitter.js'
import { getPointerManager, type PointerTarget } from './input.js'
import { QualityController, clamp } from './quality.js'
import { getScheduler } from './scheduler.js'
import { resolveElement, setupDom, supportsWebGL2, type DomController } from './dom.js'
import type {
  CommonOptions,
  EffectDefinition,
  EffectEventMap,
  EffectHandle,
  EffectHost,
  EffectInstance,
  EffectOptions,
  FrameInfo,
  Pointer,
  ResolvedOptions,
  Size,
  Stats,
} from './types.js'

const COMMON_DEFAULTS: Omit<CommonOptions, 'el'> = {
  pixelRatio: undefined,
  maxPixelRatio: 2,
  minWidth: 0,
  minHeight: 0,
  mouseControls: true,
  gyroControls: false,
  speed: 1,
  fpsCap: 0,
  autoPause: true,
  reducedMotion: 'respect',
  fallback: '#05070a',
  raiseContent: true,
  zIndex: 0,
  quality: 1,
  adaptiveQuality: true,
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function resolveOptions<D extends object>(
  defaults: D,
  userOptions: EffectOptions<D>,
): ResolvedOptions<D> {
  return {
    ...COMMON_DEFAULTS,
    ...defaults,
    ...userOptions,
  } as ResolvedOptions<D>
}

function asError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

export class VantaEffect<D extends object> implements EffectHandle<D>, EffectHost, PointerTarget {
  readonly name: string
  readonly el: HTMLElement
  readonly canvas: HTMLCanvasElement
  options: ResolvedOptions<D>
  readonly stats: Stats
  readonly ready: Promise<this> = Promise.resolve(this)

  supported = true
  error: Error | null = null

  private readonly definition: EffectDefinition<D>
  private readonly dom: DomController
  private readonly scheduler = getScheduler()
  private readonly pointers = getPointerManager()
  private readonly emitter = new Emitter<EffectEventMap<D>>()
  private readonly qualityController: QualityController
  private readonly resizeListeners = new Set<(size: Size) => void>()
  private readonly pointerListeners = new Set<(pointer: Pointer) => void>()
  private readonly qualityListeners = new Set<(quality: number) => void>()

  private instance: EffectInstance<D> | null = null
  private width = 1
  private height = 1
  private dpr = 1
  private pointer: Pointer = { x: 0, y: 0, nx: 0.5, ny: 0.5, active: false }
  private visible = true
  private userPaused = false
  private disposed = false
  private dirty = true
  private attached = false
  private lastFrameAt = 0
  private elapsed = 0
  private time = 0
  private fpsEma = 0
  private frameTimeEma = 0
  private rect: DOMRect | null = null
  private resizeRaf = 0
  private ro: ResizeObserver | null = null
  private io: IntersectionObserver | null = null
  private mediaQuery: MediaQueryList | null = null
  private reducedMotionActive = false
  private gyroAttached = false
  private contextLost = false

  constructor(definition: EffectDefinition<D>, userOptions: EffectOptions<D>) {
    if (!isBrowser()) {
      throw new Error('[VantaJS2] Effects can only be created in a browser environment')
    }
    if (!userOptions || userOptions.el == null) {
      throw new Error('[VantaJS2] The "el" option is required')
    }

    this.definition = definition
    this.name = definition.name
    this.el = resolveElement(userOptions.el)
    this.options = resolveOptions(definition.defaults, userOptions)
    this.qualityController = new QualityController(
      this.options.quality ?? 1,
      this.options.adaptiveQuality !== false,
    )
    this.dom = setupDom(this.el, this.options)
    this.canvas = this.dom.canvas
    this.stats = {
      fps: 0,
      frameTime: 0,
      quality: this.qualityController.value,
      dpr: 1,
      frames: 0,
      visible: true,
      paused: false,
    }

    this.measure()
    this.dom.setBuffer(this.width, this.height, this.dpr)
    this.pointer = {
      x: this.width / 2,
      y: this.height / 2,
      nx: 0.5,
      ny: 0.5,
      active: false,
    }

    this.mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null
    this.reducedMotionActive =
      this.options.reducedMotion !== 'ignore' && Boolean(this.mediaQuery?.matches)

    if (!supportsWebGL2()) {
      this.supported = false
      this.dom.applyFallback(this.options.fallback ?? '#05070a')
      this.stats.paused = true
      this.emitter.emit('unsupported', { reason: 'WebGL2 is not available' })
      this.emitReady()
      return
    }

    try {
      this.instance = definition.setup(this, this.options)
    } catch (value) {
      this.supported = false
      this.error = asError(value)
      this.dom.applyFallback(this.options.fallback ?? '#05070a')
      this.stats.paused = true
      this.emitter.emit('error', this.error)
      this.emitReady()
      return
    }

    this.renderFrame(performance.now(), true)
    this.setupObservers()
    this.updateScheduler()
    this.emitReady()
  }

  // ---- EffectHost -------------------------------------------------------

  get size(): Readonly<Size> {
    return { width: this.width, height: this.height, dpr: this.dpr }
  }

  get quality(): number {
    return this.qualityController.value
  }

  get container(): HTMLElement {
    return this.el
  }

  get reducedMotion(): boolean {
    return this.reducedMotionActive
  }

  requestRender(): void {
    if (this.disposed) return
    this.dirty = true
    if (this.reducedMotionActive && !this.userPaused) {
      this.renderFrame(performance.now(), true)
      return
    }
    if (!this.attached) this.updateScheduler()
  }

  onResize(listener: (size: Size) => void): () => void {
    this.resizeListeners.add(listener)
    return () => this.resizeListeners.delete(listener)
  }

  onQualityChange(listener: (quality: number) => void): () => void {
    this.qualityListeners.add(listener)
    return () => this.qualityListeners.delete(listener)
  }

  onPointerMove(listener: (pointer: Pointer) => void): () => void {
    this.pointerListeners.add(listener)
    return () => this.pointerListeners.delete(listener)
  }

  // ---- Public API -------------------------------------------------------

  setOptions(options: Partial<ResolvedOptions<D>>): void {
    if (this.disposed) return
    if (options.el != null && resolveElement(options.el) !== this.el) {
      throw new Error('[VantaJS2] The "el" option cannot be changed after creation')
    }

    const previous = this.options
    const next = { ...previous, ...options } as ResolvedOptions<D>
    this.options = next

    if (next.className !== previous.className) {
      if (previous.className) this.canvas.classList.remove(previous.className)
      if (next.className) this.canvas.classList.add(next.className)
    }
    this.dom.updateCanvasStyle(next)

    if (next.quality !== previous.quality) {
      this.qualityController.setLevel(next.quality ?? 1)
      const quality = this.qualityController.value
      this.stats.quality = quality
      try {
        this.instance?.onQualityChange?.(quality)
      } catch (value) {
        this.fail(asError(value))
      }
      this.emitter.emit('qualitychange', quality)
    }
    if (next.adaptiveQuality !== previous.adaptiveQuality) {
      this.qualityController.setEnabled(next.adaptiveQuality !== false)
    }
    if (
      next.pixelRatio !== previous.pixelRatio ||
      next.maxPixelRatio !== previous.maxPixelRatio ||
      next.minWidth !== previous.minWidth ||
      next.minHeight !== previous.minHeight ||
      next.quality !== previous.quality ||
      next.adaptiveQuality !== previous.adaptiveQuality
    ) {
      this.applySize()
    }

    if (next.reducedMotion !== previous.reducedMotion) this.updateReducedMotion()
    if (next.mouseControls !== previous.mouseControls) {
      if (next.mouseControls) this.pointers.add(this)
      else {
        this.pointers.remove(this)
        this.handlePointerLeave()
      }
    }
    if (next.gyroControls !== previous.gyroControls) this.updateGyro()
    if (next.fpsCap !== previous.fpsCap) this.lastFrameAt = 0
    if (next.fallback !== previous.fallback && !this.supported) {
      this.dom.applyFallback(next.fallback ?? '#05070a')
    }

    try {
      this.instance?.setOptions?.(next)
    } catch (value) {
      this.fail(asError(value))
    }

    this.emitter.emit('options', next)
    this.updateScheduler()
    this.requestRender()
  }

  pause(): void {
    if (this.disposed || this.userPaused) return
    this.userPaused = true
    this.stats.paused = true
    this.updateScheduler()
    this.emitter.emit('pause', undefined)
  }

  resume(): void {
    if (this.disposed || !this.userPaused) return
    this.userPaused = false
    this.lastFrameAt = 0
    this.updateScheduler()
    this.emitter.emit('resume', undefined)
  }

  resize(): void {
    this.applySize()
  }

  destroy(): void {
    if (this.disposed) return
    this.disposed = true
    if (this.attached) {
      this.scheduler.remove(this.tick)
      this.attached = false
    }
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf)
    this.ro?.disconnect()
    this.io?.disconnect()
    this.ro = null
    this.io = null

    window.removeEventListener('resize', this.onWindowResize)
    this.mediaQuery?.removeEventListener('change', this.onMediaChange)
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored)
    this.pointers.remove(this)
    this.detachGyro()

    try {
      this.instance?.dispose()
    } catch (value) {
      console.error('[VantaJS2] dispose error', value)
    }
    this.instance = null
    this.dom.destroy()
    this.resizeListeners.clear()
    this.pointerListeners.clear()
    this.qualityListeners.clear()
    this.stats.paused = true
    this.emitter.emit('destroy', undefined)
    this.emitter.clear()
  }

  on<K extends keyof EffectEventMap<D>>(
    event: K,
    listener: (payload: EffectEventMap<D>[K]) => void,
  ): () => void {
    return this.emitter.on(event, listener)
  }

  // ---- Internal ---------------------------------------------------------

  private emitReady(): void {
    queueMicrotask(() => {
      if (!this.disposed) this.emitter.emit('ready', this)
    })
  }

  private measure(): void {
    const { width, height } = this.dom.measure()
    this.width = width
    this.height = height
    const base =
      this.options.pixelRatio ??
      Math.min(window.devicePixelRatio || 1, this.options.maxPixelRatio ?? 2)
    this.dpr = clamp(base * this.qualityController.value, 0.5, 4)
  }

  private applySize(): void {
    if (this.disposed) return
    const previousWidth = this.width
    const previousHeight = this.height
    const previousDpr = this.dpr
    this.measure()
    if (
      previousWidth === this.width &&
      previousHeight === this.height &&
      previousDpr === this.dpr
    ) {
      this.dirty = true
      return
    }

    this.dom.setBuffer(this.width, this.height, this.dpr)
    const size: Size = { width: this.width, height: this.height, dpr: this.dpr }
    this.stats.dpr = this.dpr
    this.stats.quality = this.qualityController.value

    if (!this.pointer.active) {
      this.pointer = {
        x: this.width / 2,
        y: this.height / 2,
        nx: 0.5,
        ny: 0.5,
        active: false,
      }
    }

    try {
      this.instance?.resize?.(size)
    } catch (value) {
      this.fail(asError(value))
      return
    }
    for (const listener of this.resizeListeners) listener(size)
    this.emitter.emit('resize', size)
    this.dirty = true
    this.requestRender()
  }

  private scheduleResize(): void {
    if (this.resizeRaf || this.disposed) return
    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeRaf = 0
      this.applySize()
    })
  }

  private readonly onWindowResize = (): void => this.scheduleResize()
  private readonly onMediaChange = (): void => this.updateReducedMotion()

  private setupObservers(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.scheduleResize())
      this.ro.observe(this.el)
    }
    if (typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1]
          if (!entry) return
          const wasVisible = this.visible
          this.visible = entry.isIntersecting
          this.stats.visible = this.visible
          if (!wasVisible && this.visible) this.lastFrameAt = 0
          this.updateScheduler()
        },
        { rootMargin: '200px 0px' },
      )
      this.io.observe(this.el)
    }
    window.addEventListener('resize', this.onWindowResize, { passive: true })
    this.mediaQuery?.addEventListener('change', this.onMediaChange)
    this.canvas.addEventListener('webglcontextlost', this.onContextLost, false)
    this.canvas.addEventListener('webglcontextrestored', this.onContextRestored, false)
    if (this.options.mouseControls !== false) this.pointers.add(this)
    this.updateGyro()
  }

  private readonly onContextLost = (event: Event): void => {
    if (this.disposed) return
    event.preventDefault()
    this.contextLost = true
    this.stats.paused = true
    this.updateScheduler()
    this.emitter.emit('contextlost', event)
  }

  private readonly onContextRestored = (event: Event): void => {
    if (this.disposed) return
    this.contextLost = false
    this.lastFrameAt = 0
    this.dirty = true
    this.updateScheduler()
    this.emitter.emit('contextrestored', event)
  }

  private updateReducedMotion(): void {
    const next = this.options.reducedMotion !== 'ignore' && Boolean(this.mediaQuery?.matches)
    if (next === this.reducedMotionActive) return
    this.reducedMotionActive = next
    if (next) {
      this.dirty = true
      this.renderFrame(performance.now(), true)
    } else {
      this.lastFrameAt = 0
      this.dirty = true
    }
    this.updateScheduler()
  }

  private updateGyro(): void {
    if (this.options.gyroControls && !this.gyroAttached) {
      window.addEventListener('deviceorientation', this.onDeviceOrientation, { passive: true })
      this.gyroAttached = true
    } else if (!this.options.gyroControls && this.gyroAttached) {
      this.detachGyro()
    }
  }

  private detachGyro(): void {
    if (!this.gyroAttached) return
    window.removeEventListener('deviceorientation', this.onDeviceOrientation)
    this.gyroAttached = false
  }

  private readonly onDeviceOrientation = (event: DeviceOrientationEvent): void => {
    if (!this.options.mouseControls || this.disposed) return
    const alpha = event.alpha ?? 0
    const beta = event.beta ?? 0
    const x = (((alpha + 180) % 360) / 360) * this.width
    const y = clamp((beta + 90) / 180, 0, 1) * this.height
    this.setPointer(x, y, true)
  }

  private shouldAnimate(): boolean {
    if (this.disposed || !this.supported || this.userPaused || this.contextLost) return false
    if (this.reducedMotionActive) return false
    if (this.options.autoPause !== false && !this.visible) return false
    return true
  }

  private updateScheduler(): void {
    const should = this.shouldAnimate()
    if (should && !this.attached) {
      this.scheduler.add(this.tick)
      this.attached = true
    } else if (!should && this.attached) {
      this.scheduler.remove(this.tick)
      this.attached = false
    }
    this.stats.paused = !should
  }

  private readonly tick = (now: number): void => {
    if (!this.shouldAnimate()) return
    const cap = this.options.fpsCap ?? 0
    if (cap > 0 && this.lastFrameAt > 0 && now - this.lastFrameAt < 1000 / cap - 0.5) {
      return
    }
    this.renderFrame(now)
  }

  private renderFrame(now: number, force = false): void {
    if (this.disposed || !this.instance) return
    const delta = force || !this.lastFrameAt ? 0 : Math.min((now - this.lastFrameAt) / 1000, 0.1)
    this.lastFrameAt = now
    this.dirty = false
    this.elapsed += delta
    this.time += delta * (this.options.speed ?? 1)

    const size: Size = { width: this.width, height: this.height, dpr: this.dpr }
    const pointer: Pointer = { ...this.pointer }
    const frame: FrameInfo = {
      time: this.time,
      delta,
      elapsed: this.elapsed,
      pointer,
      size,
      quality: this.qualityController.value,
    }

    const started = performance.now()
    try {
      this.instance.render(frame)
    } catch (value) {
      this.fail(asError(value))
      return
    }
    const frameTime = performance.now() - started

    if (delta > 0) {
      const fps = clamp(1 / delta, 0, 240)
      this.fpsEma = this.fpsEma ? this.fpsEma * 0.9 + fps * 0.1 : fps
      this.frameTimeEma = this.frameTimeEma ? this.frameTimeEma * 0.9 + frameTime * 0.1 : frameTime
      // A deliberate fps cap must not look like a performance problem.
      const capped = (this.options.fpsCap ?? 0) > 0
      const nextQuality = capped ? null : this.qualityController.sample(delta)
      if (nextQuality !== null) this.handleQualityChange(nextQuality)
    }

    this.stats.fps = Math.round(this.fpsEma)
    this.stats.frameTime = Math.round(this.frameTimeEma * 100) / 100
    this.stats.quality = this.qualityController.value
    this.stats.dpr = this.dpr
    this.stats.frames++
    this.stats.visible = this.visible
    this.stats.paused = !this.shouldAnimate()

    if (this.dirty) this.requestRender()
  }

  private handleQualityChange(quality: number): void {
    this.stats.quality = quality
    for (const listener of this.qualityListeners) listener(quality)
    try {
      this.instance?.onQualityChange?.(quality)
    } catch (value) {
      this.fail(asError(value))
      return
    }
    this.emitter.emit('qualitychange', quality)
    this.applySize()
    this.requestRender()
  }

  private fail(error: Error): void {
    this.error = error
    console.error(`[VantaJS2] ${this.name}`, error)
    this.userPaused = true
    this.stats.paused = true
    this.updateScheduler()
    this.emitter.emit('error', error)
  }

  // ---- PointerTarget ----------------------------------------------------

  handlePointerMove(clientX: number, clientY: number): void {
    if (this.disposed || !this.options.mouseControls) return
    const rect = this.rect ?? (this.rect = this.el.getBoundingClientRect())
    const x = clientX - rect.left
    const y = clientY - rect.top
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      this.handlePointerLeave()
      return
    }
    this.setPointer(x, y, true)
  }

  handlePointerLeave(): void {
    if (!this.pointer.active) return
    this.pointer = { ...this.pointer, active: false }
    for (const listener of this.pointerListeners) listener(this.pointer)
    this.requestRender()
  }

  invalidatePointerRect(): void {
    this.rect = null
  }

  private setPointer(x: number, y: number, active: boolean): void {
    this.pointer = {
      x,
      y,
      nx: x / Math.max(this.width, 1),
      ny: y / Math.max(this.height, 1),
      active,
    }
    for (const listener of this.pointerListeners) listener(this.pointer)
    this.requestRender()
  }
}

export function createEffect<D extends object>(
  definition: EffectDefinition<D>,
  options: EffectOptions<D>,
): EffectHandle<D> {
  return new VantaEffect(definition, options)
}

export function defineEffect<D extends object>(
  definition: EffectDefinition<D>,
): EffectDefinition<D> {
  if (!definition.name) throw new Error('[VantaJS2] An effect needs a name')
  return Object.freeze(definition)
}

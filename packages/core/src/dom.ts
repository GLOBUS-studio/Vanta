import type { CommonOptions } from './types.js'

export interface DomController {
  readonly canvas: HTMLCanvasElement
  measure(): { width: number; height: number }
  setBuffer(width: number, height: number, dpr: number): void
  applyFallback(background: string | null): void
  updateCanvasStyle(options: CommonOptions): void
  destroy(): void
}

interface SavedStyle {
  node: HTMLElement
  position: string
  zIndex: string
}

export function resolveElement(el: string | HTMLElement): HTMLElement {
  if (typeof el === 'string') {
    const node = document.querySelector(el)
    if (!node) throw new Error(`[VantaJS2] Cannot find element: ${el}`)
    if (!(node instanceof HTMLElement)) {
      throw new Error(`[VantaJS2] Element is not an HTMLElement: ${el}`)
    }
    return node
  }
  if (el instanceof HTMLElement) return el
  throw new Error('[VantaJS2] The "el" option must be a selector or an HTMLElement')
}

export function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    // Do not keep a context alive just for feature detection.
    gl.getExtension?.('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export function setupDom(container: HTMLElement, options: CommonOptions): DomController {
  const ownsCanvas = !options.canvas
  const canvas = options.canvas ?? document.createElement('canvas')
  canvas.classList.add('vantajs2-canvas')
  if (options.className) canvas.classList.add(options.className)
  canvas.setAttribute('aria-hidden', 'true')
  canvas.dataset.vantajs2 = 'canvas'

  const appended = canvas.parentElement !== container
  if (appended) container.prepend(canvas)

  const savedContainerPosition = container.style.position
  const containerPosition = getComputedStyle(container).position
  if (containerPosition === 'static' || containerPosition === '') {
    container.style.position = 'relative'
  }

  const savedStyles: SavedStyle[] = []
  if (options.raiseContent !== false) {
    for (const child of Array.from(container.children)) {
      if (!(child instanceof HTMLElement) || child === canvas) continue
      const computed = getComputedStyle(child)
      const position = child.style.position
      const zIndex = child.style.zIndex
      let changed = false
      if (computed.position === 'static' || computed.position === '') {
        child.style.position = 'relative'
        changed = true
      }
      if (computed.zIndex === 'auto' || computed.zIndex === '') {
        child.style.zIndex = '1'
        changed = true
      }
      if (changed) savedStyles.push({ node: child, position, zIndex })
    }
  }

  let previousBackground = container.style.background
  let fallbackApplied = false

  const updateCanvasStyle = (next: CommonOptions): void => {
    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'block',
      pointerEvents: 'none',
      background: 'transparent',
      zIndex: String(next.zIndex ?? 0),
    })
  }
  updateCanvasStyle(options)

  return {
    canvas,

    measure() {
      const rect = container.getBoundingClientRect()
      return {
        width: Math.max(rect.width, options.minWidth ?? 0, 1),
        height: Math.max(rect.height, options.minHeight ?? 0, 1),
      }
    },

    setBuffer(width, height, dpr) {
      const bufferWidth = Math.max(1, Math.round(width * dpr))
      const bufferHeight = Math.max(1, Math.round(height * dpr))
      if (canvas.width !== bufferWidth) canvas.width = bufferWidth
      if (canvas.height !== bufferHeight) canvas.height = bufferHeight
      canvas.style.width = '100%'
      canvas.style.height = '100%'
    },

    applyFallback(background) {
      if (background === null) return
      if (!fallbackApplied) {
        previousBackground = container.style.background
        fallbackApplied = true
      }
      container.style.background = background
    },

    updateCanvasStyle,

    destroy() {
      if (ownsCanvas || appended) canvas.remove()
      if (fallbackApplied) container.style.background = previousBackground
      container.style.position = savedContainerPosition
      for (const saved of savedStyles) {
        saved.node.style.position = saved.position
        saved.node.style.zIndex = saved.zIndex
      }
    },
  }
}

import * as THREE from 'three'

export interface Size {
  width: number
  height: number
  dpr: number
}

export interface CanvasHost {
  readonly canvas: HTMLCanvasElement
  readonly size: Readonly<Size>
}

export interface ThreeLayerOptions {
  alpha?: boolean
  antialias?: boolean
  powerPreference?: WebGLPowerPreference
  preserveDrawingBuffer?: boolean
  clearColor?: THREE.ColorRepresentation
  clearAlpha?: number
  onContextLost?: (event: Event) => void
  onContextRestored?: (event: Event) => void
}

export interface ThreeLayer {
  readonly renderer: THREE.WebGLRenderer
  readonly scene: THREE.Scene
  readonly camera: THREE.Camera
  setCamera(camera: THREE.Camera): void
  resize(size: Size): void
  render(): void
  dispose(): void
}

/**
 * Creates a WebGL2 renderer on the canvas owned by the VantaJS2 runtime.
 * Antialiasing is off by default: a capped DPR is cheaper and looks better
 * for fullscreen ambient effects than MSAA on every pixel.
 */
export function createThreeLayer(host: CanvasHost, options: ThreeLayerOptions = {}): ThreeLayer {
  const renderer = new THREE.WebGLRenderer({
    canvas: host.canvas,
    alpha: options.alpha ?? true,
    antialias: options.antialias ?? false,
    powerPreference: options.powerPreference ?? 'high-performance',
    preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
  })

  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setClearColor(options.clearColor ?? 0x000000, options.clearAlpha ?? 0)
  renderer.setPixelRatio(host.size.dpr)
  renderer.setSize(host.size.width, host.size.height, false)

  const scene = new THREE.Scene()
  const camera = new THREE.Camera()
  let currentCamera: THREE.Camera = camera

  const onContextLost = (event: Event): void => {
    event.preventDefault()
    options.onContextLost?.(event)
  }
  const onContextRestored = (event: Event): void => {
    options.onContextRestored?.(event)
  }
  host.canvas.addEventListener('webglcontextlost', onContextLost, false)
  host.canvas.addEventListener('webglcontextrestored', onContextRestored, false)

  let disposed = false

  return {
    renderer,
    scene,
    get camera(): THREE.Camera {
      return currentCamera
    },
    setCamera(next: THREE.Camera) {
      currentCamera = next
    },
    resize(size: Size) {
      renderer.setPixelRatio(size.dpr)
      renderer.setSize(size.width, size.height, false)
    },
    render() {
      renderer.render(scene, currentCamera)
    },
    dispose() {
      if (disposed) return
      disposed = true
      host.canvas.removeEventListener('webglcontextlost', onContextLost)
      host.canvas.removeEventListener('webglcontextrestored', onContextRestored)
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

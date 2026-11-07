import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'

const POINT_VERTEX = /* glsl */ `
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uColor;
varying vec3 vColor;

void main() {
  vColor = uColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * uPixelRatio * (280.0 / max(-mvPosition.z, 1.0));
  gl_Position = projectionMatrix * mvPosition;
}
`

const POINT_FRAGMENT = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;

void main() {
  float distanceToCenter = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.05, distanceToCenter);
  gl_FragColor = vec4(vColor, alpha * uOpacity);
}
`

export interface NetOptions {
  color: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  points: number
  spacing: number
  maxDistance: number
  pointSize: number
  showDots: boolean
  showLines: boolean
  drift: number
  seed: number
}

const defaults: NetOptions = {
  color: 0x58d6ff,
  backgroundColor: 0x04060a,
  backgroundAlpha: 1,
  points: 10,
  spacing: 14,
  maxDistance: 22,
  pointSize: 0.85,
  showDots: true,
  showLines: true,
  drift: 1,
  seed: 7,
}

function mulberry32(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) >>> 0
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Node {
  base: THREE.Vector3
  phase: number
}

function coarsePointer(): boolean {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(pointer: coarse)').matches
    : false
}

export const net = defineEffect<NetOptions>({
  name: 'net',
  defaults,

  setup(host, options): EffectInstance<NetOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })

    const camera = new THREE.PerspectiveCamera(
      58,
      host.size.width / Math.max(host.size.height, 1),
      0.1,
      400,
    )
    camera.position.set(0, 0, 58)
    layer.setCamera(camera)

    const group = new THREE.Group()
    layer.scene.add(group)

    const mobile = coarsePointer()
    const grid = Math.max(4, Math.round(options.points * (mobile ? 0.72 : 1)))
    const nodeCount = grid * grid * 2
    const nodes: Node[] = []
    const positions = new Float32Array(nodeCount * 3)
    const half = (grid - 1) / 2
    const random = mulberry32(options.seed)

    for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
      for (let x = 0; x < grid; x++) {
        for (let z = 0; z < grid; z++) {
          const index = nodes.length
          const jitterX = (random() - 0.5) * options.spacing * 0.35
          const jitterZ = (random() - 0.5) * options.spacing * 0.35
          const base = new THREE.Vector3(
            (x - half) * options.spacing + jitterX,
            (layerIndex === 0 ? -1 : 1) * options.spacing * 0.45 + (random() - 0.5) * 8,
            (z - half) * options.spacing + jitterZ,
          )
          nodes.push({ base, phase: random() * Math.PI * 2 })
          positions[index * 3] = base.x
          positions[index * 3 + 1] = base.y
          positions[index * 3 + 2] = base.z
        }
      }
    }

    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
    )
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(options.color) },
        uSize: { value: options.pointSize },
        uPixelRatio: { value: host.size.dpr },
        uOpacity: { value: 0.95 },
      },
      vertexShader: POINT_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
    const points = new THREE.Points(pointGeometry, pointMaterial)
    points.frustumCulled = false
    group.add(points)

    const pairs: Array<[number, number]> = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i]!.base.distanceTo(nodes[j]!.base) <= options.maxDistance) {
          pairs.push([i, j])
        }
      }
    }

    const linePositions = new Float32Array(pairs.length * 6)
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage),
    )
    const lineMaterial = new THREE.LineBasicMaterial({
      color: options.color,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    lines.frustumCulled = false
    group.add(lines)

    let targetRotationX = 0
    let targetRotationY = 0
    let current: Readonly<NetOptions> = options

    const applyOptions = (next: Readonly<NetOptions>): void => {
      current = next
      pointMaterial.uniforms.uColor!.value.set(next.color)
      pointMaterial.uniforms.uSize!.value = next.pointSize
      lineMaterial.color.set(next.color)
      points.visible = next.showDots
      lines.visible = next.showLines
      layer.renderer.setClearColor(next.backgroundColor, next.backgroundAlpha)
    }
    applyOptions(options)

    return {
      resize(size) {
        camera.aspect = size.width / Math.max(size.height, 1)
        camera.updateProjectionMatrix()
        pointMaterial.uniforms.uPixelRatio!.value = size.dpr
        layer.resize(size)
      },

      render(frame) {
        const time = frame.time * current.drift
        const positionAttribute = pointGeometry.getAttribute('position') as THREE.BufferAttribute
        const lineAttribute = lineGeometry.getAttribute('position') as THREE.BufferAttribute

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]!
          const driftX = Math.sin(time * 0.42 + node.phase) * 1.5
          const driftY = Math.cos(time * 0.35 + node.phase * 1.31) * 1.15
          const driftZ = Math.sin(time * 0.29 + node.phase * 0.73) * 1.5
          const x = node.base.x + driftX
          const y = node.base.y + driftY
          const z = node.base.z + driftZ
          positions[i * 3] = x
          positions[i * 3 + 1] = y
          positions[i * 3 + 2] = z
          positionAttribute.setXYZ(i, x, y, z)
        }
        positionAttribute.needsUpdate = true

        for (let p = 0; p < pairs.length; p++) {
          const [a, b] = pairs[p]!
          lineAttribute.setXYZ(
            p * 2,
            positions[a * 3]!,
            positions[a * 3 + 1]!,
            positions[a * 3 + 2]!,
          )
          lineAttribute.setXYZ(
            p * 2 + 1,
            positions[b * 3]!,
            positions[b * 3 + 1]!,
            positions[b * 3 + 2]!,
          )
        }
        lineAttribute.needsUpdate = true

        if (!frame.pointer.active) {
          targetRotationX = 0
          targetRotationY = 0
        } else {
          targetRotationX = (frame.pointer.ny - 0.5) * -0.28
          targetRotationY = (frame.pointer.nx - 0.5) * 0.38
        }
        group.rotation.x += (targetRotationX - group.rotation.x) * 0.05
        group.rotation.y += (targetRotationY - group.rotation.y) * 0.05
        layer.render()
      },

      setOptions(next) {
        applyOptions(next)
      },

      dispose() {
        disposeScene(layer.scene)
        layer.dispose()
      },
    }
  },
})

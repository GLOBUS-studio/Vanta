import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'
import { createPointMaterial, mulberry32 } from './_shared.js'

const TRUNK_VERTEX = /* glsl */ `
attribute vec3 color;
uniform float uTime;
uniform float uSway;
varying vec3 vColor;

void main() {
  vColor = color;
  vec3 p = position;
  float sway = sin(p.y * 0.08 + uTime * 0.8) * uSway * max(p.y, 0.0) * 0.012;
  p.x += sway;
  p.z += cos(p.y * 0.06 + uTime * 0.6) * uSway * max(p.y, 0.0) * 0.007;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

const TRUNK_FRAGMENT = /* glsl */ `
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 0.9);
}
`

export interface TrunkOptions {
  color: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  spacing: number
  chaos: number
  density: number
  seed: number
}

const defaults: TrunkOptions = {
  color: 0x98465f,
  backgroundColor: 0x222426,
  backgroundAlpha: 1,
  spacing: 0,
  chaos: 1,
  density: 1,
  seed: 23,
}

interface Segment {
  start: THREE.Vector3
  end: THREE.Vector3
  depth: number
}

export const trunk = defineEffect<TrunkOptions>({
  name: 'trunk',
  defaults,

  setup(host, options): EffectInstance<TrunkOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const camera = new THREE.PerspectiveCamera(
      48,
      host.size.width / Math.max(host.size.height, 1),
      0.1,
      400,
    )
    camera.position.set(0, 6, 68)
    camera.lookAt(0, 2, 0)
    layer.setCamera(camera)

    const group = new THREE.Group()
    group.scale.setScalar(1.3)
    layer.scene.add(group)

    const random = mulberry32(options.seed)
    const segments: Segment[] = []
    const maxDepth = Math.max(4, Math.min(9, Math.round(5 + options.density * 2)))
    const baseLength = 13 + options.spacing
    const root = new THREE.Vector3(0, -30, 0)
    const up = new THREE.Vector3(0, 1, 0)
    const chaos = 0.3 + options.chaos * 0.45

    const grow = (
      start: THREE.Vector3,
      direction: THREE.Vector3,
      length: number,
      depth: number,
    ): void => {
      const end = start.clone().addScaledVector(direction, length)
      segments.push({ start: start.clone(), end, depth })
      if (depth >= maxDepth) return

      const children = depth < 2 ? 3 : 2
      for (let i = 0; i < children; i++) {
        const axis = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize()
        const angle = (0.22 + random() * 0.5) * chaos
        const nextDirection = direction
          .clone()
          .applyAxisAngle(axis, angle)
          .addScaledVector(up, 0.18 + random() * 0.18)
          .normalize()
        grow(end, nextDirection, length * (0.66 + random() * 0.12), depth + 1)
      }
    }
    grow(root, up, baseLength, 0)

    const positions = new Float32Array(segments.length * 6)
    const colors = new Float32Array(segments.length * 6)
    let rootColor = new THREE.Color(options.color)
    let tipColor = rootColor.clone().offsetHSL(0.05, 0.12, 0.26)
    const temp = new THREE.Color()

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]!
      const t = segment.depth / maxDepth
      temp.copy(rootColor).lerp(tipColor, t)
      positions[i * 6] = segment.start.x
      positions[i * 6 + 1] = segment.start.y
      positions[i * 6 + 2] = segment.start.z
      positions[i * 6 + 3] = segment.end.x
      positions[i * 6 + 4] = segment.end.y
      positions[i * 6 + 5] = segment.end.z
      colors[i * 6] = temp.r
      colors[i * 6 + 1] = temp.g
      colors[i * 6 + 2] = temp.b
      colors[i * 6 + 3] = temp.r
      colors[i * 6 + 4] = temp.g
      colors[i * 6 + 5] = temp.b
    }

    const geometry = new THREE.BufferGeometry()
    const positionAttribute = new THREE.BufferAttribute(positions, 3)
    const colorAttribute = new THREE.BufferAttribute(colors, 3)
    geometry.setAttribute('position', positionAttribute)
    geometry.setAttribute('color', colorAttribute)

    const tipPositions: number[] = []
    for (const segment of segments) {
      if (segment.depth >= maxDepth) {
        tipPositions.push(segment.end.x, segment.end.y, segment.end.z)
      }
    }
    const tipGeometry = new THREE.BufferGeometry()
    tipGeometry.setAttribute('position', new THREE.Float32BufferAttribute(tipPositions, 3))
    const tipMaterial = createPointMaterial({
      color: tipColor,
      size: 0.55,
      opacity: 0.8,
      pixelRatio: host.size.dpr,
    })
    const tips = new THREE.Points(tipGeometry, tipMaterial)
    group.add(tips)

    const uniforms = {
      uTime: { value: 0 },
      uSway: { value: 1 },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: TRUNK_VERTEX,
      fragmentShader: TRUNK_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const lines = new THREE.LineSegments(geometry, material)
    group.add(lines)

    let targetX = 0
    let targetY = 0

    const applyOptions = (next: Readonly<TrunkOptions>): void => {
      uniforms.uSway.value = 0.6 + next.chaos
      rootColor = new THREE.Color(next.color)
      tipColor = rootColor.clone().offsetHSL(0.05, 0.12, 0.26)
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]!
        temp.copy(rootColor).lerp(tipColor, segment.depth / maxDepth)
        colorAttribute.setXYZ(i * 2, temp.r, temp.g, temp.b)
        colorAttribute.setXYZ(i * 2 + 1, temp.r, temp.g, temp.b)
      }
      colorAttribute.needsUpdate = true
      tipMaterial.uniforms.uColor!.value.copy(tipColor)
      layer.renderer.setClearColor(next.backgroundColor, next.backgroundAlpha)
    }
    applyOptions(options)

    return {
      resize(size) {
        camera.aspect = size.width / Math.max(size.height, 1)
        camera.updateProjectionMatrix()
        tipMaterial.uniforms.uPixelRatio!.value = size.dpr
        layer.resize(size)
      },
      render(frame) {
        uniforms.uTime.value = frame.time
        group.rotation.y = Math.sin(frame.time * 0.12) * 0.35
        if (!frame.pointer.active) {
          targetX = 0
          targetY = 0
        } else {
          targetX = (frame.pointer.ny - 0.5) * -0.2
          targetY = (frame.pointer.nx - 0.5) * 0.25
        }
        group.rotation.x += (targetX - group.rotation.x) * 0.04
        group.rotation.z += (targetY - group.rotation.z) * 0.04
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

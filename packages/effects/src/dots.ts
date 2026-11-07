import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'
import { createLineMaterial, createPointMaterial, fibonacciSphere } from './_shared.js'

export interface DotsOptions {
  color: THREE.ColorRepresentation
  color2: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  size: number
  spacing: number
  showLines: boolean
}

const defaults: DotsOptions = {
  color: 0xff8820,
  color2: 0xff8820,
  backgroundColor: 0x222222,
  backgroundAlpha: 1,
  size: 3,
  spacing: 35,
  showLines: true,
}

export const dots = defineEffect<DotsOptions>({
  name: 'dots',
  defaults,

  setup(host, options): EffectInstance<DotsOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const camera = new THREE.PerspectiveCamera(
      50,
      host.size.width / Math.max(host.size.height, 1),
      0.1,
      300,
    )
    camera.position.set(0, 0, 48)
    layer.setCamera(camera)

    const group = new THREE.Group()
    layer.scene.add(group)

    const count = Math.max(180, Math.min(1400, Math.round(9000 / Math.max(options.spacing, 8))))
    const radius = 14
    const points = fibonacciSphere(count, radius)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const point = points[i]!
      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z
    }

    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pointMaterial = createPointMaterial({
      color: options.color,
      size: options.size * 0.3,
      pixelRatio: host.size.dpr,
    })
    const pointCloud = new THREE.Points(pointGeometry, pointMaterial)
    group.add(pointCloud)

    const pairs: Array<[number, number]> = []
    const maxDistance = radius * 0.22
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (points[i]!.distanceTo(points[j]!) <= maxDistance) pairs.push([i, j])
      }
    }
    const linePositions = new Float32Array(pairs.length * 6)
    for (let p = 0; p < pairs.length; p++) {
      const [a, b] = pairs[p]!
      linePositions[p * 6] = points[a]!.x
      linePositions[p * 6 + 1] = points[a]!.y
      linePositions[p * 6 + 2] = points[a]!.z
      linePositions[p * 6 + 3] = points[b]!.x
      linePositions[p * 6 + 4] = points[b]!.y
      linePositions[p * 6 + 5] = points[b]!.z
    }
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineMaterial = createLineMaterial(options.color2, 0.1)
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    group.add(lines)

    let targetX = 0
    let targetY = 0

    const applyOptions = (next: Readonly<DotsOptions>): void => {
      pointMaterial.uniforms.uColor!.value.set(next.color)
      pointMaterial.uniforms.uSize!.value = next.size * 0.3
      lineMaterial.color.set(next.color2)
      pointCloud.visible = true
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
        group.rotation.y = frame.time * 0.05
        if (!frame.pointer.active) {
          targetX = 0
          targetY = 0
        } else {
          targetX = (frame.pointer.ny - 0.5) * 0.35
          targetY = (frame.pointer.nx - 0.5) * 0.5
        }
        group.rotation.x += (targetX - group.rotation.x) * 0.05
        group.rotation.z += (targetY - group.rotation.z) * 0.03
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

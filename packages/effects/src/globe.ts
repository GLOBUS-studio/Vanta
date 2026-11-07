import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'
import { createLineMaterial, createPointMaterial, fibonacciSphere } from './_shared.js'

const ATMOSPHERE_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`

const ATMOSPHERE_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.5);
  gl_FragColor = vec4(uColor, fresnel * 0.55);
}
`

export interface GlobeOptions {
  color: THREE.ColorRepresentation
  color2: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  size: number
  points: number
  maxDistance: number
  spacing: number
  showDots: boolean
}

const defaults: GlobeOptions = {
  color: 0xff3f81,
  color2: 0xffffff,
  backgroundColor: 0x23153c,
  backgroundAlpha: 1,
  size: 1,
  points: 10,
  maxDistance: 20,
  spacing: 15,
  showDots: true,
}

export const globe = defineEffect<GlobeOptions>({
  name: 'globe',
  defaults,

  setup(host, options): EffectInstance<GlobeOptions> {
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

    const radius = 15 * options.size
    const pointCount = Math.max(80, Math.round(options.points * options.points * 2))
    const points = fibonacciSphere(pointCount, radius * 1.015)

    const pointPositions = new Float32Array(pointCount * 3)
    for (let i = 0; i < pointCount; i++) {
      const point = points[i]!
      pointPositions[i * 3] = point.x
      pointPositions[i * 3 + 1] = point.y
      pointPositions[i * 3 + 2] = point.z
    }
    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3))
    const pointMaterial = createPointMaterial({
      color: options.color,
      size: 0.55,
      pixelRatio: host.size.dpr,
    })
    const pointCloud = new THREE.Points(pointGeometry, pointMaterial)
    group.add(pointCloud)

    const pairDistance = radius * Math.min(0.32, Math.max(0.14, options.maxDistance / 90))
    const pairs: Array<[number, number]> = []
    for (let i = 0; i < pointCount; i++) {
      for (let j = i + 1; j < pointCount; j++) {
        if (points[i]!.distanceTo(points[j]!) <= pairDistance) pairs.push([i, j])
      }
    }
    const linkPositions = new Float32Array(pairs.length * 6)
    for (let p = 0; p < pairs.length; p++) {
      const [a, b] = pairs[p]!
      linkPositions[p * 6] = points[a]!.x
      linkPositions[p * 6 + 1] = points[a]!.y
      linkPositions[p * 6 + 2] = points[a]!.z
      linkPositions[p * 6 + 3] = points[b]!.x
      linkPositions[p * 6 + 4] = points[b]!.y
      linkPositions[p * 6 + 5] = points[b]!.z
    }
    const linkGeometry = new THREE.BufferGeometry()
    linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3))
    const linkMaterial = createLineMaterial(options.color, 0.13)
    const links = new THREE.LineSegments(linkGeometry, linkMaterial)
    group.add(links)

    const wirePositions: number[] = []
    const latStep = Math.PI / 9
    const lonStep = Math.PI / 12
    const wireSegments = 72
    for (let lat = -Math.PI / 2 + latStep; lat < Math.PI / 2; lat += latStep) {
      const y = Math.sin(lat) * radius
      const r = Math.cos(lat) * radius
      for (let s = 0; s < wireSegments; s++) {
        const a1 = (s / wireSegments) * Math.PI * 2
        const a2 = ((s + 1) / wireSegments) * Math.PI * 2
        wirePositions.push(
          Math.cos(a1) * r,
          y,
          Math.sin(a1) * r,
          Math.cos(a2) * r,
          y,
          Math.sin(a2) * r,
        )
      }
    }
    for (let lon = 0; lon < Math.PI * 2; lon += lonStep) {
      for (let s = 0; s < wireSegments / 2; s++) {
        const lat1 = -Math.PI / 2 + (s / (wireSegments / 2)) * Math.PI
        const lat2 = -Math.PI / 2 + ((s + 1) / (wireSegments / 2)) * Math.PI
        wirePositions.push(
          Math.cos(lat1) * Math.cos(lon) * radius,
          Math.sin(lat1) * radius,
          Math.cos(lat1) * Math.sin(lon) * radius,
          Math.cos(lat2) * Math.cos(lon) * radius,
          Math.sin(lat2) * radius,
          Math.cos(lat2) * Math.sin(lon) * radius,
        )
      }
    }
    const wireGeometry = new THREE.BufferGeometry()
    wireGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wirePositions, 3))
    const wireMaterial = createLineMaterial(options.color2, 0.16)
    const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial)
    group.add(wireframe)

    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.12, 32, 24)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(options.color2) } },
      vertexShader: ATMOSPHERE_VERTEX,
      fragmentShader: ATMOSPHERE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    group.add(atmosphere)

    let targetX = 0
    let targetY = 0

    const applyOptions = (next: Readonly<GlobeOptions>): void => {
      pointMaterial.uniforms.uColor!.value.set(next.color)
      linkMaterial.color.set(next.color)
      wireMaterial.color.set(next.color2)
      atmosphereMaterial.uniforms.uColor!.value.set(next.color2)
      pointCloud.visible = next.showDots
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
        group.rotation.y = frame.time * 0.06
        if (!frame.pointer.active) {
          targetX = 0
          targetY = 0
        } else {
          targetX = (frame.pointer.ny - 0.5) * -0.35
          targetY = (frame.pointer.nx - 0.5) * 0.45
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

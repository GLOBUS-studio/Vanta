import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'
import { mulberry32 } from './_shared.js'

const RING_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`

const RING_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.8);
  vec3 color = mix(uColor, uColor2, fresnel);
  gl_FragColor = vec4(color, (0.22 + fresnel * 0.78) * uOpacity);
}
`

export interface RingsOptions {
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  color: THREE.ColorRepresentation
  color2: THREE.ColorRepresentation
  rings: number
  size: number
  speed: number
  seed: number
}

const defaults: RingsOptions = {
  backgroundColor: 0x202428,
  backgroundAlpha: 1,
  color: 0x88ff00,
  color2: 0xff2255,
  rings: 8,
  size: 1,
  speed: 1,
  seed: 11,
}

interface RingState {
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
  baseRotation: THREE.Euler
  speed: THREE.Vector3
}

export const rings = defineEffect<RingsOptions>({
  name: 'rings',
  defaults,

  setup(host, options): EffectInstance<RingsOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const camera = new THREE.PerspectiveCamera(
      52,
      host.size.width / Math.max(host.size.height, 1),
      0.1,
      300,
    )
    camera.position.set(0, 0, 62)
    layer.setCamera(camera)

    const group = new THREE.Group()
    group.rotation.x = 0.15
    layer.scene.add(group)

    const geometry = new THREE.TorusGeometry(1, 0.028, 8, 192)
    const random = mulberry32(options.seed)
    const count = Math.max(2, Math.min(14, Math.round(options.rings)))
    const rings: RingState[] = []
    const color1 = new THREE.Color(options.color)
    const color2 = new THREE.Color(options.color2)

    for (let i = 0; i < count; i++) {
      const mix = count > 1 ? i / (count - 1) : 0
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: color1.clone().lerp(color2, mix * 0.6) },
          uColor2: { value: color2.clone().lerp(color1, mix * 0.5) },
          uOpacity: { value: 0.8 + random() * 0.2 },
        },
        vertexShader: RING_VERTEX,
        fragmentShader: RING_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)
      const radius = 6 + random() * 12
      mesh.scale.setScalar(radius)
      mesh.rotation.set(
        Math.PI / 2 + (random() - 0.5) * 0.7,
        i * 0.9 + random() * 0.3,
        (random() - 0.5) * 0.55,
      )
      group.add(mesh)
      rings.push({
        mesh,
        material,
        baseRotation: mesh.rotation.clone(),
        speed: new THREE.Vector3(
          (random() - 0.5) * 0.28,
          (random() - 0.5) * 0.28,
          (random() - 0.5) * 0.28,
        ),
      })
    }

    let targetX = 0
    let targetY = 0

    const applyOptions = (next: Readonly<RingsOptions>): void => {
      const c1 = new THREE.Color(next.color)
      const c2 = new THREE.Color(next.color2)
      for (const ring of rings) {
        ring.material.uniforms.uColor!.value.copy(c1)
        ring.material.uniforms.uColor2!.value.copy(c2)
      }
      group.scale.setScalar(next.size * 1.15)
      layer.renderer.setClearColor(next.backgroundColor, next.backgroundAlpha)
    }
    applyOptions(options)

    return {
      resize(size) {
        camera.aspect = size.width / Math.max(size.height, 1)
        camera.updateProjectionMatrix()
        layer.resize(size)
      },
      render(frame) {
        const t = frame.time * 0.6
        for (const ring of rings) {
          ring.mesh.rotation.set(
            ring.baseRotation.x + t * ring.speed.x,
            ring.baseRotation.y + t * ring.speed.y,
            ring.baseRotation.z + t * ring.speed.z,
          )
        }
        if (!frame.pointer.active) {
          targetX = 0.15
          targetY = 0
        } else {
          targetX = 0.15 + (frame.pointer.ny - 0.5) * -0.25
          targetY = (frame.pointer.nx - 0.5) * 0.4
        }
        group.rotation.x += (targetX - group.rotation.x) * 0.04
        group.rotation.y += (targetY - group.rotation.y) * 0.04
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

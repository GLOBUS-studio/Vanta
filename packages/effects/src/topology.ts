import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'

const TOPOLOGY_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying float vHeight;

float terrain(vec2 p) {
  float t = uTime * 0.28;
  float h = sin(p.x * 0.18 + t) * 0.5;
  h += sin(p.y * 0.22 - t * 0.8) * 0.4;
  h += sin((p.x + p.y) * 0.1 + t * 0.6) * 0.3;
  h += sin(length(p) * 0.25 - t) * 0.2;
  return h;
}

void main() {
  vec3 p = position;
  float h = terrain(p.xz);
  p.y += h * uAmp;
  vHeight = h;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

const TOPOLOGY_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying float vHeight;

void main() {
  vec3 color = mix(uColor * 0.12, uColor, smoothstep(-1.0, 1.0, vHeight));
  gl_FragColor = vec4(color, 0.62);
}
`

export interface TopologyOptions {
  color: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  density: number
  scale: number
}

const defaults: TopologyOptions = {
  color: 0x89964e,
  backgroundColor: 0x002222,
  backgroundAlpha: 1,
  density: 1,
  scale: 1,
}

export const topology = defineEffect<TopologyOptions>({
  name: 'topology',
  defaults,

  setup(host, options): EffectInstance<TopologyOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const camera = new THREE.PerspectiveCamera(
      55,
      host.size.width / Math.max(host.size.height, 1),
      0.1,
      400,
    )
    camera.position.set(0, 34, 76)
    camera.lookAt(0, 0, 0)
    layer.setCamera(camera)

    const segments = Math.max(24, Math.min(120, Math.round(64 * options.density)))
    const geometry = new THREE.PlaneGeometry(120, 120, segments, segments)
    geometry.rotateX(-Math.PI / 2)

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 10 * options.scale },
      uColor: { value: new THREE.Color(options.color) },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: TOPOLOGY_VERTEX,
      fragmentShader: TOPOLOGY_FRAGMENT,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const mesh = new THREE.Mesh(geometry, material)
    layer.scene.add(mesh)

    const applyOptions = (next: Readonly<TopologyOptions>): void => {
      uniforms.uColor.value.set(next.color)
      uniforms.uAmp.value = 10 * next.scale
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
        uniforms.uTime.value = frame.time
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

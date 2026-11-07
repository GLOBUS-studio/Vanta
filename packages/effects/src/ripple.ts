import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'
import { FULLSCREEN_FRAGMENT_PREFIX } from './_shared.js'

const RIPPLE_FRAGMENT =
  FULLSCREEN_FRAGMENT_PREFIX +
  /* glsl */ `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBackground;
uniform float uAmplitude;
uniform float uRing;
uniform float uRotation;

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec2 center = (uPointer - 0.5) * vec2(aspect, 1.0) * 0.9;
  float angle = uTime * 0.04 * uRotation;
  mat2 rotate = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 q = rotate * (p - center);

  float d = length(q);
  float t = uTime * 0.9;
  float wave = sin(d * 22.0 * uRing - t * 2.2) * exp(-d * 2.2);
  float wave2 = sin(d * 11.0 * uRing + t * 1.3) * exp(-d * 1.5);
  float ring = (wave * 0.65 + wave2 * 0.35) * uAmplitude;

  vec3 color = mix(uBackground, uColor1, smoothstep(1.0, 0.0, d) * 0.58);
  color = mix(color, uColor2, max(ring, 0.0) * 0.7);
  color += uColor1 * max(-ring, 0.0) * 0.34;
  color += uColor2 * smoothstep(0.12, 0.0, d) * 0.24;

  float vignette = smoothstep(1.35, 0.15, length(p * vec2(0.8, 1.0)));
  color *= 0.65 + vignette * 0.45;
  gl_FragColor = vec4(color, 1.0);
}
`

export interface RippleOptions {
  color1: THREE.ColorRepresentation
  color2: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  amplitudeFactor: number
  ringFactor: number
  rotationFactor: number
}

const defaults: RippleOptions = {
  color1: 0x1b3a8a,
  color2: 0xffffff,
  backgroundColor: 0xf0f4ff,
  backgroundAlpha: 1,
  amplitudeFactor: 1,
  ringFactor: 4,
  rotationFactor: 0.1,
}

export const ripple = defineEffect<RippleOptions>({
  name: 'ripple',
  defaults,

  setup(host, options): EffectInstance<RippleOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const uniforms = {
      uResolution: { value: new THREE.Vector2(host.size.width, host.size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(options.color1) },
      uColor2: { value: new THREE.Color(options.color2) },
      uBackground: { value: new THREE.Color(options.backgroundColor) },
      uAmplitude: { value: options.amplitudeFactor },
      uRing: { value: options.ringFactor },
      uRotation: { value: options.rotationFactor },
    }
    const pass = createFullscreenPass(RIPPLE_FRAGMENT, uniforms)
    layer.scene.add(pass.mesh)

    const applyOptions = (next: Readonly<RippleOptions>): void => {
      uniforms.uColor1.value.set(next.color1)
      uniforms.uColor2.value.set(next.color2)
      uniforms.uBackground.value.set(next.backgroundColor)
      uniforms.uAmplitude.value = next.amplitudeFactor
      uniforms.uRing.value = next.ringFactor
      uniforms.uRotation.value = next.rotationFactor
      layer.renderer.setClearColor(next.backgroundColor, next.backgroundAlpha)
    }
    applyOptions(options)

    return {
      resize(size) {
        uniforms.uResolution.value.set(size.width, size.height)
        layer.resize(size)
      },
      render(frame) {
        uniforms.uTime.value = frame.time
        uniforms.uPointer.value.set(frame.pointer.nx, frame.pointer.ny)
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

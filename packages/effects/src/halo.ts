import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'
import { FULLSCREEN_FRAGMENT_PREFIX } from './_shared.js'

const HALO_FRAGMENT =
  FULLSCREEN_FRAGMENT_PREFIX +
  /* glsl */ `
uniform vec3 uBaseColor;
uniform vec3 uColor2;
uniform vec3 uBackground;
uniform float uAmplitude;
uniform float uRing;
uniform float uRotation;
uniform float uSize;
uniform float uXOffset;
uniform float uYOffset;

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  p -= vec2(uXOffset, uYOffset);
  p /= max(uSize, 0.1);

  float r = length(p);
  float a = atan(p.y, p.x) + uTime * 0.04 * uRotation;
  float rays = pow(0.5 + 0.5 * sin(a * 18.0 + sin(r * 9.0 - uTime * 1.5) * 2.0), 5.0);
  float ring = pow(max(sin(r * 20.0 * uRing - uTime * 2.2), 0.0), 3.0) * exp(-r * 2.6);
  float glow = exp(-r * 2.8);
  float core = exp(-r * 6.2);
  vec3 coreColor = mix(uBaseColor, vec3(0.65, 0.85, 1.0), 0.85);

  vec3 color = uBackground;
  color += coreColor * core * 1.7;
  color += coreColor * glow * 0.22;
  color += uColor2 * ring * 0.55 * uAmplitude;
  color += uColor2 * rays * glow * 0.05;
  color += uColor2 * smoothstep(0.25, 0.95, r) * 0.035;

  float vignette = smoothstep(1.4, 0.2, length(p * vec2(0.75, 1.0)));
  color *= 0.65 + vignette * 0.45;
  gl_FragColor = vec4(color, 1.0);
}
`

export interface HaloOptions {
  baseColor: THREE.ColorRepresentation
  color2: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  amplitudeFactor: number
  ringFactor: number
  rotationFactor: number
  xOffset: number
  yOffset: number
  size: number
}

const defaults: HaloOptions = {
  baseColor: 0x001a59,
  color2: 0xf2e735,
  backgroundColor: 0x131a43,
  backgroundAlpha: 1,
  amplitudeFactor: 1,
  ringFactor: 1,
  rotationFactor: 1,
  xOffset: 0,
  yOffset: 0,
  size: 1,
}

export const halo = defineEffect<HaloOptions>({
  name: 'halo',
  defaults,

  setup(host, options): EffectInstance<HaloOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const uniforms = {
      uResolution: { value: new THREE.Vector2(host.size.width, host.size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(options.baseColor) },
      uColor2: { value: new THREE.Color(options.color2) },
      uBackground: { value: new THREE.Color(options.backgroundColor) },
      uAmplitude: { value: options.amplitudeFactor },
      uRing: { value: options.ringFactor },
      uRotation: { value: options.rotationFactor },
      uSize: { value: options.size },
      uXOffset: { value: options.xOffset },
      uYOffset: { value: options.yOffset },
    }
    const pass = createFullscreenPass(HALO_FRAGMENT, uniforms)
    layer.scene.add(pass.mesh)

    const applyOptions = (next: Readonly<HaloOptions>): void => {
      uniforms.uBaseColor.value.set(next.baseColor)
      uniforms.uColor2.value.set(next.color2)
      uniforms.uBackground.value.set(next.backgroundColor)
      uniforms.uAmplitude.value = next.amplitudeFactor
      uniforms.uRing.value = next.ringFactor
      uniforms.uRotation.value = next.rotationFactor
      uniforms.uSize.value = next.size
      uniforms.uXOffset.value = next.xOffset
      uniforms.uYOffset.value = next.yOffset
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

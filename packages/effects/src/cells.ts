import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'
import { FULLSCREEN_FRAGMENT_PREFIX } from './_shared.js'

const CELLS_FRAGMENT =
  FULLSCREEN_FRAGMENT_PREFIX +
  /* glsl */ `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBackground;
uniform float uAmplitude;
uniform float uRing;
uniform float uRotation;
uniform float uSize;

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float worley(vec2 p, out float edge) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      o = 0.5 + 0.5 * sin(uTime * 0.6 + 6.2831 * o);
      vec2 r = g + o - f;
      float d = length(r);
      if (d < d1) {
        d2 = d1;
        d1 = d;
      } else if (d < d2) {
        d2 = d;
      }
    }
  }
  edge = d2 - d1;
  return d1;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  p *= uSize;
  float angle = uTime * 0.03 * uRotation;
  mat2 rotate = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  p = rotate * p;

  float edge;
  float d = worley(p, edge);
  float wall = 1.0 - smoothstep(0.0, 0.07, edge);
  float body = smoothstep(0.05, 0.52, d);
  float ring = 0.5 + 0.5 * sin(d * 20.0 * uRing - uTime * 1.6);

  vec3 color = mix(uColor1, uColor2, body);
  color = mix(uBackground, color, smoothstep(0.0, 0.62, d));
  color = mix(color, uColor1, wall * 0.82);
  color += uColor2 * (1.0 - smoothstep(0.0, 0.2, d)) * 0.36;
  color += uColor2 * max(ring, 0.0) * 0.07 * uAmplitude;

  float vignette = smoothstep(1.35, 0.2, length(p * vec2(0.7, 1.0)));
  color *= 0.62 + vignette * 0.5;
  gl_FragColor = vec4(color, 1.0);
}
`

export interface CellsOptions {
  color1: THREE.ColorRepresentation
  color2: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  amplitudeFactor: number
  ringFactor: number
  rotationFactor: number
  size: number
}

const defaults: CellsOptions = {
  color1: 0x008c8c,
  color2: 0xf2e735,
  backgroundColor: 0xd7ff8f,
  backgroundAlpha: 1,
  amplitudeFactor: 1,
  ringFactor: 1,
  rotationFactor: 1,
  size: 2,
}

export const cells = defineEffect<CellsOptions>({
  name: 'cells',
  defaults,

  setup(host, options): EffectInstance<CellsOptions> {
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
      uSize: { value: options.size },
    }
    const pass = createFullscreenPass(CELLS_FRAGMENT, uniforms)
    layer.scene.add(pass.mesh)

    const applyOptions = (next: Readonly<CellsOptions>): void => {
      uniforms.uColor1.value.set(next.color1)
      uniforms.uColor2.value.set(next.color2)
      uniforms.uBackground.value.set(next.backgroundColor)
      uniforms.uAmplitude.value = next.amplitudeFactor
      uniforms.uRing.value = next.ringFactor
      uniforms.uRotation.value = next.rotationFactor
      uniforms.uSize.value = next.size
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

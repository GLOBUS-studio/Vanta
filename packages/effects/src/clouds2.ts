import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'
import { FULLSCREEN_FRAGMENT_PREFIX } from './_shared.js'

const CLOUDS2_FRAGMENT =
  FULLSCREEN_FRAGMENT_PREFIX +
  /* glsl */ `
uniform vec3 uSky;
uniform vec3 uCloud;
uniform vec3 uLight;
uniform float uScale;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.03 + 7.1;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  p += (uPointer - 0.5) * 0.16;
  p *= uScale;

  float t = uTime * 0.03;
  float warp = fbm(p * 1.4 + vec2(t, -t * 0.6));
  float n = fbm(p * 2.0 + warp * 1.7 + vec2(-t * 0.4, t * 0.3));
  float detail = fbm(p * 4.8 + warp * 2.1 + t * 0.5);

  float cloud = smoothstep(0.38, 0.78, n);
  vec3 color = mix(uSky, uCloud, cloud);
  color = mix(color, uLight, smoothstep(0.62, 0.96, detail) * 0.45);
  color += uLight * pow(max(n, 0.0), 7.0) * 0.18;
  color += uCloud * smoothstep(0.1, 0.9, warp) * 0.08;

  float star = step(0.9975, hash21(floor(vUv * uResolution * 0.5)));
  color += star * uLight * (0.25 + 0.75 * vUv.y);

  float vignette = smoothstep(1.3, 0.15, length(p * vec2(0.75, 1.0)));
  color *= 0.5 + vignette * 0.6;
  gl_FragColor = vec4(color, 1.0);
}
`

export interface Clouds2Options {
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  skyColor: THREE.ColorRepresentation
  cloudColor: THREE.ColorRepresentation
  lightColor: THREE.ColorRepresentation
  scale: number
}

const defaults: Clouds2Options = {
  backgroundColor: 0x000000,
  backgroundAlpha: 1,
  skyColor: 0x5ca6ca,
  cloudColor: 0x334d80,
  lightColor: 0xffffff,
  scale: 1.4,
}

export const clouds2 = defineEffect<Clouds2Options>({
  name: 'clouds2',
  defaults,

  setup(host, options): EffectInstance<Clouds2Options> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const uniforms = {
      uResolution: { value: new THREE.Vector2(host.size.width, host.size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uSky: { value: new THREE.Color(options.skyColor) },
      uCloud: { value: new THREE.Color(options.cloudColor) },
      uLight: { value: new THREE.Color(options.lightColor) },
      uScale: { value: options.scale },
    }
    const pass = createFullscreenPass(CLOUDS2_FRAGMENT, uniforms)
    layer.scene.add(pass.mesh)

    const applyOptions = (next: Readonly<Clouds2Options>): void => {
      uniforms.uSky.value.set(next.skyColor)
      uniforms.uCloud.value.set(next.cloudColor)
      uniforms.uLight.value.set(next.lightColor)
      uniforms.uScale.value = next.scale
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

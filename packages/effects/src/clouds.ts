import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'
import { FULLSCREEN_FRAGMENT_PREFIX } from './_shared.js'

const CLOUDS_FRAGMENT =
  FULLSCREEN_FRAGMENT_PREFIX +
  /* glsl */ `
uniform vec3 uSky;
uniform vec3 uCloud;
uniform vec3 uShadow;
uniform vec3 uSun;
uniform vec3 uGlare;
uniform vec3 uSunlight;
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
    p = rotate * p * 2.03 + 11.3;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  p += (uPointer - 0.5) * 0.15;
  p *= uScale;

  float t = uTime * 0.018;
  vec3 sky = mix(uSky, uSky * 0.52 + vec3(0.02), smoothstep(0.0, 1.0, uv.y));

  vec2 sunPos = vec2(0.73, 0.68);
  float sunDist = length((uv - sunPos) * vec2(aspect, 1.0));
  float sun = smoothstep(0.085, 0.015, sunDist);
  float glare = exp(-sunDist * 4.2);
  sky += uSun * sun * 0.95 + uGlare * glare * 0.28;

  vec2 q = p + vec2(t * 1.3, 0.0);
  float warp = fbm(q * 0.55 + fbm(q * 0.28));
  float n = fbm(q * 1.15 + warp * 0.9);
  float detail = fbm(q * 2.6 - warp * 0.4 + vec2(t * 2.1, 0.0));
  float cloud = smoothstep(0.46, 0.72, n + detail * 0.16);

  float light = fbm(q * 1.5 + vec2(0.1, 0.2) + t);
  float shade = smoothstep(0.25, 0.78, light);
  vec3 cloudColor = mix(uShadow, uCloud, shade);
  cloudColor = mix(cloudColor, uSunlight, smoothstep(0.62, 0.96, detail) * 0.38);

  float sunSide = smoothstep(0.22, 0.0, sunDist);
  cloudColor += uSunlight * sunSide * cloud * 0.28;

  vec3 color = mix(sky, cloudColor, cloud);
  color = mix(color, uSky, smoothstep(0.9, 0.15, uv.y) * 0.18);
  color += uGlare * glare * cloud * 0.06;

  float vignette = smoothstep(1.35, 0.2, length(p * vec2(0.7, 1.0)));
  color *= 0.65 + vignette * 0.45;
  gl_FragColor = vec4(color, 1.0);
}
`

export interface CloudsOptions {
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  skyColor: THREE.ColorRepresentation
  cloudColor: THREE.ColorRepresentation
  cloudShadowColor: THREE.ColorRepresentation
  sunColor: THREE.ColorRepresentation
  sunGlareColor: THREE.ColorRepresentation
  sunlightColor: THREE.ColorRepresentation
  scale: number
}

const defaults: CloudsOptions = {
  backgroundColor: 0xffffff,
  backgroundAlpha: 1,
  skyColor: 0x68b8d7,
  cloudColor: 0xadc1de,
  cloudShadowColor: 0x183550,
  sunColor: 0xff9919,
  sunGlareColor: 0xff6633,
  sunlightColor: 0xff9933,
  scale: 3,
}

export const clouds = defineEffect<CloudsOptions>({
  name: 'clouds',
  defaults,

  setup(host, options): EffectInstance<CloudsOptions> {
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
      uShadow: { value: new THREE.Color(options.cloudShadowColor) },
      uSun: { value: new THREE.Color(options.sunColor) },
      uGlare: { value: new THREE.Color(options.sunGlareColor) },
      uSunlight: { value: new THREE.Color(options.sunlightColor) },
      uScale: { value: options.scale },
    }
    const pass = createFullscreenPass(CLOUDS_FRAGMENT, uniforms)
    layer.scene.add(pass.mesh)

    const applyOptions = (next: Readonly<CloudsOptions>): void => {
      uniforms.uSky.value.set(next.skyColor)
      uniforms.uCloud.value.set(next.cloudColor)
      uniforms.uShadow.value.set(next.cloudShadowColor)
      uniforms.uSun.value.set(next.sunColor)
      uniforms.uGlare.value.set(next.sunGlareColor)
      uniforms.uSunlight.value.set(next.sunlightColor)
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

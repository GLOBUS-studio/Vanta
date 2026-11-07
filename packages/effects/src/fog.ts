import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'
import { FULLSCREEN_FRAGMENT_PREFIX } from './_shared.js'

const FOG_FRAGMENT =
  FULLSCREEN_FRAGMENT_PREFIX +
  /* glsl */ `
uniform vec3 uHighlight;
uniform vec3 uMidtone;
uniform vec3 uLowlight;
uniform vec3 uBase;
uniform float uBlur;
uniform float uZoom;
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
    p = rotate * p * 2.02 + 13.7;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  p *= uZoom;
  p += (uPointer - 0.5) * 0.2;

  float t = uTime * 0.15;
  float warp = fbm(p * 1.1 + vec2(t, -t * 0.6));
  float base = fbm(p * (2.0 + uScale * 0.2) + vec2(-t * 0.4, t * 0.3) + warp * 1.1);
  float detail = fbm(p * 5.0 + warp * 2.0 + vec2(-t * 0.7, t * 0.5));
  float n = mix(base, detail, 0.3 + uBlur * 0.35);
  n = mix(n, fbm(p * 9.0 + warp * 2.5), uBlur * 0.25);

  float v = vUv.y;
  vec3 color = mix(uBase, uLowlight, smoothstep(0.0, 0.45, v));
  color = mix(color, uMidtone, smoothstep(0.35, 0.72, v));
  color = mix(color, uHighlight, smoothstep(0.62, 0.98, v));

  float density = smoothstep(0.42, 0.62, n);
  color = mix(color, uHighlight, density * 0.55);
  color = mix(color, uLowlight, (1.0 - density) * 0.2);
  color += uMidtone * smoothstep(0.55, 0.75, n) * 0.15;
  color *= 0.72 + density * 0.4;

  float vignette = smoothstep(1.25, 0.15, length(p * vec2(0.8, 1.0)));
  color *= 0.62 + vignette * 0.5;
  gl_FragColor = vec4(color, 1.0);
}
`

export interface FogOptions {
  highlightColor: THREE.ColorRepresentation
  midtoneColor: THREE.ColorRepresentation
  lowlightColor: THREE.ColorRepresentation
  baseColor: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  blurFactor: number
  zoom: number
  scale: number
}

const defaults: FogOptions = {
  highlightColor: 0xffc300,
  midtoneColor: 0xff1f00,
  lowlightColor: 0x2d00ff,
  baseColor: 0xffebeb,
  backgroundColor: 0xffebeb,
  backgroundAlpha: 1,
  blurFactor: 0.6,
  zoom: 1,
  scale: 2,
}

export const fog = defineEffect<FogOptions>({
  name: 'fog',
  defaults,

  setup(host, options): EffectInstance<FogOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })
    const uniforms = {
      uResolution: { value: new THREE.Vector2(host.size.width, host.size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHighlight: { value: new THREE.Color(options.highlightColor) },
      uMidtone: { value: new THREE.Color(options.midtoneColor) },
      uLowlight: { value: new THREE.Color(options.lowlightColor) },
      uBase: { value: new THREE.Color(options.baseColor) },
      uBlur: { value: options.blurFactor },
      uZoom: { value: options.zoom },
      uScale: { value: options.scale },
    }
    const pass = createFullscreenPass(FOG_FRAGMENT, uniforms)
    layer.scene.add(pass.mesh)

    const applyOptions = (next: Readonly<FogOptions>): void => {
      uniforms.uHighlight.value.set(next.highlightColor)
      uniforms.uMidtone.value.set(next.midtoneColor)
      uniforms.uLowlight.value.set(next.lowlightColor)
      uniforms.uBase.value.set(next.baseColor)
      uniforms.uBlur.value = next.blurFactor
      uniforms.uZoom.value = next.zoom
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

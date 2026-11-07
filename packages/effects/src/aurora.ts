import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'

const AURORA_FRAGMENT = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uIntensity;
uniform float uScale;
uniform float uQuality;
varying vec2 vUv;

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
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  p *= uScale;
  p += (uPointer - 0.5) * 0.2;

  float t = uTime * 0.25;
  float warp = fbm(vec2(p.x * 0.9 + t * 0.8, p.y * 0.7 - t * 0.35));
  float warp2 = fbm(vec2(p.x * 1.7 - t * 0.4, p.y * 1.1 + t * 0.2) + warp);

  float curtain = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float x = p.x * (2.1 + fi * 0.35) + warp * 1.15 + fi * 1.7;
    x += sin(p.y * 1.8 + t * 1.2 + fi) * 0.12;
    float band = sin(x * 3.0 + t * (1.3 + fi * 0.2) + fi * 2.3);
    band = pow(max(band, 0.0), 5.0);
    float vertical = smoothstep(1.15, -0.15, abs(p.y + 0.12 + fi * 0.16));
    float edge = smoothstep(0.15, 1.0, warp2);
    curtain += band * vertical * (0.55 + edge * 0.6) * (1.0 - fi * 0.16);
  }
  curtain = clamp(curtain * 1.25, 0.0, 1.0);

  float streaks = fbm(vec2(p.x * 7.0 + warp * 1.5, p.y * 0.6 - t * 1.4));
  curtain *= 0.6 + streaks * 0.8;

  vec3 background = mix(vec3(0.006, 0.012, 0.03), uColorA, smoothstep(-0.6, 0.8, uv.y));
  float star = step(0.9975, hash21(floor(uv * uResolution * 0.5)));
  background += star * vec3(0.5, 0.7, 0.9) * (0.25 + 0.75 * uv.y);

  vec3 auroraColor = mix(uColorB, uColorC, smoothstep(-0.2, 0.9, uv.y + warp * 0.2));
  auroraColor = mix(auroraColor, vec3(0.85, 1.0, 0.95), pow(curtain, 3.0) * 0.35);

  vec3 color = background + auroraColor * curtain * uIntensity * 1.35;

  float horizon = smoothstep(0.55, -0.1, abs(p.y + 0.45));
  color += uColorB * horizon * 0.06 * uIntensity;

  float vignette = smoothstep(1.3, 0.2, length(p * vec2(0.75, 1.0)));
  color *= 0.55 + vignette * 0.65;

  // Dithering keeps large gradients from banding on 8-bit displays.
  float dither = hash21(gl_FragCoord.xy + fract(uTime)) - 0.5;
  color += dither / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`

export interface AuroraOptions {
  colorA: THREE.ColorRepresentation
  colorB: THREE.ColorRepresentation
  colorC: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  intensity: number
  scale: number
}

const defaults: AuroraOptions = {
  colorA: 0x030814,
  colorB: 0x35f0c8,
  colorC: 0x8b5cff,
  backgroundColor: 0x02040a,
  backgroundAlpha: 1,
  intensity: 1,
  scale: 1,
}

export const aurora = defineEffect<AuroraOptions>({
  name: 'aurora',
  defaults,

  setup(host, options): EffectInstance<AuroraOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(host.size.width, host.size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color(options.colorA) },
      uColorB: { value: new THREE.Color(options.colorB) },
      uColorC: { value: new THREE.Color(options.colorC) },
      uIntensity: { value: options.intensity },
      uScale: { value: options.scale },
      uQuality: { value: host.quality },
    }

    const pass = createFullscreenPass(AURORA_FRAGMENT, uniforms)
    layer.scene.add(pass.mesh)

    const applyOptions = (next: Readonly<AuroraOptions>): void => {
      uniforms.uColorA.value.set(next.colorA)
      uniforms.uColorB.value.set(next.colorB)
      uniforms.uColorC.value.set(next.colorC)
      uniforms.uIntensity.value = next.intensity
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
        uniforms.uQuality.value = frame.quality
        layer.render()
      },

      setOptions(next) {
        applyOptions(next)
      },

      onQualityChange(quality) {
        uniforms.uQuality.value = quality
      },

      dispose() {
        disposeScene(layer.scene)
        layer.dispose()
      },
    }
  },
})

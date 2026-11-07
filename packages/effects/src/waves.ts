import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'

const WAVES_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uHeight;
uniform float uScale;
varying vec3 vWorld;
varying float vHeight;

float waveHeight(vec2 p) {
  float t = uTime;
  float h = 0.0;
  h += sin(p.x * 0.55 + t * 0.90) * 0.55;
  h += sin(p.y * 0.85 - t * 0.70) * 0.28;
  h += sin((p.x + p.y) * 0.38 + t * 0.55) * 0.17;
  h += sin(length(p) * 0.65 - t * 1.15) * 0.12;
  return h;
}

void main() {
  vec3 p = position;
  float h = waveHeight(p.xz * uScale);
  p.y += h * uHeight;
  vHeight = h;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const WAVES_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uHighlight;
uniform vec3 uFog;
uniform vec3 uLight;
varying vec3 vWorld;
varying float vHeight;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (normal.y < 0.0) normal = -normal;

  vec3 viewDir = normalize(cameraPosition - vWorld);
  vec3 lightDir = normalize(uLight);
  float diffuse = max(dot(normal, lightDir), 0.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 96.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  float heightMix = smoothstep(-0.85, 0.85, vHeight);
  float crest = smoothstep(0.42, 1.0, heightMix);
  vec3 color = mix(uColor, uHighlight, crest * 0.82);
  color *= 0.32 + diffuse * 0.95;
  color += uHighlight * fresnel * 0.28;
  color += vec3(0.9, 0.97, 1.0) * specular * 1.15;

  float sparkle = step(0.994, hash21(floor(vWorld.xz * 3.2) + floor(uTime * 1.7)));
  color += sparkle * uHighlight * 0.35;

  float distanceToCamera = length(vWorld.xz - cameraPosition.xz);
  float fog = smoothstep(34.0, 86.0, distanceToCamera);
  color = mix(color, uFog, fog);

  gl_FragColor = vec4(color, 1.0);
}
`

export interface WavesOptions {
  color: THREE.ColorRepresentation
  highlightColor: THREE.ColorRepresentation
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  waveHeight: number
  waveSpeed: number
  waveScale: number
  zoom: number
}

const defaults: WavesOptions = {
  color: 0x072438,
  highlightColor: 0x63e6ff,
  backgroundColor: 0x03070d,
  backgroundAlpha: 1,
  waveHeight: 2.6,
  waveSpeed: 0.9,
  waveScale: 0.17,
  zoom: 1,
}

function coarsePointer(): boolean {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(pointer: coarse)').matches
    : false
}

export const waves = defineEffect<WavesOptions>({
  name: 'waves',
  defaults,

  setup(host, options): EffectInstance<WavesOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })

    const camera = new THREE.PerspectiveCamera(
      42,
      host.size.width / Math.max(host.size.height, 1),
      0.1,
      400,
    )
    const base = new THREE.Vector3(0, 16, 48)
    camera.position.copy(base)
    camera.lookAt(0, -4, 4)
    layer.setCamera(camera)

    const mobile = coarsePointer()
    const geometry = new THREE.PlaneGeometry(140, 100, mobile ? 96 : 180, mobile ? 64 : 128)
    geometry.rotateX(-Math.PI / 2)

    const uniforms = {
      uTime: { value: 0 },
      uHeight: { value: options.waveHeight },
      uScale: { value: options.waveScale },
      uColor: { value: new THREE.Color(options.color) },
      uHighlight: { value: new THREE.Color(options.highlightColor) },
      uFog: { value: new THREE.Color(options.backgroundColor) },
      uLight: { value: new THREE.Vector3(-0.45, 0.9, 0.35).normalize() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: WAVES_VERTEX,
      fragmentShader: WAVES_FRAGMENT,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = -7
    layer.scene.add(mesh)

    let targetX = base.x
    let targetY = base.y
    let current: Readonly<WavesOptions> = options

    const applyOptions = (next: Readonly<WavesOptions>): void => {
      current = next
      uniforms.uHeight.value = next.waveHeight
      uniforms.uScale.value = next.waveScale
      uniforms.uColor.value.set(next.color)
      uniforms.uHighlight.value.set(next.highlightColor)
      uniforms.uFog.value.set(next.backgroundColor)
      layer.renderer.setClearColor(next.backgroundColor, next.backgroundAlpha)
      camera.position.z = base.z / Math.max(next.zoom, 0.1)
    }
    applyOptions(options)

    return {
      resize(size) {
        camera.aspect = size.width / Math.max(size.height, 1)
        camera.updateProjectionMatrix()
        layer.resize(size)
      },

      render(frame) {
        uniforms.uTime.value = frame.time * current.waveSpeed

        if (!frame.pointer.active) {
          targetX = base.x
          targetY = base.y
        } else {
          targetX = base.x + (frame.pointer.nx - 0.5) * 12
          targetY = base.y + (frame.pointer.ny - 0.5) * -5
        }
        camera.position.x += (targetX - camera.position.x) * 0.045
        camera.position.y += (targetY - camera.position.y) * 0.045
        camera.lookAt(0, -4, 4)
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

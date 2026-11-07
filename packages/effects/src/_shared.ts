import * as THREE from 'three'

export function mulberry32(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) >>> 0
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function isCoarsePointer(): boolean {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(pointer: coarse)').matches
    : false
}

export function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const ring = Math.sqrt(Math.max(1 - y * y, 0))
    const theta = golden * i
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * ring * radius,
        y * radius,
        Math.sin(theta) * ring * radius,
      ),
    )
  }
  return points
}

const POINT_VERTEX = /* glsl */ `
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uColor;
varying vec3 vColor;

void main() {
  vColor = uColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * uPixelRatio * (280.0 / max(-mvPosition.z, 1.0));
  gl_Position = projectionMatrix * mvPosition;
}
`

const POINT_FRAGMENT = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vColor, alpha * uOpacity);
}
`

export interface PointMaterialOptions {
  color: THREE.ColorRepresentation
  size: number
  opacity?: number
  pixelRatio: number
}

export function createPointMaterial({
  color,
  size,
  opacity = 0.95,
  pixelRatio,
}: PointMaterialOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSize: { value: size },
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: opacity },
    },
    vertexShader: POINT_VERTEX,
    fragmentShader: POINT_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
}

export function createLineMaterial(
  color: THREE.ColorRepresentation,
  opacity = 0.16,
): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

export function updatePointMaterial(
  material: THREE.ShaderMaterial,
  color: THREE.ColorRepresentation,
  size: number,
  pixelRatio: number,
): void {
  material.uniforms.uColor!.value.set(color)
  material.uniforms.uSize!.value = size
  material.uniforms.uPixelRatio!.value = pixelRatio
}

export const FULLSCREEN_FRAGMENT_PREFIX = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
varying vec2 vUv;
`

export const FULLSCREEN_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

import * as THREE from 'three'

export const FULLSCREEN_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export interface FullscreenPass {
  readonly mesh: THREE.Mesh
  readonly geometry: THREE.PlaneGeometry
  readonly material: THREE.ShaderMaterial
  readonly uniforms: Record<string, THREE.IUniform>
}

/**
 * A single fullscreen triangle-plane. The vertex shader writes clip-space
 * positions directly, so the mesh ignores the camera and costs one draw call.
 */
export function createFullscreenPass(
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform>,
  vertexShader: string = FULLSCREEN_VERTEX_SHADER,
): FullscreenPass {
  const geometry = new THREE.PlaneGeometry(2, 2)
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  return { mesh, geometry, material, uniforms }
}

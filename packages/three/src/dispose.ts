import * as THREE from 'three'

function isTexture(value: unknown): value is THREE.Texture {
  return Boolean(value && typeof value === 'object' && 'isTexture' in value)
}

function disposeValue(value: unknown): void {
  if (isTexture(value)) {
    value.dispose()
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) disposeValue(item)
  }
}

function disposeMaterial(material: THREE.Material): void {
  for (const value of Object.values(material)) disposeValue(value)
  const uniforms = (material as THREE.ShaderMaterial).uniforms
  if (uniforms) {
    for (const uniform of Object.values(uniforms)) disposeValue(uniform?.value)
  }
  material.dispose()
}

/**
 * Deep-disposes geometry, materials, and textures under an Object3D.
 * Safe to call twice: three's dispose methods are idempotent.
 */
export function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((object) => {
    const geometry = (object as THREE.Mesh).geometry
    if (geometry) geometry.dispose()
    const material = (object as THREE.Mesh).material
    if (Array.isArray(material)) {
      for (const item of material) disposeMaterial(item)
    } else if (material) {
      disposeMaterial(material)
    }
  })
}

export function disposeScene(scene: THREE.Scene): void {
  disposeObject3D(scene)
  scene.clear()
}

export function disposeRenderTarget(target: THREE.WebGLRenderTarget): void {
  target.dispose()
}

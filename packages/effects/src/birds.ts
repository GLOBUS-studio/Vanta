import * as THREE from 'three'
import { defineEffect, type EffectInstance } from '@vantajs2/core'
import { createThreeLayer, disposeScene } from '@vantajs2/three'
import { isCoarsePointer, mulberry32 } from './_shared.js'

const SKY_VERTEX = /* glsl */ `
varying float vY;
void main() {
  vY = normalize(position).y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const SKY_FRAGMENT = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uBottom;
varying float vY;
void main() {
  vec3 color = mix(uBottom, uTop, smoothstep(-0.8, 0.8, vY));
  gl_FragColor = vec4(color, 1.0);
}
`

export interface BirdsOptions {
  backgroundColor: THREE.ColorRepresentation
  backgroundAlpha: number
  color1: THREE.ColorRepresentation
  color2: THREE.ColorRepresentation
  birdSize: number
  wingSpan: number
  speedLimit: number
  separation: number
  alignment: number
  cohesion: number
  quantity: number
  seed: number
}

const defaults: BirdsOptions = {
  backgroundColor: 0x07192f,
  backgroundAlpha: 1,
  color1: 0xff0000,
  color2: 0x00d1ff,
  birdSize: 1,
  wingSpan: 30,
  speedLimit: 5,
  separation: 20,
  alignment: 20,
  cohesion: 20,
  quantity: 5,
  seed: 31,
}

function createBirdGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [-0.72, 0, -0.18, 0, 0, 0.5, 0, 0, -0.28, 0.72, 0, -0.18, 0, 0, 0.5, 0, 0, -0.28],
      3,
    ),
  )
  geometry.computeVertexNormals()
  return geometry
}

export const birds = defineEffect<BirdsOptions>({
  name: 'birds',
  defaults,

  setup(host, options): EffectInstance<BirdsOptions> {
    const layer = createThreeLayer(host, {
      clearColor: options.backgroundColor,
      clearAlpha: options.backgroundAlpha,
    })

    const camera = new THREE.PerspectiveCamera(
      55,
      host.size.width / Math.max(host.size.height, 1),
      0.1,
      500,
    )
    camera.position.set(0, 0, 60)
    camera.lookAt(0, 0, 0)
    layer.setCamera(camera)

    const skyUniforms = {
      uTop: {
        value: new THREE.Color(options.backgroundColor).lerp(new THREE.Color(options.color1), 0.15),
      },
      uBottom: {
        value: new THREE.Color(options.backgroundColor).multiplyScalar(0.7),
      },
    }
    const skyGeometry = new THREE.SphereGeometry(180, 32, 16)
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: skyUniforms,
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      side: THREE.BackSide,
      depthWrite: false,
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    layer.scene.add(sky)

    const random = mulberry32(options.seed)
    const mobile = isCoarsePointer()
    const count = Math.max(
      40,
      Math.min(260, Math.round(options.quantity * 36 * (mobile ? 0.65 : 1))),
    )
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = random() * Math.PI * 2
      const phi = Math.acos(2 * random() - 1)
      const radius = 8 + random() * 14
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.75
      positions[i * 3 + 2] = Math.cos(phi) * radius
      const speed = 1.4 + random() * 1.8
      const vTheta = random() * Math.PI * 2
      const vPhi = Math.acos(2 * random() - 1)
      velocities[i * 3] = Math.sin(vPhi) * Math.cos(vTheta) * speed
      velocities[i * 3 + 1] = Math.sin(vPhi) * Math.sin(vTheta) * speed
      velocities[i * 3 + 2] = Math.cos(vPhi) * speed
      phases[i] = random() * Math.PI * 2
      scales[i] = 1.05 + random() * 0.85
    }

    const geometry = createBirdGeometry()
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    })
    const mesh = new THREE.InstancedMesh(geometry, material, count)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.frustumCulled = false
    layer.scene.add(mesh)

    const colorA = new THREE.Color(options.color1)
    const colorB = new THREE.Color(options.color2)
    const tempColor = new THREE.Color()
    const applyColors = (next: Readonly<BirdsOptions>): void => {
      colorA.set(next.color1)
      colorB.set(next.color2)
      for (let i = 0; i < count; i++) {
        const height = (positions[i * 3 + 1]! + 22) / 44
        const mix = Math.max(0, Math.min(1, height))
        tempColor.copy(colorA).lerp(colorB, 0.15 + mix * 0.55)
        mesh.setColorAt(i, tempColor)
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }

    const dummy = new THREE.Object3D()
    const target = new THREE.Vector3()
    let current: Readonly<BirdsOptions> = options

    const applyOptions = (next: Readonly<BirdsOptions>): void => {
      current = next
      colorA.set(next.color1)
      colorB.set(next.color2)
      applyColors(next)
      skyUniforms.uTop.value.set(next.backgroundColor).lerp(new THREE.Color(next.color1), 0.15)
      skyUniforms.uBottom.value.set(next.backgroundColor).multiplyScalar(0.7)
      layer.renderer.setClearColor(next.backgroundColor, next.backgroundAlpha)
    }
    applyOptions(options)

    let targetX = 0
    let targetY = 0

    return {
      resize(size) {
        camera.aspect = size.width / Math.max(size.height, 1)
        camera.updateProjectionMatrix()
        layer.resize(size)
      },
      render(frame) {
        const dt = Math.min(frame.delta, 0.05)
        const step = dt * 60
        const maxSpeed = Math.max(0.5, current.speedLimit)
        const sepRadius2 = 49
        const aliRadius2 = 225
        const cohRadius2 = 400
        const sepWeight = current.separation * 0.024
        const aliWeight = current.alignment * 0.006
        const cohWeight = current.cohesion * 0.0012
        const flockX = Math.sin(frame.time * 0.35) * 15
        const flockY = Math.cos(frame.time * 0.41) * 8
        const flockZ = Math.sin(frame.time * 0.27) * 11

        if (dt > 0) {
          for (let i = 0; i < count; i++) {
            const ix = i * 3
            let sepX = 0
            let sepY = 0
            let sepZ = 0
            let aliX = 0
            let aliY = 0
            let aliZ = 0
            let cohX = 0
            let cohY = 0
            let cohZ = 0
            let sepCount = 0
            let aliCount = 0
            let cohCount = 0

            for (let j = 0; j < count; j++) {
              if (i === j) continue
              const jx = j * 3
              const dx = positions[jx]! - positions[ix]!
              const dy = positions[jx + 1]! - positions[ix + 1]!
              const dz = positions[jx + 2]! - positions[ix + 2]!
              const d2 = dx * dx + dy * dy + dz * dz
              if (d2 === 0) continue
              if (d2 < cohRadius2) {
                cohX += dx
                cohY += dy
                cohZ += dz
                cohCount++
              }
              if (d2 < aliRadius2) {
                aliX += velocities[jx]!
                aliY += velocities[jx + 1]!
                aliZ += velocities[jx + 2]!
                aliCount++
              }
              if (d2 < sepRadius2) {
                const inv = 1 / d2
                sepX -= dx * inv
                sepY -= dy * inv
                sepZ -= dz * inv
                sepCount++
              }
            }

            if (sepCount > 0) {
              sepX /= sepCount
              sepY /= sepCount
              sepZ /= sepCount
            }
            if (aliCount > 0) {
              aliX = aliX / aliCount - velocities[ix]!
              aliY = aliY / aliCount - velocities[ix + 1]!
              aliZ = aliZ / aliCount - velocities[ix + 2]!
            }
            if (cohCount > 0) {
              cohX = cohX / cohCount
              cohY = cohY / cohCount
              cohZ = cohZ / cohCount
            }

            velocities[ix]! += (sepX * sepWeight + aliX * aliWeight + cohX * cohWeight) * step
            velocities[ix + 1]! += (sepY * sepWeight + aliY * aliWeight + cohY * cohWeight) * step
            velocities[ix + 2]! += (sepZ * sepWeight + aliZ * aliWeight + cohZ * cohWeight) * step

            const px = positions[ix]!
            const py = positions[ix + 1]!
            const pz = positions[ix + 2]!
            velocities[ix]! += (flockX - px) * 0.0028 * step
            velocities[ix + 1]! += (flockY - py) * 0.0028 * step
            velocities[ix + 2]! += (flockZ - pz) * 0.0028 * step
            velocities[ix]! += -pz * 0.0012 * step
            velocities[ix + 2]! += px * 0.0012 * step

            const distance = Math.sqrt(px * px + py * py + pz * pz)
            if (distance > 24) {
              const push = 0.18 * step
              velocities[ix]! -= (px / distance) * push
              velocities[ix + 1]! -= (py / distance) * push
              velocities[ix + 2]! -= (pz / distance) * push
            }

            let vx = velocities[ix]!
            let vy = velocities[ix + 1]!
            let vz = velocities[ix + 2]!
            const speed = Math.sqrt(vx * vx + vy * vy + vz * vz)
            if (speed > maxSpeed) {
              const scale = maxSpeed / speed
              vx *= scale
              vy *= scale
              vz *= scale
            } else if (speed < 0.6) {
              vx += (random() - 0.5) * 0.2
              vy += (random() - 0.5) * 0.2
              vz += (random() - 0.5) * 0.2
            }
            velocities[ix] = vx
            velocities[ix + 1] = vy
            velocities[ix + 2] = vz
            positions[ix] = px + vx * dt
            positions[ix + 1] = py + vy * dt
            positions[ix + 2] = pz + vz * dt
          }
        }

        for (let i = 0; i < count; i++) {
          const ix = i * 3
          const px = positions[ix]!
          const py = positions[ix + 1]!
          const pz = positions[ix + 2]!
          const vx = velocities[ix]!
          const vy = velocities[ix + 1]!
          const vz = velocities[ix + 2]!
          dummy.position.set(px, py, pz)
          target.set(px + vx, py + vy, pz + vz)
          dummy.lookAt(target)
          dummy.rotateZ(Math.sin(frame.time * 6 + phases[i]!) * 0.35)
          const size = current.birdSize * scales[i]!
          dummy.scale.set(size * (current.wingSpan / 30), size, size)
          dummy.updateMatrix()
          mesh.setMatrixAt(i, dummy.matrix)
        }
        mesh.instanceMatrix.needsUpdate = true

        if (!frame.pointer.active) {
          targetX = 0
          targetY = 0
        } else {
          targetX = (frame.pointer.nx - 0.5) * 7
          targetY = (frame.pointer.ny - 0.5) * -5
        }
        camera.position.x += (targetX - camera.position.x) * 0.03
        camera.position.y += (targetY - camera.position.y) * 0.03
        camera.lookAt(0, 0, 0)
        layer.render()
      },
      setOptions(next) {
        applyOptions(next)
      },
      dispose() {
        mesh.dispose()
        disposeScene(layer.scene)
        layer.dispose()
      },
    }
  },
})

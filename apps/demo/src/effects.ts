import type { EffectDefinition } from '@vantajs2/core'
import { aurora } from '@vantajs2/effects/aurora'
import { birds } from '@vantajs2/effects/birds'
import { cells } from '@vantajs2/effects/cells'
import { clouds } from '@vantajs2/effects/clouds'
import { clouds2 } from '@vantajs2/effects/clouds2'
import { dots } from '@vantajs2/effects/dots'
import { fog } from '@vantajs2/effects/fog'
import { globe } from '@vantajs2/effects/globe'
import { halo } from '@vantajs2/effects/halo'
import { net } from '@vantajs2/effects/net'
import { rings } from '@vantajs2/effects/rings'
import { ripple } from '@vantajs2/effects/ripple'
import { topology } from '@vantajs2/effects/topology'
import { trunk } from '@vantajs2/effects/trunk'
import { waves } from '@vantajs2/effects/waves'

export interface DemoEffect {
  key: string
  name: string
  description: string
  category: 'shader' | 'geometry' | 'simulation'
  tags: string[]
  definition: EffectDefinition<any>
  options: Record<string, unknown>
}

export const effects: DemoEffect[] = [
  {
    key: 'waves',
    name: 'Waves',
    description: 'A displaced water surface with custom specular lighting and pointer parallax.',
    category: 'geometry',
    tags: ['geometry', 'lighting', 'water'],
    definition: waves,
    options: {
      color: '#072438',
      highlightColor: '#63e6ff',
      waveHeight: 2.6,
      waveSpeed: 0.9,
      waveScale: 0.17,
      zoom: 1,
    },
  },
  {
    key: 'aurora',
    name: 'Aurora',
    description: 'Domain-warped FBM curtains under a field of stars.',
    category: 'shader',
    tags: ['shader', 'fbm', 'stars'],
    definition: aurora,
    options: {
      colorA: '#030814',
      colorB: '#35f0c8',
      colorC: '#8b5cff',
      intensity: 1,
      scale: 1,
    },
  },
  {
    key: 'net',
    name: 'Net',
    description: 'A drifting point lattice connected by additive lines.',
    category: 'geometry',
    tags: ['points', 'lines', 'additive'],
    definition: net,
    options: {
      color: '#58d6ff',
      points: 10,
      spacing: 14,
      maxDistance: 22,
      pointSize: 0.85,
      drift: 1,
      seed: 7,
    },
  },
  {
    key: 'fog',
    name: 'Fog',
    description: 'Layered procedural fog with a four-color vertical ramp.',
    category: 'shader',
    tags: ['shader', 'noise', 'fog'],
    definition: fog,
    options: {
      highlightColor: '#ffc300',
      midtoneColor: '#ff1f00',
      lowlightColor: '#2d00ff',
      baseColor: '#ffebeb',
      backgroundColor: '#ffebeb',
      blurFactor: 0.6,
      zoom: 1,
      scale: 2,
    },
  },
  {
    key: 'clouds',
    name: 'Clouds',
    description: 'A sunset cloudscape with a sun disc and directional shading.',
    category: 'shader',
    tags: ['shader', 'clouds', 'sunset'],
    definition: clouds,
    options: {
      backgroundColor: '#ffffff',
      skyColor: '#68b8d7',
      cloudColor: '#adc1de',
      cloudShadowColor: '#183550',
      sunColor: '#ff9919',
      sunGlareColor: '#ff6633',
      sunlightColor: '#ff9933',
      scale: 3,
    },
  },
  {
    key: 'clouds2',
    name: 'Clouds2',
    description: 'Cosmic clouds, stars, and a cold blue palette.',
    category: 'shader',
    tags: ['shader', 'cosmic', 'stars'],
    definition: clouds2,
    options: {
      backgroundColor: '#000000',
      skyColor: '#5ca6ca',
      cloudColor: '#334d80',
      lightColor: '#ffffff',
      scale: 1.4,
    },
  },
  {
    key: 'cells',
    name: 'Cells',
    description: 'Animated Worley cells with glowing membranes.',
    category: 'shader',
    tags: ['shader', 'worley', 'organic'],
    definition: cells,
    options: {
      color1: '#008c8c',
      color2: '#f2e735',
      backgroundColor: '#d7ff8f',
      amplitudeFactor: 1,
      ringFactor: 1,
      rotationFactor: 1,
      size: 2,
    },
  },
  {
    key: 'ripple',
    name: 'Ripple',
    description: 'Pointer-driven concentric ripples on a calm surface.',
    category: 'shader',
    tags: ['shader', 'pointer', 'water'],
    definition: ripple,
    options: {
      color1: '#1b3a8a',
      color2: '#ffffff',
      backgroundColor: '#f0f4ff',
      amplitudeFactor: 1,
      ringFactor: 4,
      rotationFactor: 0.1,
    },
  },
  {
    key: 'dots',
    name: 'Dots',
    description: 'A rotating Fibonacci sphere of glowing points and thin links.',
    category: 'geometry',
    tags: ['points', 'sphere', 'fibonacci'],
    definition: dots,
    options: {
      color: '#ff8820',
      color2: '#ff8820',
      backgroundColor: '#222222',
      size: 3,
      spacing: 35,
      showLines: true,
    },
  },
  {
    key: 'globe',
    name: 'Globe',
    description: 'A wireframe globe with linked nodes and an atmospheric rim.',
    category: 'geometry',
    tags: ['globe', 'wireframe', 'atmosphere'],
    definition: globe,
    options: {
      color: '#ff3f81',
      color2: '#ffffff',
      backgroundColor: '#23153c',
      size: 1,
      points: 10,
      maxDistance: 20,
      spacing: 15,
      showDots: true,
    },
  },
  {
    key: 'halo',
    name: 'Halo',
    description: 'A radial halo with rotating filaments and thin rings.',
    category: 'shader',
    tags: ['shader', 'radial', 'glow'],
    definition: halo,
    options: {
      baseColor: '#001a59',
      color2: '#f2e735',
      backgroundColor: '#131a43',
      amplitudeFactor: 1,
      ringFactor: 1,
      rotationFactor: 1,
      size: 1,
    },
  },
  {
    key: 'rings',
    name: 'Rings',
    description: 'Orbital neon rings assembled from additive, fresnel-shaded tori.',
    category: 'geometry',
    tags: ['torus', 'additive', 'orbital'],
    definition: rings,
    options: {
      backgroundColor: '#202428',
      color: '#88ff00',
      color2: '#ff2255',
      rings: 8,
      size: 1,
      seed: 11,
    },
  },
  {
    key: 'birds',
    name: 'Birds',
    description: 'A CPU boids flock rendered with instanced chevrons.',
    category: 'simulation',
    tags: ['boids', 'instancing', 'flock'],
    definition: birds,
    options: {
      backgroundColor: '#07192f',
      color1: '#ff0000',
      color2: '#00d1ff',
      birdSize: 1,
      wingSpan: 30,
      speedLimit: 5,
      separation: 20,
      alignment: 20,
      cohesion: 20,
      quantity: 5,
      seed: 31,
    },
  },
  {
    key: 'topology',
    name: 'Topology',
    description: 'An animated wireframe topographic landscape.',
    category: 'geometry',
    tags: ['wireframe', 'terrain', 'shader'],
    definition: topology,
    options: {
      color: '#89964e',
      backgroundColor: '#002222',
      density: 1,
      scale: 1,
    },
  },
  {
    key: 'trunk',
    name: 'Trunk',
    description: 'A recursive fractal tree with glowing tips and a slow sway.',
    category: 'simulation',
    tags: ['fractal', 'tree', 'lines'],
    definition: trunk,
    options: {
      color: '#98465f',
      backgroundColor: '#222426',
      spacing: 0,
      chaos: 1,
      density: 1,
      seed: 23,
    },
  },
]

export const effectByKey = new Map(effects.map((effect) => [effect.key, effect]))

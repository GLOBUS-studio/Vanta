import { createEffect, type EffectDefinition, type EffectHandle } from '@vantajs2/core'
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
import './style.css'

type EffectKey =
  | 'waves'
  | 'aurora'
  | 'net'
  | 'fog'
  | 'clouds'
  | 'clouds2'
  | 'cells'
  | 'ripple'
  | 'dots'
  | 'globe'
  | 'halo'
  | 'rings'
  | 'birds'
  | 'topology'
  | 'trunk'

type StateValue = string | number | boolean
type EffectState = Record<string, StateValue>

interface ControlDef {
  key: string
  label: string
  type: 'color' | 'range' | 'toggle'
  min?: number
  max?: number
  step?: number
}

interface EffectEntry {
  label: string
  definition: EffectDefinition<any>
  state: EffectState
  controls: ControlDef[]
}

const registry: Record<EffectKey, EffectEntry> = {
  waves: {
    label: 'Waves',
    definition: waves,
    state: {
      color: '#072438',
      highlightColor: '#63e6ff',
      waveHeight: 2.6,
      waveSpeed: 0.9,
      waveScale: 0.17,
      zoom: 1,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color', label: 'Deep color', type: 'color' },
      { key: 'highlightColor', label: 'Crest color', type: 'color' },
      { key: 'waveHeight', label: 'Wave height', type: 'range', min: 0.4, max: 3, step: 0.1 },
      { key: 'waveSpeed', label: 'Wave speed', type: 'range', min: 0.1, max: 2, step: 0.1 },
      { key: 'waveScale', label: 'Wave scale', type: 'range', min: 0.04, max: 0.3, step: 0.01 },
      { key: 'zoom', label: 'Camera zoom', type: 'range', min: 0.6, max: 1.6, step: 0.05 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  aurora: {
    label: 'Aurora',
    definition: aurora,
    state: {
      colorA: '#030814',
      colorB: '#35f0c8',
      colorC: '#8b5cff',
      intensity: 1,
      scale: 1,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'colorA', label: 'Depth', type: 'color' },
      { key: 'colorB', label: 'Signal', type: 'color' },
      { key: 'colorC', label: 'Curtain', type: 'color' },
      { key: 'intensity', label: 'Intensity', type: 'range', min: 0.4, max: 1.8, step: 0.05 },
      { key: 'scale', label: 'Noise scale', type: 'range', min: 0.6, max: 1.8, step: 0.05 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  net: {
    label: 'Net',
    definition: net,
    state: {
      color: '#58d6ff',
      points: 10,
      spacing: 14,
      maxDistance: 22,
      pointSize: 0.85,
      drift: 1,
      seed: 7,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color', label: 'Signal color', type: 'color' },
      { key: 'pointSize', label: 'Point size', type: 'range', min: 0.3, max: 1.6, step: 0.05 },
      { key: 'drift', label: 'Drift', type: 'range', min: 0, max: 2.5, step: 0.05 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  fog: {
    label: 'Fog',
    definition: fog,
    state: {
      highlightColor: '#ffc300',
      midtoneColor: '#ff1f00',
      lowlightColor: '#2d00ff',
      baseColor: '#ffebeb',
      backgroundColor: '#ffebeb',
      blurFactor: 0.6,
      zoom: 1,
      scale: 2,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'highlightColor', label: 'Highlight', type: 'color' },
      { key: 'midtoneColor', label: 'Midtone', type: 'color' },
      { key: 'lowlightColor', label: 'Lowlight', type: 'color' },
      { key: 'baseColor', label: 'Base', type: 'color' },
      { key: 'blurFactor', label: 'Blur', type: 'range', min: 0, max: 1, step: 0.05 },
      { key: 'zoom', label: 'Zoom', type: 'range', min: 0.5, max: 2, step: 0.05 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  clouds: {
    label: 'Clouds',
    definition: clouds,
    state: {
      backgroundColor: '#ffffff',
      skyColor: '#68b8d7',
      cloudColor: '#adc1de',
      cloudShadowColor: '#183550',
      sunColor: '#ff9919',
      sunGlareColor: '#ff6633',
      sunlightColor: '#ff9933',
      scale: 3,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'skyColor', label: 'Sky', type: 'color' },
      { key: 'cloudColor', label: 'Cloud', type: 'color' },
      { key: 'cloudShadowColor', label: 'Cloud shadow', type: 'color' },
      { key: 'sunColor', label: 'Sun', type: 'color' },
      { key: 'sunGlareColor', label: 'Sun glare', type: 'color' },
      { key: 'sunlightColor', label: 'Sunlight', type: 'color' },
      { key: 'scale', label: 'Cloud scale', type: 'range', min: 1, max: 6, step: 0.1 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  clouds2: {
    label: 'Clouds2',
    definition: clouds2,
    state: {
      backgroundColor: '#000000',
      skyColor: '#5ca6ca',
      cloudColor: '#334d80',
      lightColor: '#ffffff',
      scale: 1.4,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'skyColor', label: 'Sky', type: 'color' },
      { key: 'cloudColor', label: 'Cloud', type: 'color' },
      { key: 'lightColor', label: 'Light', type: 'color' },
      { key: 'scale', label: 'Noise scale', type: 'range', min: 0.6, max: 4, step: 0.1 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  cells: {
    label: 'Cells',
    definition: cells,
    state: {
      color1: '#008c8c',
      color2: '#f2e735',
      backgroundColor: '#d7ff8f',
      amplitudeFactor: 1,
      ringFactor: 1,
      rotationFactor: 1,
      size: 2,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color1', label: 'Cell', type: 'color' },
      { key: 'color2', label: 'Membrane', type: 'color' },
      { key: 'backgroundColor', label: 'Background', type: 'color' },
      { key: 'amplitudeFactor', label: 'Amplitude', type: 'range', min: 0, max: 2, step: 0.05 },
      { key: 'ringFactor', label: 'Rings', type: 'range', min: 0.2, max: 3, step: 0.1 },
      { key: 'rotationFactor', label: 'Rotation', type: 'range', min: 0, max: 3, step: 0.1 },
      { key: 'size', label: 'Cell size', type: 'range', min: 0.5, max: 4, step: 0.1 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  ripple: {
    label: 'Ripple',
    definition: ripple,
    state: {
      color1: '#1b3a8a',
      color2: '#ffffff',
      backgroundColor: '#f0f4ff',
      amplitudeFactor: 1,
      ringFactor: 4,
      rotationFactor: 0.1,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color1', label: 'Trough', type: 'color' },
      { key: 'color2', label: 'Crest', type: 'color' },
      { key: 'backgroundColor', label: 'Background', type: 'color' },
      { key: 'amplitudeFactor', label: 'Amplitude', type: 'range', min: 0, max: 2, step: 0.05 },
      { key: 'ringFactor', label: 'Frequency', type: 'range', min: 1, max: 10, step: 0.1 },
      {
        key: 'rotationFactor',
        label: 'Rotation',
        type: 'range',
        min: -1,
        max: 1,
        step: 0.05,
      },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  dots: {
    label: 'Dots',
    definition: dots,
    state: {
      color: '#ff8820',
      color2: '#ff8820',
      backgroundColor: '#222222',
      size: 3,
      spacing: 35,
      showLines: true,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color', label: 'Dot color', type: 'color' },
      { key: 'color2', label: 'Line color', type: 'color' },
      { key: 'size', label: 'Dot size', type: 'range', min: 0.5, max: 8, step: 0.1 },
      { key: 'showLines', label: 'Show lines', type: 'toggle' },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  globe: {
    label: 'Globe',
    definition: globe,
    state: {
      color: '#ff3f81',
      color2: '#ffffff',
      backgroundColor: '#23153c',
      size: 1,
      points: 10,
      maxDistance: 20,
      spacing: 15,
      showDots: true,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color', label: 'Points', type: 'color' },
      { key: 'color2', label: 'Atmosphere', type: 'color' },
      { key: 'showDots', label: 'Show points', type: 'toggle' },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  halo: {
    label: 'Halo',
    definition: halo,
    state: {
      baseColor: '#001a59',
      color2: '#f2e735',
      backgroundColor: '#131a43',
      amplitudeFactor: 1,
      ringFactor: 1,
      rotationFactor: 1,
      xOffset: 0,
      yOffset: 0,
      size: 1,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'baseColor', label: 'Core', type: 'color' },
      { key: 'color2', label: 'Halo', type: 'color' },
      { key: 'backgroundColor', label: 'Background', type: 'color' },
      { key: 'amplitudeFactor', label: 'Amplitude', type: 'range', min: 0, max: 2, step: 0.05 },
      { key: 'ringFactor', label: 'Rings', type: 'range', min: 0.2, max: 3, step: 0.1 },
      { key: 'rotationFactor', label: 'Rotation', type: 'range', min: 0, max: 3, step: 0.1 },
      { key: 'size', label: 'Size', type: 'range', min: 0.4, max: 2, step: 0.05 },
      { key: 'xOffset', label: 'X offset', type: 'range', min: -0.4, max: 0.4, step: 0.02 },
      { key: 'yOffset', label: 'Y offset', type: 'range', min: -0.4, max: 0.4, step: 0.02 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  rings: {
    label: 'Rings',
    definition: rings,
    state: {
      backgroundColor: '#202428',
      color: '#88ff00',
      color2: '#ff2255',
      rings: 8,
      size: 1,
      speed: 1,
      seed: 11,
      mouseControls: true,
    },
    controls: [
      { key: 'color', label: 'Ring A', type: 'color' },
      { key: 'color2', label: 'Ring B', type: 'color' },
      { key: 'size', label: 'Size', type: 'range', min: 0.4, max: 2, step: 0.05 },
      { key: 'speed', label: 'Rotation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  birds: {
    label: 'Birds',
    definition: birds,
    state: {
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
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color1', label: 'Color A', type: 'color' },
      { key: 'color2', label: 'Color B', type: 'color' },
      { key: 'backgroundColor', label: 'Sky', type: 'color' },
      { key: 'birdSize', label: 'Bird size', type: 'range', min: 0.3, max: 2.5, step: 0.05 },
      { key: 'wingSpan', label: 'Wing span', type: 'range', min: 10, max: 55, step: 1 },
      { key: 'speedLimit', label: 'Speed limit', type: 'range', min: 1, max: 12, step: 0.5 },
      { key: 'separation', label: 'Separation', type: 'range', min: 0, max: 40, step: 1 },
      { key: 'alignment', label: 'Alignment', type: 'range', min: 0, max: 40, step: 1 },
      { key: 'cohesion', label: 'Cohesion', type: 'range', min: 0, max: 40, step: 1 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  topology: {
    label: 'Topology',
    definition: topology,
    state: {
      color: '#89964e',
      backgroundColor: '#002222',
      density: 1,
      scale: 1,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color', label: 'Line color', type: 'color' },
      { key: 'backgroundColor', label: 'Background', type: 'color' },
      { key: 'scale', label: 'Amplitude', type: 'range', min: 0.2, max: 3, step: 0.05 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },

  trunk: {
    label: 'Trunk',
    definition: trunk,
    state: {
      color: '#98465f',
      backgroundColor: '#222426',
      spacing: 0,
      chaos: 1,
      density: 1,
      seed: 23,
      speed: 1,
      mouseControls: true,
    },
    controls: [
      { key: 'color', label: 'Branch color', type: 'color' },
      { key: 'backgroundColor', label: 'Background', type: 'color' },
      { key: 'chaos', label: 'Sway', type: 'range', min: 0, max: 2, step: 0.05 },
      { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
      { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
    ],
  },
}

const fallbackBackground =
  'radial-gradient(80% 70% at 30% 20%, rgba(88,214,255,.16), transparent), #050b14'

const stage = document.querySelector<HTMLDivElement>('#stage')!
const tabsEl = document.querySelector<HTMLDivElement>('#effect-tabs')!
const controlsEl = document.querySelector<HTMLDivElement>('#controls')!
const codeEl = document.querySelector<HTMLElement>('#code')!
const effectNameEl = document.querySelector<HTMLElement>('#effect-name')!
const fallbackEl = document.querySelector<HTMLElement>('#fallback')!
const pauseBtn = document.querySelector<HTMLButtonElement>('#pause')!
const recreateBtn = document.querySelector<HTMLButtonElement>('#recreate')!
const liveDot = document.querySelector<HTMLElement>('#live-dot')!
const statFps = document.querySelector<HTMLElement>('#stat-fps')!
const statDpr = document.querySelector<HTMLElement>('#stat-dpr')!
const statQuality = document.querySelector<HTMLElement>('#stat-quality')!
const previewEl = document.querySelector<HTMLDivElement>('#preview')!

let currentKey: EffectKey = 'waves'
let current: EffectHandle<any> | null = null
let previewEffect: EffectHandle<any> | null = null
let paused = false

function formatValue(value: number, step?: number): string {
  if (!step) return String(value)
  if (step < 0.1) return value.toFixed(2)
  if (step < 1) return value.toFixed(1)
  return value.toFixed(0)
}

function updateOption(key: string, value: StateValue): void {
  registry[currentKey].state[key] = value
  current?.setOptions({ [key]: value })
  renderCode(currentKey)
}

function renderControls(key: EffectKey): void {
  const entry = registry[key]
  controlsEl.innerHTML = ''
  for (const def of entry.controls) {
    const value = entry.state[def.key] ?? 0
    const row = document.createElement('div')
    row.className = 'control'

    if (def.type === 'toggle') {
      row.classList.add('toggle-row')
      const label = document.createElement('span')
      label.className = 'control-label'
      label.textContent = def.label

      const switchEl = document.createElement('label')
      switchEl.className = 'switch'
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.checked = Boolean(value)
      input.setAttribute('aria-label', def.label)
      input.addEventListener('change', () => updateOption(def.key, input.checked))
      const track = document.createElement('span')
      track.className = 'switch-track'
      switchEl.append(input, track)
      row.append(label, switchEl)
      controlsEl.append(row)
      continue
    }

    const head = document.createElement('div')
    head.className = 'control-head'
    const label = document.createElement('span')
    label.className = 'control-label'
    label.textContent = def.label
    head.append(label)

    if (def.type === 'color') {
      const color = document.createElement('div')
      color.className = 'color-control'
      const input = document.createElement('input')
      input.type = 'color'
      input.value = String(value)
      input.setAttribute('aria-label', def.label)
      const hex = document.createElement('span')
      hex.className = 'color-hex'
      hex.textContent = String(value)
      input.addEventListener('input', () => {
        hex.textContent = input.value
        updateOption(def.key, input.value)
      })
      color.append(input, hex)
      row.append(head, color)
    } else {
      const valueEl = document.createElement('span')
      valueEl.className = 'control-value'
      valueEl.textContent = formatValue(Number(value), def.step)
      head.append(valueEl)

      const input = document.createElement('input')
      input.type = 'range'
      input.setAttribute('aria-label', def.label)
      input.min = String(def.min ?? 0)
      input.max = String(def.max ?? 1)
      input.step = String(def.step ?? 0.01)
      input.value = String(value)
      input.addEventListener('input', () => {
        const next = Number(input.value)
        valueEl.textContent = formatValue(next, def.step)
        updateOption(def.key, next)
      })
      row.append(head, input)
    }
    controlsEl.append(row)
  }
}

function renderCode(key: EffectKey): void {
  const entries = Object.entries(registry[key].state)
  const lines = [
    `import { ${key} } from '@vantajs2/effects/${key}'`,
    '',
    `const effect = ${key}({`,
    "  el: '#hero',",
    ...entries.map(
      ([option, value]) =>
        `  ${option}: ${typeof value === 'string' ? `'${value}'` : String(value)},`,
    ),
    '})',
    '',
    '// later',
    'effect.destroy()',
  ]
  codeEl.textContent = lines.join('\n')
}

function initTabs(): void {
  for (const [key, entry] of Object.entries(registry) as Array<[EffectKey, EffectEntry]>) {
    const tab = document.createElement('button')
    tab.className = 'tab'
    tab.dataset.effect = key
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-selected', 'false')
    tab.textContent = entry.label
    tab.addEventListener('click', () => {
      if (key === currentKey) return
      currentKey = key
      mount(key)
    })
    tabsEl.append(tab)
  }
}

function updateTabs(key: EffectKey): void {
  for (const tab of tabsEl.querySelectorAll<HTMLButtonElement>('.tab')) {
    const active = tab.dataset.effect === key
    tab.classList.toggle('active', active)
    tab.setAttribute('aria-selected', String(active))
    if (active) {
      const left = tab.offsetLeft - tabsEl.clientWidth / 2 + tab.clientWidth / 2
      tabsEl.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
    }
  }
}

function mount(key: EffectKey): void {
  current?.destroy()
  current = null
  paused = false
  pauseBtn.textContent = 'Ⅱ'
  liveDot.classList.remove('paused')
  effectNameEl.textContent = registry[key].label.toUpperCase()

  try {
    current = createEffect(registry[key].definition, {
      el: stage,
      ...registry[key].state,
      fallback: fallbackBackground,
    })
  } catch (error) {
    console.error(error)
    fallbackEl.hidden = false
    return
  }

  fallbackEl.hidden = current.supported
  if (!current.supported) {
    effectNameEl.textContent = 'FALLBACK'
  }
  current.on('error', (error: Error) => {
    console.error(error)
    fallbackEl.hidden = false
  })

  renderControls(key)
  renderCode(key)
  updateTabs(key)
}

function setPaused(next: boolean): void {
  if (!current) return
  paused = next
  if (paused) current.pause()
  else current.resume()
  pauseBtn.textContent = paused ? '▶' : 'Ⅱ'
  pauseBtn.setAttribute('aria-label', paused ? 'Resume' : 'Pause')
  liveDot.classList.toggle('paused', paused)
}

async function copyText(text: string, button: HTMLElement): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    const previous = button.textContent
    button.textContent = 'Copied'
    button.classList.add('copied')
    window.setTimeout(() => {
      button.textContent = previous
      button.classList.remove('copied')
    }, 1400)
  } catch {
    button.textContent = 'Press ⌘C'
  }
}

function mountPreview(): void {
  previewEffect?.destroy()
  previewEffect = createEffect(aurora, {
    el: previewEl,
    colorA: '#030814',
    colorB: '#35f0c8',
    colorC: '#8b5cff',
    intensity: 1.1,
    scale: 1.1,
    speed: 0.6,
    quality: 0.9,
    autoPause: true,
    fallback: fallbackBackground,
  })
  previewEffect.on('error', (error) => console.error(error))
}

pauseBtn.addEventListener('click', () => setPaused(!paused))
recreateBtn.addEventListener('click', () => mount(currentKey))
document.querySelector('#copy-code')?.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLElement
  void copyText(codeEl.textContent ?? '', button)
})
document.querySelectorAll<HTMLElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', () => {
    void copyText(button.dataset.copy ?? '', button)
  })
})

window.setInterval(() => {
  if (!current) return
  statFps.textContent = current.stats.fps ? String(current.stats.fps) : '–'
  statDpr.textContent = current.stats.dpr.toFixed(2)
  statQuality.textContent = `${Math.round(current.stats.quality * 100)}%`
}, 500)

const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  revealEls.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 60, 240)}ms`
    observer.observe(el)
  })
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'))
}

initTabs()
mount(currentKey)
mountPreview()

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    current?.destroy()
    previewEffect?.destroy()
  })
}

import { createEffect, type EffectHandle } from '@vantajs2/core'
import { aurora, type AuroraOptions } from '@vantajs2/effects/aurora'
import { net, type NetOptions } from '@vantajs2/effects/net'
import { waves, type WavesOptions } from '@vantajs2/effects/waves'
import './style.css'

type EffectKey = 'waves' | 'aurora' | 'net'
type EffectState = Record<string, string | number | boolean>

const state: Record<EffectKey, EffectState> = {
  waves: {
    color: '#072438',
    highlightColor: '#63e6ff',
    waveHeight: 2.6,
    waveSpeed: 0.9,
    waveScale: 0.17,
    zoom: 1,
    speed: 1,
    mouseControls: true,
  },
  aurora: {
    colorA: '#030814',
    colorB: '#35f0c8',
    colorC: '#8b5cff',
    intensity: 1,
    scale: 1,
    speed: 1,
    mouseControls: true,
  },
  net: {
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
}

interface ControlDef {
  key: string
  label: string
  type: 'color' | 'range' | 'toggle'
  min?: number
  max?: number
  step?: number
}

const controlConfig: Record<EffectKey, ControlDef[]> = {
  waves: [
    { key: 'color', label: 'Deep color', type: 'color' },
    { key: 'highlightColor', label: 'Crest color', type: 'color' },
    { key: 'waveHeight', label: 'Wave height', type: 'range', min: 0.4, max: 3, step: 0.1 },
    { key: 'waveSpeed', label: 'Wave speed', type: 'range', min: 0.1, max: 2, step: 0.1 },
    { key: 'waveScale', label: 'Wave scale', type: 'range', min: 0.04, max: 0.3, step: 0.01 },
    { key: 'zoom', label: 'Camera zoom', type: 'range', min: 0.6, max: 1.6, step: 0.05 },
    { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
    { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
  ],
  aurora: [
    { key: 'colorA', label: 'Depth', type: 'color' },
    { key: 'colorB', label: 'Signal', type: 'color' },
    { key: 'colorC', label: 'Curtain', type: 'color' },
    { key: 'intensity', label: 'Intensity', type: 'range', min: 0.4, max: 1.8, step: 0.05 },
    { key: 'scale', label: 'Noise scale', type: 'range', min: 0.6, max: 1.8, step: 0.05 },
    { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
    { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
  ],
  net: [
    { key: 'color', label: 'Signal color', type: 'color' },
    { key: 'pointSize', label: 'Point size', type: 'range', min: 0.3, max: 1.6, step: 0.05 },
    { key: 'drift', label: 'Drift', type: 'range', min: 0, max: 2.5, step: 0.05 },
    { key: 'speed', label: 'Animation speed', type: 'range', min: 0.2, max: 2, step: 0.1 },
    { key: 'mouseControls', label: 'Pointer input', type: 'toggle' },
  ],
}

const fallbackBackground =
  'radial-gradient(80% 70% at 30% 20%, rgba(88,214,255,.16), transparent), #050b14'

const stage = document.querySelector<HTMLDivElement>('#stage')!
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

function updateOption(key: string, value: string | number | boolean): void {
  state[currentKey][key] = value
  current?.setOptions({ [key]: value })
  renderCode(currentKey)
}

function renderControls(key: EffectKey): void {
  controlsEl.innerHTML = ''
  for (const def of controlConfig[key]) {
    const value = state[key][def.key] ?? 0
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
  const entries = Object.entries(state[key])
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

function mount(key: EffectKey): void {
  current?.destroy()
  current = null
  paused = false
  pauseBtn.textContent = 'Ⅱ'
  liveDot.classList.remove('paused')
  effectNameEl.textContent = key.toUpperCase()

  try {
    if (key === 'waves') {
      current = createEffect(waves, {
        el: stage,
        ...(state.waves as unknown as WavesOptions),
        fallback: fallbackBackground,
      })
    } else if (key === 'aurora') {
      current = createEffect(aurora, {
        el: stage,
        ...(state.aurora as unknown as AuroraOptions),
        fallback: fallbackBackground,
      })
    } else {
      current = createEffect(net, {
        el: stage,
        ...(state.net as unknown as NetOptions),
        fallback: fallbackBackground,
      })
    }
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
  document.querySelectorAll<HTMLButtonElement>('.tab').forEach((tab) => {
    const active = tab.dataset.effect === key
    tab.classList.toggle('active', active)
    tab.setAttribute('aria-selected', String(active))
  })
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

document.querySelectorAll<HTMLButtonElement>('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.effect as EffectKey
    if (key === currentKey) return
    currentKey = key
    mount(key)
  })
})

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

mount(currentKey)
mountPreview()

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    current?.destroy()
    previewEffect?.destroy()
  })
}

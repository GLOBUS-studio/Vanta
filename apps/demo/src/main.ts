import { createEffect, type EffectHandle } from '@vantajs2/core'
import { effectByKey, effects } from './effects.js'
import './style.css'

const fallback = 'radial-gradient(80% 70% at 30% 20%, rgba(88,214,255,.16), transparent), #050b14'

const heroStage = document.querySelector<HTMLElement>('#hero-canvas')!
const grid = document.querySelector<HTMLElement>('#grid')!
const header = document.querySelector<HTMLElement>('.site-header')!
const waves = effectByKey.get('waves')!

const hero: EffectHandle<any> = createEffect(waves.definition, {
  el: heroStage,
  ...waves.options,
  color: '#041a2a',
  highlightColor: '#2aa7c9',
  backgroundColor: '#020509',
  waveHeight: 2.1,
  maxPixelRatio: 1.75,
  fallback,
})
hero.on('error', (error) => console.error(error))

const mounted = new Map<string, EffectHandle<any>>()
const cards = new Map<string, HTMLElement>()
const visible = new Set<HTMLElement>()
const MAX_MOUNTED = 8

function mountCard(card: HTMLElement): void {
  const key = card.dataset.effect
  if (!key || mounted.has(key)) return
  const effect = effectByKey.get(key)
  const stage = card.querySelector<HTMLElement>('.preview')
  if (!effect || !stage) return

  try {
    const handle = createEffect(effect.definition, {
      el: stage,
      ...effect.options,
      maxPixelRatio: 1.4,
      quality: 0.9,
      fallback,
    })
    handle.on('error', (error) => console.error(error))
    mounted.set(key, handle)
    card.classList.add('is-live')
  } catch (error) {
    console.error(error)
  }
}

function unmountCard(card: HTMLElement): void {
  const key = card.dataset.effect
  if (!key) return
  mounted.get(key)?.destroy()
  mounted.delete(key)
  card.classList.remove('is-live')
}

for (const effect of effects) {
  const card = document.createElement('article')
  card.className = 'card'
  card.dataset.effect = effect.key
  card.innerHTML = `
    <div class="preview">
      <div class="preview-label">
        <span class="live"></span>
        <span>${effect.name.toUpperCase()}</span>
      </div>
    </div>
    <div class="card-body">
      <div class="card-kicker">${effect.category}</div>
      <h3>${effect.name}</h3>
      <p>${effect.description}</p>
      <div class="tags">${effect.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      <a
        class="source"
        href="https://github.com/GLOBUS-studio/Vanta/blob/v2/packages/effects/src/${effect.key}.ts"
        target="_blank"
        rel="noreferrer"
      >source ↗</a>
    </div>`
  grid.append(card)
  cards.set(effect.key, card)
}

function reconcile(): void {
  for (const [key, card] of cards) {
    if (mounted.has(key) && !visible.has(card)) unmountCard(card)
  }
  for (const card of visible) {
    if (mounted.size >= MAX_MOUNTED) break
    mountCard(card)
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const card = entry.target as HTMLElement
      if (entry.isIntersecting) {
        card.classList.add('is-visible')
        visible.add(card)
      } else {
        visible.delete(card)
      }
    }
    reconcile()
  },
  { rootMargin: '120px 0px' },
)

for (const card of cards.values()) observer.observe(card)

const updateHeader = (): void => {
  header.classList.toggle('scrolled', window.scrollY > 36)
}
window.addEventListener('scroll', updateHeader, { passive: true })
updateHeader()

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

document.querySelectorAll<HTMLElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', () => {
    void copyText(button.dataset.copy ?? '', button)
  })
})

window.addEventListener(
  'pagehide',
  () => {
    hero.destroy()
    for (const handle of mounted.values()) handle.destroy()
    mounted.clear()
  },
  { once: true },
)

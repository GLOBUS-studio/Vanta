/* Plain-script demo. No imports, no build step: `VANTA2` comes from vanta2.js. */
;(() => {
  const { catalog, mount } = window.VANTA2
  const fallback =
    'radial-gradient(80% 70% at 30% 20%, rgba(88,214,255,.16), transparent), #050b14'

  const heroStage = document.querySelector('#hero-canvas')
  const grid = document.querySelector('#grid')
  const header = document.querySelector('.site-header')
  const waves = catalog.find((effect) => effect.key === 'waves')

  const hero = mount('waves', heroStage, {
    ...waves.options,
    color: '#041a2a',
    highlightColor: '#2aa7c9',
    backgroundColor: '#020509',
    waveHeight: 2.1,
    maxPixelRatio: 1.75,
    fallback,
  })
  hero.on('error', (error) => console.error(error))

  const mounted = new Map()
  const cards = new Map()
  const visible = new Set()
  const MAX_MOUNTED = 8

  function mountCard(card) {
    const key = card.dataset.effect
    if (!key || mounted.has(key)) return
    const effect = catalog.find((item) => item.key === key)
    const stage = card.querySelector('.preview')
    if (!effect || !stage) return

    try {
      const handle = mount(key, stage, {
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

  function unmountCard(card) {
    const key = card.dataset.effect
    if (!key) return
    const handle = mounted.get(key)
    if (handle) handle.destroy()
    mounted.delete(key)
    card.classList.remove('is-live')
  }

  for (const effect of catalog) {
    const card = document.createElement('article')
    card.className = 'card'
    card.dataset.effect = effect.key
    card.innerHTML =
      '<div class="preview">' +
      '<div class="preview-label"><span class="live"></span><span>' +
      effect.name.toUpperCase() +
      '</span></div>' +
      '</div>' +
      '<div class="card-body">' +
      '<div class="card-kicker">' +
      effect.category +
      '</div>' +
      '<h3>' +
      effect.name +
      '</h3>' +
      '<p>' +
      effect.description +
      '</p>' +
      '<div class="tags">' +
      effect.tags.map((tag) => '<span>' + tag + '</span>').join('') +
      '</div>' +
      '<a class="source" href="https://github.com/GLOBUS-studio/Vanta/blob/v2/packages/effects/src/' +
      effect.key +
      '.ts" target="_blank" rel="noreferrer">source ↗</a>' +
      '</div>'
    grid.append(card)
    cards.set(effect.key, card)
  }

  function reconcile() {
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
        const card = entry.target
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

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 36)
  }
  window.addEventListener('scroll', updateHeader, { passive: true })
  updateHeader()

  async function copyText(text, button) {
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

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => {
      void copyText(button.dataset.copy || '', button)
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
})()

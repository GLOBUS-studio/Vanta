import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEffect, defineEffect } from './index.js'
import type { EffectInstance } from './types.js'

interface TestOptions {
  color: number
}

function makeContainer(width = 800, height = 600): HTMLDivElement {
  const container = document.createElement('div')
  container.style.position = 'static'
  container.innerHTML = '<p id="content">foreground</p>'
  const content = container.querySelector('#content') as HTMLElement
  content.style.position = 'static'
  document.body.append(container)
  container.getBoundingClientRect = () =>
    ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect
  return container
}

function makeDefinition() {
  const instance: EffectInstance<TestOptions> = {
    render: vi.fn(),
    resize: vi.fn(),
    setOptions: vi.fn(),
    onQualityChange: vi.fn(),
    dispose: vi.fn(),
  }
  const definition = defineEffect<TestOptions>({
    name: 'test',
    defaults: { color: 0xff0000 },
    setup: () => instance,
  })
  return { definition, instance }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('VantaEffect', () => {
  it('mounts a canvas, raises content, and renders the first frame', () => {
    const container = makeContainer()
    const content = container.querySelector('#content') as HTMLElement
    const { definition, instance } = makeDefinition()

    const effect = createEffect(definition, { el: container })

    expect(effect.supported).toBe(true)
    expect(effect.canvas.parentElement).toBe(container)
    expect(effect.canvas.classList.contains('vantajs2-canvas')).toBe(true)
    expect(effect.canvas.getAttribute('aria-hidden')).toBe('true')
    expect(container.style.position).toBe('relative')
    expect(content.style.position).toBe('relative')
    expect(content.style.zIndex).toBe('1')
    expect(instance.render).toHaveBeenCalledTimes(1)
    expect(effect.stats.frames).toBe(1)
    expect(effect.stats.dpr).toBeGreaterThan(0)

    effect.destroy()
  })

  it('updates options and forwards them to the instance', () => {
    const container = makeContainer()
    const { definition, instance } = makeDefinition()
    const effect = createEffect(definition, { el: container })

    effect.setOptions({ color: 0x00ff00 })

    expect(effect.options.color).toBe(0x00ff00)
    expect(instance.setOptions).toHaveBeenCalledWith(expect.objectContaining({ color: 0x00ff00 }))

    effect.destroy()
  })

  it('restores DOM state and is idempotent on destroy', () => {
    const container = makeContainer()
    const content = container.querySelector('#content') as HTMLElement
    content.style.position = 'absolute'
    content.style.zIndex = '7'
    const { definition, instance } = makeDefinition()
    const effect = createEffect(definition, { el: container })

    effect.destroy()
    effect.destroy()

    expect(instance.dispose).toHaveBeenCalledTimes(1)
    expect(effect.canvas.parentElement).toBeNull()
    expect(container.style.position).toBe('static')
    expect(content.style.position).toBe('absolute')
    expect(content.style.zIndex).toBe('7')
    expect(effect.stats.paused).toBe(true)
  })

  it('supports multiple instances and disposes them independently', () => {
    const firstContainer = makeContainer()
    const secondContainer = makeContainer()
    const first = makeDefinition()
    const second = makeDefinition()

    const firstEffect = createEffect(first.definition, { el: firstContainer })
    const secondEffect = createEffect(second.definition, { el: secondContainer })

    expect(firstContainer.querySelectorAll('canvas')).toHaveLength(1)
    expect(secondContainer.querySelectorAll('canvas')).toHaveLength(1)

    firstEffect.destroy()
    expect(first.instance.dispose).toHaveBeenCalledTimes(1)
    expect(second.instance.dispose).not.toHaveBeenCalled()
    expect(secondEffect.canvas.parentElement).toBe(secondContainer)

    secondEffect.destroy()
  })

  it('ignores setOptions after destroy', () => {
    const container = makeContainer()
    const { definition } = makeDefinition()
    const effect = createEffect(definition, { el: container })
    effect.destroy()
    expect(() => effect.setOptions({ color: 1 })).not.toThrow()
  })

  it('uses the fallback when WebGL2 is unavailable', () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const container = makeContainer()
    const { definition } = makeDefinition()

    const effect = createEffect(definition, {
      el: container,
      fallback: 'linear-gradient(#000, #111)',
    })

    expect(effect.supported).toBe(false)
    expect(container.style.background).toBe('linear-gradient(#000, #111)')

    effect.destroy()
    getContext.mockRestore()
  })

  it('throws for a missing element', () => {
    const { definition } = makeDefinition()
    expect(() => createEffect(definition, { el: '#missing' })).toThrow(/Cannot find element/)
  })

  it('emits ready and destroy events', async () => {
    const container = makeContainer()
    const { definition } = makeDefinition()
    const effect = createEffect(definition, { el: container })
    const onReady = vi.fn()
    const onDestroy = vi.fn()
    effect.on('ready', onReady)
    effect.on('destroy', onDestroy)

    await effect.ready
    await new Promise((resolve) => queueMicrotask(() => resolve(undefined)))
    expect(onReady).toHaveBeenCalledWith(effect)

    effect.destroy()
    expect(onDestroy).toHaveBeenCalledTimes(1)
  })
})

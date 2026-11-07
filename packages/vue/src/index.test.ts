import { defineEffect } from '@vantajs2/core'
import { createApp, h, nextTick, reactive } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Vanta } from './index.js'

const instance = {
  render: vi.fn(),
  setOptions: vi.fn(),
  dispose: vi.fn(),
}

const definition = defineEffect<{ color: number }>({
  name: 'test',
  defaults: { color: 1 },
  setup: () => instance,
})

let container: HTMLDivElement

beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.clearAllMocks()
})

describe('Vanta Vue component', () => {
  it('mounts, forwards reactive options, and destroys', async () => {
    const options = reactive({ color: 1 })
    const app = createApp({ render: () => h(Vanta, { effect: definition, options }) })
    app.mount(container)

    expect(container.querySelector('canvas')).not.toBeNull()
    expect(instance.render).toHaveBeenCalled()

    options.color = 2
    await nextTick()
    expect(instance.setOptions).toHaveBeenCalledWith(expect.objectContaining({ color: 2 }))

    app.unmount()
    expect(instance.dispose).toHaveBeenCalledTimes(1)
  })
})

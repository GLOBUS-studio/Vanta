import { defineEffect } from '@vantajs2/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { vanta } from './index.js'

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

describe('vanta Svelte action', () => {
  it('mounts, updates, and destroys', () => {
    const action = vanta(container, { effect: definition, options: { color: 1 } })

    expect(container.querySelector('canvas')).not.toBeNull()
    expect(instance.render).toHaveBeenCalled()

    action.update({ effect: definition, options: { color: 2 } })
    expect(instance.setOptions).toHaveBeenCalledWith(expect.objectContaining({ color: 2 }))

    action.destroy()
    expect(instance.dispose).toHaveBeenCalledTimes(1)
  })
})

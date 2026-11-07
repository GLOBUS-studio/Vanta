import { defineEffect } from '@vantajs2/core'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Vanta } from './index.js'

interface TestOptions {
  color: number
}

const instance = {
  render: vi.fn(),
  setOptions: vi.fn(),
  dispose: vi.fn(),
}

const definition = defineEffect<TestOptions>({
  name: 'test',
  defaults: { color: 1 },
  setup: () => instance,
})

let container: HTMLDivElement

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.clearAllMocks()
})

describe('Vanta React component', () => {
  it('mounts, forwards options, and destroys the effect', async () => {
    const root = createRoot(container)

    await act(async () => {
      root.render(<Vanta effect={definition} options={{ color: 2 }} />)
    })
    expect(container.querySelector('canvas')).not.toBeNull()
    expect(instance.render).toHaveBeenCalled()

    await act(async () => {
      root.render(<Vanta effect={definition} options={{ color: 3 }} />)
    })
    expect(instance.setOptions).toHaveBeenCalledWith(expect.objectContaining({ color: 3 }))

    await act(async () => {
      root.unmount()
    })
    expect(instance.dispose).toHaveBeenCalledTimes(1)
  })

  it('calls onReady with the handle', async () => {
    const root = createRoot(container)
    const onReady = vi.fn()
    await act(async () => {
      root.render(<Vanta effect={definition} onReady={onReady} />)
      await Promise.resolve()
    })
    expect(onReady).toHaveBeenCalledTimes(1)
    await act(async () => {
      root.unmount()
    })
  })
})

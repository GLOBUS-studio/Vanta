import { describe, expect, it } from 'vitest'
import { QualityController } from './quality.js'

function findChange(controller: QualityController, frames: number, delta: number): number | null {
  let change: number | null = null
  for (let i = 0; i < frames && change === null; i++) {
    change = controller.sample(delta)
  }
  return change
}

describe('QualityController', () => {
  it('never downgrades during the warm-up', () => {
    const controller = new QualityController(1, true)
    for (let i = 0; i < 89; i++) {
      expect(controller.sample(0.08)).toBeNull()
    }
    expect(controller.value).toBe(1)
  })

  it('downgrades after a sustained low frame rate', () => {
    const controller = new QualityController(1, true)
    const change = findChange(controller, 140, 0.03)
    expect(change).not.toBeNull()
    expect(change).toBeLessThan(1)
    expect(controller.value).toBeLessThan(1)
  })

  it('ignores a single long frame', () => {
    const controller = new QualityController(1, true)
    for (let i = 0; i < 120; i++) controller.sample(0.016)
    expect(controller.sample(0.2)).toBeNull()
    expect(controller.value).toBe(1)
  })

  it('upgrades slowly after a stable period', () => {
    const controller = new QualityController(0.7, true)
    const change = findChange(controller, 400, 0.016)
    expect(change).not.toBeNull()
    expect(change).toBeGreaterThan(0.7)
  })

  it('does nothing when adaptive quality is disabled', () => {
    const controller = new QualityController(1, false)
    expect(findChange(controller, 200, 0.05)).toBeNull()
    expect(controller.value).toBe(1)
  })
})

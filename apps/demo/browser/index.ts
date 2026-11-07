import { createEffect, type EffectOptions } from '@vantajs2/core'
import { effects, effectByKey } from '../src/effects.js'

export { createEffect }
export { effects as catalog }

export const definitions = Object.fromEntries(
  effects.map((effect) => [effect.key, effect.definition]),
)

export const version = '0.1.0'

/**
 * Plain-script API:
 *
 *   VANTA2.mount('waves', '#hero', { color: '#072438' })
 */
export function mount(
  name: string,
  el: string | HTMLElement,
  options: Record<string, unknown> = {},
) {
  const entry = effectByKey.get(name)
  if (!entry) throw new Error(`[VantaJS2] Unknown effect: ${name}`)
  return createEffect(entry.definition, {
    ...entry.options,
    ...options,
    el,
  } as unknown as EffectOptions<Record<string, unknown>>)
}

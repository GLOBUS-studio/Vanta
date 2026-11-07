import {
  createEffect,
  type EffectDefinition,
  type EffectHandle,
  type EffectOptions,
} from '@vantajs2/core'

export type VantaOptions<D extends object> = Omit<EffectOptions<D>, 'el'>

export interface VantaParams<D extends object> {
  effect: EffectDefinition<D>
  options?: VantaOptions<D>
}

export interface VantaAction<D extends object> {
  update(params: VantaParams<D>): void
  destroy(): void
}

/**
 * Svelte action. Usage:
 *
 *   <div use:vanta={{ effect: waves, options }} />
 *
 * The action creates the effect on mount, updates options through `setOptions`,
 * and destroys the effect when the node is removed.
 */
export function vanta<D extends object>(node: HTMLElement, params: VantaParams<D>): VantaAction<D> {
  let current = params
  let handle: EffectHandle<D> = createEffect(current.effect, {
    ...(current.options ?? {}),
    el: node,
  } as unknown as EffectOptions<D>)

  return {
    update(next) {
      if (next.effect !== current.effect) {
        handle.destroy()
        current = next
        handle = createEffect(next.effect, {
          ...(next.options ?? {}),
          el: node,
        } as unknown as EffectOptions<D>)
        return
      }
      current = next
      handle.setOptions((next.options ?? {}) as Parameters<EffectHandle<D>['setOptions']>[0])
    },
    destroy() {
      handle.destroy()
    },
  }
}

export default vanta

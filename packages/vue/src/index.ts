import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import {
  createEffect,
  type EffectDefinition,
  type EffectHandle,
  type EffectOptions,
} from '@vantajs2/core'

export type VantaOptions<D extends object> = Omit<EffectOptions<D>, 'el'>

/**
 * Vue 3 component. The effect lives in an onMounted/onBeforeUnmount pair,
 * so it is SSR-safe and StrictMode-equivalent safe (mount/unmount cycles).
 */
export const Vanta = defineComponent({
  name: 'Vanta',
  props: {
    effect: {
      type: Object as PropType<EffectDefinition<any>>,
      required: true,
    },
    options: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  setup(props, { slots, attrs, expose }) {
    const container = ref<HTMLElement | null>(null)
    let handle: EffectHandle<any> | null = null

    const create = (): void => {
      const element = container.value
      if (!element) return
      handle = createEffect(props.effect, {
        ...props.options,
        el: element,
      } as unknown as EffectOptions<any>)
    }

    const recreate = (): void => {
      handle?.destroy()
      handle = null
      create()
    }

    onMounted(create)
    onBeforeUnmount(() => {
      handle?.destroy()
      handle = null
    })

    watch(
      () => props.options,
      (next) => handle?.setOptions(next as never),
      { deep: true },
    )
    watch(() => props.effect, recreate)

    expose({
      get effect() {
        return handle
      },
    })

    return () => h(props.tag, { ref: container, ...attrs }, slots.default?.())
  },
})

export default Vanta

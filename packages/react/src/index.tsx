import {
  createEffect,
  type EffectDefinition,
  type EffectHandle,
  type EffectOptions,
} from '@vantajs2/core'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export type VantaOptions<D extends object> = Omit<EffectOptions<D>, 'el'>

export interface VantaProps<D extends object> {
  /** The effect definition, e.g. `waves` from `@vantajs2/effects/waves`. */
  effect: EffectDefinition<D>
  /** Effect options. Changes are forwarded through `setOptions`. */
  options?: VantaOptions<D>
  className?: string
  style?: CSSProperties
  children?: ReactNode
  /** Called once the first frame is ready (including the fallback path). */
  onReady?: (handle: EffectHandle<D>) => void
  onError?: (error: Error) => void
}

/**
 * Mounts a VantaJS2 effect in a div and tears it down on unmount.
 * The effect is created in an effect, so the component is SSR-safe.
 */
export function Vanta<D extends object>({
  effect,
  options,
  className,
  style,
  children,
  onReady,
  onError,
}: VantaProps<D>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<EffectHandle<D> | null>(null)
  const callbacksRef = useRef({ onReady, onError })
  callbacksRef.current = { onReady, onError }

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    let cancelled = false
    let offError: (() => void) | undefined
    try {
      const handle = createEffect(effect, {
        ...(options ?? {}),
        el: element,
      } as unknown as EffectOptions<D>)
      handleRef.current = handle
      offError = handle.on('error', (error) => callbacksRef.current.onError?.(error))
      void handle.ready.then(() => {
        if (!cancelled) callbacksRef.current.onReady?.(handle)
      })
    } catch (value) {
      callbacksRef.current.onError?.(value instanceof Error ? value : new Error(String(value)))
    }

    return () => {
      cancelled = true
      offError?.()
      handleRef.current?.destroy()
      handleRef.current = null
    }
    // Options are forwarded by the second effect; recreating on every option change
    // would restart the GPU context.
  }, [effect])

  useEffect(() => {
    handleRef.current?.setOptions((options ?? {}) as Parameters<EffectHandle<D>['setOptions']>[0])
  }, [options])

  return (
    <div ref={containerRef} className={className} style={style} data-vantajs2-effect={effect.name}>
      {children}
    </div>
  )
}

export default Vanta

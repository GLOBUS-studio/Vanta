# Migrating from Vanta 0.5

VantaJS2 keeps the ideas and most option names, but the API is explicit. There is
no global `VANTA`, no `window.THREE`, and no hidden runtime.

## Old

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.waves.min.js"></script>
<script>
  const effect = VANTA.WAVES({
    el: '#hero',
    color: 0x000000,
    waveHeight: 20,
  })
  effect.setOptions({ color: 0xff88cc })
  effect.destroy()
</script>
```

## New

```ts
import { createEffect } from '@vantajs2/core'
import { waves } from '@vantajs2/effects/waves'

const effect = createEffect(waves, {
  el: '#hero',
  color: '#000000',
  waveHeight: 20,
})

await effect.ready
effect.setOptions({ color: '#ff88cc' })
effect.destroy()
```

## Mapping

| Vanta 0.5                                    | VantaJS2                                |
| -------------------------------------------- | --------------------------------------- |
| `VANTA.WAVES(opts)`                          | `createEffect(waves, opts)`             |
| `VANTA.NET(opts)`                            | `createEffect(net, opts)`               |
| string / element as first argument           | `{ el: '#hero' }`                       |
| `window.THREE`                               | `three` peer dependency                 |
| `effect.setOptions()`                        | same                                    |
| `effect.resize()`                            | same                                    |
| `effect.destroy()`                           | same, now idempotent and deep           |
| default export from `vanta/dist/vanta.*.min` | named export from `@vantajs2/effects/*` |

All original effects are ported as clean-room modules behind the same contract:
`waves`, `net`, `fog`, `clouds`, `clouds2`, `cells`, `dots`, `globe`, `halo`,
`rings`, `ripple`, `birds`, `topology`, and `trunk`. The p5-based effects
(`trunk`, `topology`) were rewritten as three.js geometry/shader effects rather
than bundling p5. `aurora` is a new VantaJS2 effect.

## React

```tsx
import { useEffect, useRef } from 'react'
import { createEffect, type EffectHandle } from '@vantajs2/core'
import { waves } from '@vantajs2/effects/waves'

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const effect = useRef<EffectHandle<unknown> | null>(null)

  useEffect(() => {
    if (!ref.current) return
    effect.current = createEffect(waves, { el: ref.current })
    return () => effect.current?.destroy()
  }, [])

  return <div ref={ref} />
}
```

A dedicated `@vantajs2/react` wrapper is planned; the lifecycle above is the
entire contract it will use.

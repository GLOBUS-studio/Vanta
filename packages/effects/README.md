# @vantajs2/effects

Clean-room effects for VantaJS2.

| Effect   | Import                     |
| -------- | -------------------------- |
| `waves`  | `@vantajs2/effects/waves`  |
| `aurora` | `@vantajs2/effects/aurora` |
| `net`    | `@vantajs2/effects/net`    |

```ts
import { createEffect } from '@vantajs2/core'
import { waves } from '@vantajs2/effects/waves'

const effect = createEffect(waves, {
  el: '#hero',
  color: '#072438',
  highlightColor: '#63e6ff',
})
```

`three` is a peer dependency. Each effect is an ES module with typed options and
its own `dispose` implementation.

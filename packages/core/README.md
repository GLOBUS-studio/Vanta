# @vantajs2/core

Renderer-agnostic runtime for VantaJS2.

- one shared `requestAnimationFrame` loop;
- `ResizeObserver`, `IntersectionObserver`, `visibilitychange`;
- capped DPR and adaptive quality;
- one passive pointer listener for the whole page;
- SSR-safe imports;
- typed lifecycle and events;
- deep teardown.

```ts
import { createEffect, defineEffect } from '@vantajs2/core'

const effect = createEffect(myEffect, { el: '#hero' })
await effect.ready
effect.destroy()
```

The core has zero runtime dependencies. Renderers are adapters; see
`@vantajs2/three`.

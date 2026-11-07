# VantaJS2

Ambient 3D backgrounds for the modern web. A ground-up reincarnation of
[Vanta](https://github.com/tengbao/vanta), not a dependency bump.

> **Status: alpha.** The runtime, the three.js adapter, all fifteen clean-room
> effects, the framework wrappers, and the no-build browser bundle are
> implemented. Next: visual regression baselines, a GPU leak stress test, and
> the 1.0 API freeze.

Created and maintained by **Yevhen Leonidov**.

## Why another Vanta?

The original Vanta is a beloved piece of generative art. Its runtime, however,
is from another era: global `THREE`, one `window` listener per instance, no
`ResizeObserver`, no context-loss handling, no adaptive quality, and effects
tied to p5 1.x. VantaJS2 keeps the _idea_ and rebuilds the _engine_:

- **One RAF loop for every effect.** A shared scheduler owns time; instances do
  not compete for frames.
- **WebGL2, evergreen only.** three.js is a peer dependency. No hidden bundle
  tax.
- **Adaptive quality.** Sustained low frame rates lower the DPR multiplier;
  single hitches never trigger a downgrade.
- **Visibility aware.** `IntersectionObserver` and `visibilitychange` stop work
  when the effect is offscreen or the tab is hidden.
- **Clean teardown.** Geometry, materials, textures, render targets, observers,
  listeners, and the canvas are released on `destroy()`.
- **SSR-safe.** Importing a module never touches `window`.
- **Clean-room effects.** Original shaders and algorithms. No copied Shadertoy
  code, no p5 runtime, no license surprises.
- **Typed and framework-friendly.** First-class TypeScript, React, Vue 3, and
  Svelte adapters over the same lifecycle.

## Requirements

- A browser with **WebGL2** (current Chrome, Edge, Firefox, and Safari).
- **Node 22+** and **pnpm 12+** for development.
- `three` as a peer dependency for the renderer and effects.

Unsupported browsers are not left with a broken layout: the runtime applies a
CSS fallback, sets `supported: false`, and emits an `unsupported` event.

## Install

Core, three.js, and one effect:

```bash
pnpm add @vantajs2/core @vantajs2/effects three
```

The same with npm or yarn:

```bash
npm install @vantajs2/core @vantajs2/effects three
yarn add @vantajs2/core @vantajs2/effects three
```

`three` is a peer dependency. The core has zero runtime dependencies. Effects
live in one package but expose one subpath per effect, so bundlers can load only
what you import.

Framework wrappers:

```bash
pnpm add @vantajs2/react  # React 18+
pnpm add @vantajs2/vue    # Vue 3.3+
pnpm add @vantajs2/svelte # Svelte 3, 4, or 5
```

## Quick start

```ts
import { createEffect } from '@vantajs2/core'
import { waves } from '@vantajs2/effects/waves'

const effect = createEffect(waves, {
  el: '#hero',
  color: '#072438',
  highlightColor: '#63e6ff',
  waveHeight: 2.6,
  speed: 1,
})

await effect.ready

effect.setOptions({ waveHeight: 2.2 })
effect.pause()
effect.resume()
effect.resize()
effect.destroy()
```

The container needs a real height. The canvas is absolutely positioned inside
it, so a zero-height div stays invisible:

```css
#hero {
  position: relative;
  min-height: 480px;
}
```

`createEffect` performs the first render synchronously. `effect.ready` resolves
after setup and is also available as the `ready` event, including the fallback
path when WebGL2 is unavailable.

## API

```ts
interface EffectHandle<D> {
  readonly name: string
  readonly el: HTMLElement
  readonly canvas: HTMLCanvasElement
  readonly supported: boolean
  readonly error: Error | null
  readonly options: Readonly<ResolvedOptions<D>>
  readonly stats: Readonly<Stats>
  readonly ready: Promise<EffectHandle<D>>

  setOptions(options: Partial<ResolvedOptions<D>>): void
  pause(): void
  resume(): void
  resize(): void
  destroy(): void
  on(event, listener): () => void
}
```

| Member                 | Behavior                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `supported`            | `false` when WebGL2 is missing or setup failed.                                      |
| `error`                | The last setup or render error, if any.                                              |
| `options`              | Resolved options: common defaults + effect defaults + user input.                    |
| `stats`                | Live `fps`, `frameTime`, `quality`, `dpr`, `frames`, `visible`, and `paused`.        |
| `ready`                | Resolves with the handle after the first frame.                                      |
| `setOptions()`         | Applies live updates. `el`, `canvas`, and `raiseContent` are init-only.              |
| `pause()` / `resume()` | User-level pause. Independent of visibility and reduced motion.                      |
| `resize()`             | Forces a size and DPR measurement. Usually unnecessary: `ResizeObserver` handles it. |
| `destroy()`            | Idempotent, deep teardown.                                                           |
| `on()`                 | Subscribes to an event and returns an unsubscribe function.                          |

### Events

`ready`, `options`, `resize`, `pause`, `resume`, `destroy`, `error`,
`unsupported`, `contextlost`, `contextrestored`, `qualitychange`.

```ts
const off = effect.on('error', (error) => {
  console.error(error)
})

off()
```

### Common options

Every effect accepts these options in addition to its own:

| Option                   | Default     | Notes                                                                              |
| ------------------------ | ----------- | ---------------------------------------------------------------------------------- |
| `el`                     | —           | **Required.** Selector or `HTMLElement`.                                           |
| `canvas`                 | new canvas  | Reuse an existing canvas. Init-only.                                               |
| `pixelRatio`             | device DPR  | Explicit DPR, still capped by `maxPixelRatio`.                                     |
| `maxPixelRatio`          | `2`         | Upper bound for automatic DPR.                                                     |
| `minWidth` / `minHeight` | `0`         | Minimum measured size.                                                             |
| `mouseControls`          | `true`      | Route the shared pointer input to this instance.                                   |
| `gyroControls`           | `false`     | Opt-in device-orientation input.                                                   |
| `speed`                  | `1`         | Effect-time multiplier. `elapsed` stays wall-clock.                                |
| `fpsCap`                 | `0`         | Frame cap. `0` means vsync. Capped rendering does not trigger quality drops.       |
| `autoPause`              | `true`      | Pause when the container is offscreen.                                             |
| `reducedMotion`          | `'respect'` | `'respect'` or `'ignore'` for `prefers-reduced-motion`.                            |
| `fallback`               | `'#05070a'` | CSS background used when WebGL2 is unavailable or setup fails. `null` disables it. |
| `raiseContent`           | `true`      | Raise static children above the canvas. Init-only, restored on destroy.            |
| `className`              | —           | Extra class on the canvas.                                                         |
| `zIndex`                 | `0`         | Canvas z-index.                                                                    |
| `quality`                | `1`         | Initial quality multiplier in the `0.5..1` range.                                  |
| `adaptiveQuality`        | `true`      | Allow automatic quality changes under sustained load.                              |

Effect-specific options are typed and exported next to each definition, for
example `WavesOptions`, `AuroraOptions`, and `BirdsOptions`.

## Effects

| Effect     | Import                       | Specific options                                                                                                                                          |
| ---------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `waves`    | `@vantajs2/effects/waves`    | `color`, `highlightColor`, `backgroundColor`, `backgroundAlpha`, `waveHeight`, `waveSpeed`, `waveScale`, `zoom`                                           |
| `aurora`   | `@vantajs2/effects/aurora`   | `colorA`, `colorB`, `colorC`, `backgroundColor`, `backgroundAlpha`, `intensity`, `scale`                                                                  |
| `net`      | `@vantajs2/effects/net`      | `color`, `backgroundColor`, `backgroundAlpha`, `points`, `spacing`, `maxDistance`, `pointSize`, `showDots`, `showLines`, `drift`, `seed`                  |
| `fog`      | `@vantajs2/effects/fog`      | `highlightColor`, `midtoneColor`, `lowlightColor`, `baseColor`, `backgroundColor`, `backgroundAlpha`, `blurFactor`, `zoom`, `scale`                       |
| `clouds`   | `@vantajs2/effects/clouds`   | `backgroundColor`, `backgroundAlpha`, `skyColor`, `cloudColor`, `cloudShadowColor`, `sunColor`, `sunGlareColor`, `sunlightColor`, `scale`                 |
| `clouds2`  | `@vantajs2/effects/clouds2`  | `backgroundColor`, `backgroundAlpha`, `skyColor`, `cloudColor`, `lightColor`, `scale`                                                                     |
| `cells`    | `@vantajs2/effects/cells`    | `color1`, `color2`, `backgroundColor`, `backgroundAlpha`, `amplitudeFactor`, `ringFactor`, `rotationFactor`, `size`                                       |
| `ripple`   | `@vantajs2/effects/ripple`   | `color1`, `color2`, `backgroundColor`, `backgroundAlpha`, `amplitudeFactor`, `ringFactor`, `rotationFactor`                                               |
| `dots`     | `@vantajs2/effects/dots`     | `color`, `color2`, `backgroundColor`, `backgroundAlpha`, `size`, `spacing`, `showLines`                                                                   |
| `globe`    | `@vantajs2/effects/globe`    | `color`, `color2`, `backgroundColor`, `backgroundAlpha`, `size`, `points`, `maxDistance`, `spacing`, `showDots`                                           |
| `halo`     | `@vantajs2/effects/halo`     | `baseColor`, `color2`, `backgroundColor`, `backgroundAlpha`, `amplitudeFactor`, `ringFactor`, `rotationFactor`, `xOffset`, `yOffset`, `size`              |
| `rings`    | `@vantajs2/effects/rings`    | `backgroundColor`, `backgroundAlpha`, `color`, `color2`, `rings`, `size`, `speed`, `seed`                                                                 |
| `birds`    | `@vantajs2/effects/birds`    | `backgroundColor`, `backgroundAlpha`, `color1`, `color2`, `birdSize`, `wingSpan`, `speedLimit`, `separation`, `alignment`, `cohesion`, `quantity`, `seed` |
| `topology` | `@vantajs2/effects/topology` | `color`, `backgroundColor`, `backgroundAlpha`, `density`, `scale`                                                                                         |
| `trunk`    | `@vantajs2/effects/trunk`    | `color`, `backgroundColor`, `backgroundAlpha`, `spacing`, `chaos`, `density`, `seed`                                                                      |

All are original implementations, written from scratch for VantaJS2. The full
catalog with live controls is in `apps/docs`; `apps/demo` contains a gallery of
every effect.

## Framework wrappers

### React

```tsx
import { Vanta } from '@vantajs2/react'
import { waves } from '@vantajs2/effects/waves'

export function Hero() {
  return (
    <Vanta
      effect={waves}
      options={{ color: '#072438', highlightColor: '#63e6ff' }}
      style={{ height: 480 }}
      onReady={(effect) => console.log('ready', effect.canvas)}
      onError={(error) => console.error(error)}
    >
      <h1>Foreground content</h1>
    </Vanta>
  )
}
```

The component creates the effect in `useEffect` (SSR-safe), forwards option
changes through `setOptions`, destroys on unmount (StrictMode-safe), and forwards
`className`, `style`, and children.

### Vue 3

```vue
<template>
  <Vanta :effect="waves" :options="{ color: '#072438' }" style="height: 480px">
    <h1>Foreground content</h1>
  </Vanta>
</template>

<script setup>
import { Vanta } from '@vantajs2/vue'
import { waves } from '@vantajs2/effects/waves'
</script>
```

Props: `effect`, `options`, `tag`. The handle is available through the exposed
`effect` property.

### Svelte

```svelte
<script>
  import { vanta } from '@vantajs2/svelte'
  import { waves } from '@vantajs2/effects/waves'

  let options = { color: '#072438' }
</script>

<div use:vanta={{ effect: waves, options }} style="height: 480px">
  <h1>Foreground content</h1>
</div>
```

The action works in Svelte 3, 4, and 5. Update the params object to change
options; the action calls `setOptions` and destroys the effect when the node is
removed.

All wrappers own the same lifecycle. If you need the raw handle, use
`createEffect` directly or subscribe through the wrapper's documented handle
hook.

## Plain HTML, no build step

`apps/demo/static/` is a complete no-build artifact. Upload these four files to
any HTML host — no Node, pnpm, Vite, or server required:

```
apps/demo/static/
  index.html
  style.css
  main.js
  vanta2.js
```

`vanta2.js` is an IIFE browser bundle that includes three.js and all effects and
exposes a global API:

```html
<div id="hero" style="height: 480px"></div>
<script src="./vanta2.js"></script>
<script>
  const effect = VANTA2.mount('waves', '#hero', {
    color: '#072438',
    highlightColor: '#63e6ff',
  })

  effect.setOptions({ waveHeight: 2.2 })
  effect.destroy()
</script>
```

Available globals:

- `VANTA2.mount(name, el, options)` — create an effect by name.
- `VANTA2.createEffect(definition, options)` — low-level API.
- `VANTA2.definitions` — map of effect name to definition.
- `VANTA2.catalog` — metadata, defaults, and descriptions used by the demo.
- `VANTA2.version` — bundle version.

It also works by opening `index.html` directly from disk. Rebuild it with
`pnpm build:static`. For production apps, prefer the tree-shakeable ESM packages
instead of the full demo bundle.

## Layout and DOM contract

- The canvas is `position: absolute; inset: 0; z-index: 0; pointer-events: none`.
- By default (`raiseContent: true`) static children receive `position: relative`
  and `z-index: 1`, then are restored on destroy. Set it to `false` if your app
  already owns stacking.
- The container becomes `position: relative` only if it was static.
- A CSS `fallback` background is applied when WebGL2 is unavailable or setup
  fails, and restored on destroy.
- `destroy()` removes the canvas it created, restores every changed style, and
  clears all listeners and observers.

## Performance

- One module-level `requestAnimationFrame` loop serves every instance.
- The loop stops when the document is hidden or no instances remain.
- `IntersectionObserver` pauses offscreen effects when `autoPause` is on.
- DPR is capped by `maxPixelRatio` (default `2`).
- `QualityController` lowers quality after 30 frames over 26 ms and raises it
  after 240 frames under 18 ms. `fpsCap` frames are excluded from that signal.
- `prefers-reduced-motion` renders a still frame instead of animating.
- A single passive `pointermove` / `pointerdown` listener is shared by all
  instances; there is no listener per effect.

## Browser support

VantaJS2 targets evergreen browsers with WebGL2:

| Browser       | Minimum           |
| ------------- | ----------------- |
| Chrome / Edge | Current evergreen |
| Firefox       | Current evergreen |
| Safari        | Current evergreen |

IE and WebGL1-only environments are not supported. The runtime degrades to the
CSS fallback rather than throwing.

## Documentation and demo

```bash
pnpm dev        # docs and live configurator at http://localhost:5173
pnpm dev:demo   # gallery demo at http://localhost:5174
```

The Vite demo builds to `apps/demo/dist` and deploys to GitHub Pages through the
`Pages` workflow. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the runtime
design, [MIGRATION.md](./MIGRATION.md) for the Vanta 0.5 mapping, and
[ROADMAP.md](./ROADMAP.md) for what comes next.

## Repository layout

```
packages/core      renderer-agnostic runtime
packages/three     three.js adapter
packages/effects   clean-room effects with one subpath per effect
packages/react     React component
packages/vue       Vue 3 component
packages/svelte    Svelte action
apps/docs          live docs and configurator
apps/demo          Vite gallery and no-build static bundle
tests              unit setup and Playwright smoke tests
legacy/            frozen Vanta 0.5.24 snapshot, not built or shipped
```

## Development

```bash
pnpm install
pnpm dev           # docs
pnpm dev:demo      # gallery
pnpm test          # unit tests
pnpm typecheck
pnpm build         # packages + static demo bundle
pnpm size          # size budgets
pnpm lint
pnpm test:visual   # Playwright smoke tests
pnpm check         # lint, types, unit, build, size, publint
```

`pnpm test:visual` uses the built docs and demo previews, so run `pnpm build`
first (or `pnpm build:packages && pnpm build:static` for the bundles it needs).

## Troubleshooting

- **Nothing appears.** Give the container a non-zero height and make sure `el`
  matches an element that exists when `createEffect` runs.
- **`supported` is false.** The browser lacks WebGL2 or setup threw. Inspect
  `error`, listen for `error` / `unsupported`, and style the `fallback`.
- **The effect keeps recreating.** Keep `el` stable. Changing `canvas`, `el`, or
  `raiseContent` after creation is not supported; create a new handle instead.
- **React StrictMode double mount.** The provided React wrapper destroys and
  recreates correctly. If you call `createEffect` manually, clean up in the
  `useEffect` return function.
- **Too many GPU contexts.** Prefer one effect per visible section and let
  `autoPause` handle offscreen content.

## License and credits

MIT. See [LICENSE.md](./LICENSE.md) and [NOTICE.md](./NOTICE.md).

VantaJS2 is an independent fork. Original Vanta code and effects remain under
their original MIT copyright in `legacy/`; they are kept for reference and
attribution only and are not part of the build. New runtime, wrappers,
documentation, and effects are original work by **Yevhen Leonidov** and the
VantaJS2 contributors.

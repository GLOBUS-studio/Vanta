# VantaJS2

Ambient 3D backgrounds for the modern web. A ground-up reincarnation of
[Vanta](https://github.com/tengbao/vanta), not a dependency bump.

> **Status: alpha.** The runtime, three.js adapter, and two clean-room effects
> (`waves`, `aurora`) are implemented. More effects land behind the same contract.

## Why another Vanta?

The original Vanta is a beloved piece of generative art. Its runtime, however,
is from another era: global `THREE`, one `window` listener per instance, no
`ResizeObserver`, no context-loss handling, no adaptive quality, and effects
tied to p5 1.x. VantaJS2 keeps the _idea_ and rebuilds the _engine_:

- **One RAF loop for every effect.** A shared scheduler owns time; instances do
  not compete for frames.
- **WebGL2, evergreen only.** three.js is a peer dependency. No hidden bundle tax.
- **Adaptive quality.** Sustained low frame rates lower the DPR multiplier;
  single hitches never trigger a downgrade.
- **Visibility aware.** `IntersectionObserver` and `visibilitychange` stop work
  when the effect is offscreen or the tab is hidden.
- **Clean teardown.** Geometry, materials, textures, render targets, observers,
  listeners, and the canvas are released on `destroy()`.
- **SSR-safe.** Importing a module never touches `window`.
- **Clean-room effects.** Original shaders and algorithms. No copied Shadertoy
  code, no p5 runtime, no license surprises.

## Install

```bash
pnpm add @vantajs2/core @vantajs2/effects three
```

`three` is a peer dependency. The core has zero runtime dependencies.

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
effect.destroy()
```

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

Events: `ready`, `options`, `resize`, `pause`, `resume`, `destroy`, `error`,
`unsupported`, `contextlost`, `contextrestored`, `qualitychange`.

`stats` exposes live `fps`, `frameTime`, `quality`, `dpr`, `frames`, `visible`,
and `paused`.

## Effects

| Effect   | Kind                              | Entry                      |
| -------- | --------------------------------- | -------------------------- |
| `waves`  | displaced geometry + custom light | `@vantajs2/effects/waves`  |
| `aurora` | fullscreen FBM shader             | `@vantajs2/effects/aurora` |
| `net`    | points + additive line mesh       | `@vantajs2/effects/net`    |

All are original implementations, written from scratch for VantaJS2.

## Packages

| Package             | Purpose                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| `@vantajs2/core`    | Renderer-agnostic runtime: lifecycle, scheduler, input, visibility, quality |
| `@vantajs2/three`   | three.js adapter: renderer setup, fullscreen pass, deep disposal            |
| `@vantajs2/effects` | Clean-room effects                                                          |
| `apps/docs`         | Live docs and configurator                                                  |

## Development

```bash
pnpm install
pnpm dev          # docs at http://localhost:5173
pnpm test         # unit tests
pnpm typecheck
pnpm build
pnpm size
pnpm test:visual  # Playwright smoke tests
```

The legacy Vanta snapshot lives in [`legacy/`](./legacy). It is kept for
reference and historical attribution only; it is not part of the build.

## License

MIT. See [LICENSE.md](./LICENSE.md) and [NOTICE.md](./NOTICE.md).

VantaJS2 is an independent fork. Original Vanta code and effects remain under
their original MIT copyright in `legacy/`. New code is original work.

# Architecture

## Layers

```
app
 └─ @vantajs2/core        lifecycle, scheduler, input, visibility, quality
     └─ @vantajs2/three   three.js adapter (optional)
         └─ WebGL2
     └─ effect instance   waves, aurora, next effects…
```

The core does **not** import three.js. It owns the canvas, size, time, pointer,
visibility, and quality state. An effect receives a host and returns a small
renderer contract:

```ts
interface EffectInstance<D> {
  render(frame: FrameInfo): void
  resize?(size: Size): void
  setOptions?(options: Readonly<ResolvedOptions<D>>): void
  onQualityChange?(quality: number): void
  dispose(): void
}
```

This keeps the runtime testable without a GPU and leaves room for a future
WebGPU adapter without rewriting the lifecycle.

## Lifecycle

```
resolve el → merge options → detect WebGL2 → create host → effect.setup()
→ first frame → observers → scheduler → ready
```

`destroy()` reverses every step: scheduler detach, observers, listeners,
pointer manager, effect disposal, DOM restoration, canvas removal.

Failures are honest:

- No WebGL2 → CSS fallback, `supported: false`, `unsupported` event.
- Setup throws → CSS fallback, `error` event, `supported: false`.
- Render throws → effect pauses, `error` event, no render loop spam.
- Context lost → pause, `contextlost`; restored → resume, `contextrestored`.

## Scheduling

A module-level `FrameScheduler` keeps a single `requestAnimationFrame` loop for
all instances. It stops when:

- the document is hidden;
- no instances are attached.

Each instance is attached only when it should animate:

- not paused by the user;
- not in reduced-motion static mode;
- visible (if `autoPause` is on);
- not in a lost-context state.

`fpsCap` is enforced per instance. `speed` scales effect time, while `elapsed`
stays wall-clock.

## Input

A single passive `pointermove` / `pointerdown` listener lives in a shared
`PointerManager`. It routes coordinates to instances whose cached bounding box
contains the pointer. Scroll and resize invalidate those boxes. No listener per
instance, no `preventDefault`, no scroll interference.

Gyroscope input is opt-in and attaches a `deviceorientation` listener per
instance with `gyroControls: true`.

## Quality

`QualityController` samples frame deltas after a startup warm-up:

- > 26 ms for 30 consecutive frames → lower by 0.15 (floor 0.5);
- < 18 ms for 240 consecutive frames → raise by 0.1 (ceiling 1).

Quality multiplies the DPR, which is already capped by `maxPixelRatio` (default
2). Effects may also react through `onQualityChange` (e.g. reduce shader detail).

## DOM contract

- The canvas is `position: absolute; inset: 0; z-index: 0; pointer-events: none`.
- By default (`raiseContent: true`) static children receive `position: relative`
  and `z-index: 1`, then are restored on destroy. Set it to `false` if your app
  already owns stacking.
- The container becomes `position: relative` only if it was static.
- A CSS `fallback` background is applied when WebGL2 is unavailable or setup
  fails, and restored on destroy.

## Packaging

- ESM only, `sideEffects: false`, subpath exports per effect.
- `three` is a peer dependency for `@vantajs2/three` and `@vantajs2/effects`.
- GLSL lives in TypeScript template strings: no glslify, no raw-loader, no
  abandoned build plugins.
- Target: ES2022, evergeen browsers with WebGL2.

## Deliberate non-goals for 1.0

- WebGPU renderer. WebGL2 is the right floor for ambient backgrounds in 2026.
- p5.js effects. `trunk` and `topology` would be rewritten as original shaders
  or geometry, not bundled through an LGPL runtime.
- A React-only API. Framework wrappers are thin adapters over the same handle.
- Reproducing every Vanta option name at any cost. Compatibility matters, but
  the new API is allowed to be clearer.

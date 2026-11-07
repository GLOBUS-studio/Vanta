# Contributing

## Setup

```bash
pnpm install
pnpm dev
```

Node 22+ and pnpm 12+ are required. The docs app runs from source via Vite
aliases, so you do not need to rebuild packages while editing the runtime.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm size
pnpm test:visual
```

`pnpm test:visual` builds nothing by itself; run `pnpm build` first. It starts
`vite preview` on port 4173 and drives Chromium with SwiftShader.

## Adding an effect

1. Create `packages/effects/src/<name>.ts`.
2. Export a `defineEffect<Options>({ name, defaults, setup })`.
3. `setup(host, options)` returns an `EffectInstance`:
   - `render(frame)` — required;
   - `resize(size)` — update camera/buffers;
   - `setOptions(next)` — apply live changes;
   - `onQualityChange(quality)` — optional detail reduction;
   - `dispose()` — release every GPU and DOM resource.
4. Add the subpath to `packages/effects/package.json` exports and the tsup entry.
5. Export it from `packages/effects/src/index.ts`.
6. Add a control panel entry in `apps/docs/src/main.ts`.
7. Add the effect to the README table.

Use the existing effects as the contract. Do not import three.js from the core
package; only the effect and the three adapter should know about it.

## Clean-room rules

Read [NOTICE.md](./NOTICE.md). Do not paste Shadertoy snippets, p5 sketches, or
GPL/LGPL code. Algorithms may be inspired by public research, but the
implementation must be original. Credit inspiration in the effect file.

## DOM and lifecycle rules

- Never touch `window` at module scope.
- Never add a global listener from an effect; use the host hooks.
- Never assume the canvas is yours; use `host.canvas`.
- Always dispose geometry, materials, textures, and render targets.
- Restore any DOM styles you change.

## Commits

Keep commits scoped. Mention the package in the subject, for example:

```
core: pause scheduler when context is lost
effects: add aurora curtain detail
docs: add workbench controls
```

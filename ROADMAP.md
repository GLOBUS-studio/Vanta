# Roadmap

## 0.1 — foundation (this repo)

- [x] renderer-agnostic core runtime;
- [x] shared RAF scheduler, visibility pause, reduced motion;
- [x] ResizeObserver, DPR cap, adaptive quality;
- [x] context-loss handling and CSS fallback;
- [x] typed lifecycle, events, stats, deep teardown;
- [x] three.js adapter with fullscreen pass and deep disposal;
- [x] clean-room effects: `waves`, `aurora`, `net`, `fog`, `clouds`, `clouds2`,
      `cells`, `ripple`, `dots`, `globe`, `halo`, `rings`, `birds`, `topology`,
      `trunk`;
- [x] docs app with live configurator;
- [x] unit, visual, size, and CI checks.

## 0.2 — coverage

- [x] clean-room `fog` (original noise/fog shader);
- [x] clean-room `cells` (Worley shader);
- [x] clean-room `dots` (spherical point field);
- [x] clean-room `rings` / `halo` (geometry + radial shader);
- [x] clean-room `globe` (wireframe sphere + links);
- [x] clean-room `ripple` (pointer-driven shader);
- [x] clean-room `clouds`, `clouds2`, `birds`, `topology`, `trunk`;
- [ ] visual regression baselines per effect;
- [ ] memory/GPU leak stress test in CI.

## 0.3 — adoption

- [ ] `@vantajs2/react` wrapper;
- [ ] `@vantajs2/vue` wrapper;
- [ ] `@vantajs2/svelte` wrapper;
- [ ] `<vanta-bg>` web component;
- [ ] legacy `VANTA.*` compatibility package;
- [ ] migration codemod;
- [ ] preset JSON + shareable config URL.

## 1.0 — stable

- [ ] API freeze and semver policy;
- [ ] browser support matrix and fallback images;
- [ ] performance lab published (FPS/GPU/battery on reference devices);
- [ ] accessible `prefers-reduced-motion` still frame;
- [ ] npm provenance, signed releases, changesets;
- [ ] documented effect-authoring SDK.

## Later

- WebGPU adapter behind the same core contract;
- effect marketplace / remixable presets;
- server-side poster rendering for static thumbnails.

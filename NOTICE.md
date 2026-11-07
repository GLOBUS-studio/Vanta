# Notice and provenance

VantaJS2 is an independent reincarnation of Vanta. It is not a drop-in copy of
the original source.

## Original Vanta

The original Vanta project is MIT licensed:

> Copyright 2020 Teng Bao

A frozen snapshot of the original source is kept in [`legacy/`](./legacy) for
reference and attribution. It is not compiled, shipped, or imported by any
VantaJS2 package.

## VantaJS2

New runtime, adapter, documentation, and effects are original work by the
VantaJS2 contributors and are released under the MIT license.

The `waves` and `aurora` effects are written from scratch:

- `waves` uses a sum-of-sines height field, analytic-ish lighting via screen-space
  derivatives, and a custom color/fog model.
- `aurora` uses a domain-warped value-noise FBM and a custom curtain model.

No Shadertoy shader source is copied. No p5.js source is bundled. No code from
the original Vanta effect implementations is compiled into the new packages.

## Clean-room policy

Contributions must be original or carry a compatible license. In particular:

- Do not paste Shadertoy shaders. Shadertoy's default license has historically
  been CC BY-NC-SA, which conflicts with MIT and commercial use.
- Do not copy p5.js example sketches or GPL/LGPL code into `packages/`.
- If an algorithm is inspired by a paper, blog post, or demo, credit it in the
  effect documentation and keep the implementation original.
- Legacy Vanta code may be studied for behavior, but new effect code must be
  written independently.

If you are unsure about provenance, open an issue before contributing the code.

# @vantajs2/three

three.js adapter for VantaJS2.

- creates a WebGL2 renderer on the canvas owned by the core;
- `SRGBColorSpace`, `NoToneMapping`, capped DPR;
- fullscreen pass helper;
- deep disposal for scenes, materials, and textures;
- context-lost/restored hooks.

```ts
import { createFullscreenPass, createThreeLayer, disposeScene } from '@vantajs2/three'
```

`three` is a peer dependency (`>=0.160.0`).

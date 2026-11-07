# Static demo (no build step)

This folder is a complete, no-build demo for any plain HTML host:

```
static/
  index.html
  style.css
  main.js
  vanta2.js
```

Upload these four files as-is. **No Node, pnpm, Vite, or server is required.**
It also works by opening `index.html` directly from disk.

## Use the browser bundle

`vanta2.js` is an IIFE bundle that includes three.js and all 15 effects. It
exposes a global `VANTA2`:

```html
<div id="hero" style="height: 480px"></div>
<script src="./vanta2.js"></script>
<script>
  const effect = VANTA2.mount('waves', '#hero', {
    color: '#072438',
    highlightColor: '#63e6ff',
  })

  // Later:
  effect.setOptions({ waveHeight: 2.2 })
  effect.destroy()
</script>
```

Available API:

- `VANTA2.mount(name, el, options)` — create an effect by name;
- `VANTA2.createEffect(definition, options)` — low-level API;
- `VANTA2.definitions` — map of effect name to definition;
- `VANTA2.catalog` — metadata, defaults, and descriptions used by the demo.

## Rebuild

After changing effects or the demo:

```bash
pnpm --filter @vantajs2/demo build:static
```

This regenerates `vanta2.js` and copies `../src/style.css` to `style.css`.

## Size note

`vanta2.js` is a convenience bundle for demos and plain HTML pages: it includes
three.js and every effect. For production applications, import only the effect
you need from `@vantajs2/effects/*` and let your bundler tree-shake.

# @vantajs2/svelte

Svelte action for VantaJS2.

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

The action works in Svelte 3, 4, and 5. It creates the effect when the node
mounts, forwards option changes through `setOptions`, and destroys the effect
when the node is removed. `svelte` is a peer dependency.

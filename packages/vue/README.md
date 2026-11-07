# @vantajs2/vue

Vue 3 component for VantaJS2.

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

The component creates the effect on mount, forwards option changes through
`setOptions`, recreates it if the `effect` prop changes, and destroys it on
unmount. `vue >= 3.3` is a peer dependency.

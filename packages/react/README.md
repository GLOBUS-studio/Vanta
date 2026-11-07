# @vantajs2/react

React component for VantaJS2.

```tsx
import { Vanta } from '@vantajs2/react'
import { waves } from '@vantajs2/effects/waves'

export function Hero() {
  return (
    <Vanta
      effect={waves}
      options={{ color: '#072438', highlightColor: '#63e6ff' }}
      style={{ height: 480 }}
    >
      <h1>Foreground content</h1>
    </Vanta>
  )
}
```

The component:

- creates the effect in `useEffect` (SSR-safe);
- forwards option changes through `setOptions`;
- destroys the effect on unmount (StrictMode-safe);
- exposes the handle through `onReady`;
- forwards `className`, `style`, and children.

`react >= 18` is a peer dependency.

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const workspace = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  resolve: {
    alias: [
      {
        find: /^@vantajs2\/effects\/(.*)$/,
        replacement: `${workspace}/packages/effects/src/$1.ts`,
      },
      {
        find: '@vantajs2/effects',
        replacement: `${workspace}/packages/effects/src/index.ts`,
      },
      {
        find: '@vantajs2/core',
        replacement: `${workspace}/packages/core/src/index.ts`,
      },
      {
        find: '@vantajs2/three',
        replacement: `${workspace}/packages/three/src/index.ts`,
      },
    ],
  },
  server: {
    port: 5174,
    host: true,
  },
  build: {
    target: 'es2022',
  },
})

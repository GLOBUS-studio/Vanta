import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vantajs2/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
      '@vantajs2/three': fileURLToPath(new URL('./packages/three/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['packages/**/src/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    restoreMocks: true,
  },
})

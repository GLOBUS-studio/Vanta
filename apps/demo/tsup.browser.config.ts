import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    vanta2: 'browser/index.ts',
  },
  outDir: 'static',
  format: ['iife'],
  globalName: 'VANTA2',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  sourcemap: false,
  clean: false,
  dts: false,
  splitting: false,
  treeshake: true,
  noExternal: ['three', '@vantajs2/core', '@vantajs2/three', '@vantajs2/effects'],
})

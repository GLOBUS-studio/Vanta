import { copyFile, rm } from 'node:fs/promises'

const builtBundle = new URL('../static/vanta2.global.js', import.meta.url)
const targetBundle = new URL('../static/vanta2.js', import.meta.url)

await copyFile(builtBundle, targetBundle)
await rm(builtBundle, { force: true })

await copyFile(
  new URL('../src/style.css', import.meta.url),
  new URL('../static/style.css', import.meta.url),
)

console.log('[demo] static demo ready: index.html, style.css, main.js, vanta2.js')

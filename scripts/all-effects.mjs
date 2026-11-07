import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const keys = [
  'waves',
  'aurora',
  'net',
  'fog',
  'clouds',
  'clouds2',
  'cells',
  'ripple',
  'dots',
  'globe',
  'halo',
  'rings',
  'birds',
  'topology',
  'trunk',
]

await mkdir('shots', { recursive: true })

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
})
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})

await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const results = []
for (const key of keys) {
  const before = errors.length
  await page.locator(`[data-effect="${key}"]`).click()
  await page.waitForTimeout(1400)
  const state = await page.evaluate(() => {
    const canvas = document.querySelector('#stage canvas')
    return {
      effect: document.querySelector('#effect-name')?.textContent,
      fps: document.querySelector('#stat-fps')?.textContent,
      dpr: document.querySelector('#stat-dpr')?.textContent,
      quality: document.querySelector('#stat-quality')?.textContent,
      canvas: canvas ? `${canvas.width}x${canvas.height}` : null,
      fallback: !document.querySelector('#fallback')?.hidden,
      controls: document.querySelectorAll('#controls .control').length,
    }
  })
  results.push({ key, ...state, errors: errors.slice(before) })
  await page.locator('#stage').screenshot({ path: `shots/${key}.png` })
}

console.log(JSON.stringify({ results, errors }, null, 2))
await browser.close()

if (errors.length > 0 || results.some((result) => !result.canvas || result.fallback)) {
  process.exitCode = 1
}

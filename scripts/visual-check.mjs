import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
})

page.on('console', (message) => {
  console.log(`[console:${message.type()}] ${message.text()}`)
})
page.on('pageerror', (error) => {
  console.error('[pageerror]', error)
})

await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

const state = await page.evaluate(() => {
  const canvas = document.querySelector('#stage canvas')
  return {
    fps: document.querySelector('#stat-fps')?.textContent,
    dpr: document.querySelector('#stat-dpr')?.textContent,
    quality: document.querySelector('#stat-quality')?.textContent,
    hasCanvas: Boolean(canvas),
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    effect: document.querySelector('#effect-name')?.textContent,
    fallbackVisible: !document.querySelector('#fallback')?.hidden,
    bodyScrollWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
  }
})
console.log(JSON.stringify(state, null, 2))

await page.screenshot({ path: 'visual-hero.png' })
await page.screenshot({ path: 'visual-full.png', fullPage: true })

await page.click('[data-effect="aurora"]')
await page.waitForTimeout(2200)
await page.screenshot({ path: 'visual-aurora.png' })

await page.click('[data-effect="net"]')
await page.waitForTimeout(2200)
await page.screenshot({ path: 'visual-net.png' })

await browser.close()

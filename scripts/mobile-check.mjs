import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
page.on('pageerror', (error) => console.error('[pageerror]', error))
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.evaluate(() => {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
})
await page.waitForTimeout(400)

const state = await page.evaluate(() => {
  const canvas = document.querySelector('#stage canvas')
  return {
    scrollWidth: document.body.scrollWidth,
    innerWidth: window.innerWidth,
    canvas: canvas ? `${canvas.width}x${canvas.height}` : null,
    fps: document.querySelector('#stat-fps')?.textContent,
    dpr: document.querySelector('#stat-dpr')?.textContent,
  }
})
console.log(JSON.stringify(state, null, 2))

await page.screenshot({ path: 'visual-mobile.png', fullPage: false })
await page.screenshot({ path: 'visual-mobile-full.png', fullPage: true })
await browser.close()

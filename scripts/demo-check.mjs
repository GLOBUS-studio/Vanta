import { chromium } from '@playwright/test'

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

await page.goto('http://localhost:4174', { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.screenshot({ path: 'visual-demo-hero.png' })

const hero = await page.evaluate(() => ({
  canvas: Boolean(document.querySelector('#hero-canvas canvas')),
  cards: document.querySelectorAll('.card').length,
  mounted: document.querySelectorAll('.card.is-live').length,
}))

await page.locator('#gallery').scrollIntoViewIfNeeded()
await page.waitForTimeout(1800)
await page.screenshot({ path: 'visual-demo-gallery.png' })

const gallery = await page.evaluate(() => ({
  visible: document.querySelectorAll('.card.is-visible').length,
  mounted: document.querySelectorAll('.card.is-live').length,
  canvases: document.querySelectorAll('.preview canvas').length,
  fpsLabels: Array.from(document.querySelectorAll('[data-fps]'))
    .map((el) => el.textContent)
    .filter(Boolean),
}))

await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }))
await page.waitForTimeout(1200)
await page.screenshot({ path: 'visual-demo-bottom.png' })

const bottom = await page.evaluate(() => ({
  mounted: document.querySelectorAll('.card.is-live').length,
  canvases: document.querySelectorAll('.preview canvas').length,
  scrollWidth: document.body.scrollWidth,
  innerWidth: window.innerWidth,
}))

console.log(JSON.stringify({ hero, gallery, bottom, errors }, null, 2))
await browser.close()
if (errors.length > 0) process.exitCode = 1

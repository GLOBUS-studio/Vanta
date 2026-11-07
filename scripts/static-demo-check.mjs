import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const fileUrl = pathToFileURL(path.resolve('apps/demo/static/index.html')).href
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})

await page.goto(fileUrl, { waitUntil: 'load' })
await page.waitForTimeout(1600)

const hero = await page.evaluate(() => ({
  canvas: Boolean(document.querySelector('#hero-canvas canvas')),
  cards: document.querySelectorAll('.card').length,
  hasGlobal: Boolean(window.VANTA2),
  hasMount: typeof window.VANTA2?.mount === 'function',
}))

await page.locator('#gallery').scrollIntoViewIfNeeded()
await page.waitForTimeout(1600)
const gallery = await page.evaluate(() => ({
  visible: document.querySelectorAll('.card.is-visible').length,
  mounted: document.querySelectorAll('.card.is-live').length,
  canvases: document.querySelectorAll('.preview canvas').length,
  scrollWidth: document.body.scrollWidth,
  innerWidth: window.innerWidth,
}))

await page.screenshot({ path: 'visual-static-demo.png' })
console.log(JSON.stringify({ fileUrl, hero, gallery, errors }, null, 2))
await browser.close()
if (errors.length > 0 || !hero.canvas || gallery.mounted === 0) process.exitCode = 1

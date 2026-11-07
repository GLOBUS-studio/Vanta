import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('pageerror', (error) => console.error('[pageerror]', error))
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const metrics = await page.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  bodyHeight: document.body.getBoundingClientRect().height,
  sections: Array.from(document.querySelectorAll('section')).map((section) => ({
    id: section.id || section.className,
    top: section.offsetTop,
    height: section.offsetHeight,
  })),
  workbench: document.querySelector('.workbench')?.getBoundingClientRect().height,
  codeHeight: document.querySelector('#code')?.getBoundingClientRect().height,
  preHeight: document.querySelector('#code')?.parentElement?.getBoundingClientRect().height,
  footerTop: document.querySelector('.footer')?.getBoundingClientRect().top,
}))
console.log(JSON.stringify(metrics, null, 2))

await page.evaluate(() => {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
})
await page.waitForTimeout(300)
await page.locator('#effects').scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
await page.screenshot({ path: 'visual-effects.png' })
await page.locator('#performance').scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
await page.screenshot({ path: 'visual-performance.png' })
await page.locator('#api').scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
await page.screenshot({ path: 'visual-api.png' })

await browser.close()

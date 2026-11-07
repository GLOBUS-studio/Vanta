import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect, test } from '@playwright/test'

test('static demo works from a file URL without a build or server', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  const fileUrl = pathToFileURL(path.resolve('apps/demo/static/index.html')).href
  await page.goto(fileUrl)
  await expect(page.locator('#hero-canvas canvas')).toBeVisible()
  await expect(page.locator('.card')).toHaveCount(15)

  const globals = await page.evaluate(() => ({
    hasGlobal: Boolean(window.VANTA2),
    hasMount: typeof window.VANTA2?.mount === 'function',
    definitions: Object.keys(window.VANTA2?.definitions ?? {}).length,
  }))
  expect(globals.hasGlobal).toBe(true)
  expect(globals.hasMount).toBe(true)
  expect(globals.definitions).toBe(15)

  await page.locator('#gallery').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)
  const mounted = await page.locator('.card.is-live').count()
  expect(mounted).toBeGreaterThan(0)
  expect(mounted).toBeLessThanOrEqual(8)
  expect(errors).toEqual([])
})

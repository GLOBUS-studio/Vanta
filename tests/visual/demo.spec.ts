import { expect, test } from '@playwright/test'

test('static demo gallery boots and lazy-mounts previews', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.goto('http://127.0.0.1:4174/')
  await expect(page.locator('#hero-canvas canvas')).toBeVisible()
  await expect(page.locator('.card')).toHaveCount(15)

  await page.locator('#gallery').waitFor()
  await page.locator('#gallery').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)

  const state = await page.evaluate(() => ({
    visible: document.querySelectorAll('.card.is-visible').length,
    mounted: document.querySelectorAll('.card.is-live').length,
    canvases: document.querySelectorAll('.preview canvas').length,
    scrollWidth: document.body.scrollWidth,
    innerWidth: window.innerWidth,
  }))

  expect(state.visible).toBeGreaterThan(0)
  expect(state.mounted).toBeGreaterThan(0)
  expect(state.mounted).toBeLessThanOrEqual(8)
  expect(state.canvases).toBe(state.mounted)
  expect(state.scrollWidth).toBeLessThanOrEqual(state.innerWidth)
  expect(errors).toEqual([])

  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(600)
  const mobile = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    innerWidth: window.innerWidth,
    cards: document.querySelectorAll('.card').length,
  }))
  expect(mobile.cards).toBe(15)
  expect(mobile.scrollWidth).toBeLessThanOrEqual(mobile.innerWidth)
})

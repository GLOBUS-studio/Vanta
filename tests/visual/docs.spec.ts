import { expect, test } from '@playwright/test'

test('boots the hero effect and switches effects', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/')
  await expect(page.locator('#stage canvas')).toBeVisible()
  await expect(page.locator('#effect-name')).toHaveText('WAVES')
  await expect(page.locator('#fallback')).toBeHidden()

  await page.waitForTimeout(1500)
  const fps = Number(await page.locator('#stat-fps').textContent())
  expect(fps).toBeGreaterThan(0)

  await page.locator('[data-effect="aurora"]').click()
  await expect(page.locator('#effect-name')).toHaveText('AURORA')
  await expect(page.locator('#stage canvas')).toHaveCount(1)
  await expect(page.locator('#fallback')).toBeHidden()

  await page.locator('[data-effect="net"]').click()
  await expect(page.locator('#effect-name')).toHaveText('NET')
  await expect(page.locator('#stage canvas')).toHaveCount(1)
  await expect(page.locator('#fallback')).toBeHidden()

  expect(errors).toEqual([])
})

test('cycles every effect without runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

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

  await page.goto('/')
  await expect(page.locator('#stage canvas')).toBeVisible()

  for (const key of keys) {
    await page.locator(`[data-effect="${key}"]`).click()
    await expect(page.locator('#effect-name')).toHaveText(key.toUpperCase())
    await expect(page.locator('#stage canvas')).toHaveCount(1)
    await expect(page.locator('#fallback')).toBeHidden()
    await page.waitForTimeout(250)
  }

  expect(errors).toEqual([])
})

test('pause, recreate, and keep a single canvas', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/')
  await page.waitForTimeout(500)

  await page.locator('#pause').click()
  await expect(page.locator('#pause')).toHaveText('▶')
  await expect(page.locator('#live-dot')).toHaveClass(/paused/)

  await page.locator('#recreate').click()
  await expect(page.locator('#pause')).toHaveText('Ⅱ')
  await expect(page.locator('#live-dot')).not.toHaveClass(/paused/)
  await expect(page.locator('#stage canvas')).toHaveCount(1)

  expect(errors).toEqual([])
})

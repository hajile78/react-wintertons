import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://api.wintertons.us/quotes', async (route) => {
    await route.fulfill({
      json: {
        quotes: [{ quote: 'Browser smoke quote', author: 'Playwright' }],
      },
    })
  })
  await page.route('https://api.wintertons.us/postsBy/Main', async (route) => {
    await route.fulfill({
      json: {
        posts: [
          {
            id: 'browser-post',
            title: 'Browser smoke post',
            body: '<p>The application rendered in a real browser.</p>',
            user: 'Main',
            created: '2026-01-15T12:00:00Z',
          },
        ],
      },
    })
  })
  await page.route('http://localhost:5000/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: null }),
      headers: { 'access-control-allow-origin': '*' },
    })
  })
})

test('renders the home route with API content', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Wintertons.us The Whole Famn Damily')
  await expect(
    page.getByRole('link', { name: 'Browser smoke post' }),
  ).toBeVisible()
  await expect(page.getByText('"Browser smoke quote"')).toBeVisible()
})

test('opens and closes the prayer dialog', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Winterton Prayer' }).click()
  await expect(
    page.getByRole('dialog', {
      name: /prayer for the author and other wintertons/i,
    }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Close dialog' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
})

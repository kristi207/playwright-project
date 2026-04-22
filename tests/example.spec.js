// @ts-check
import { test, expect } from '@playwright/test';

const APP_URL = 'https://app.usebubbles.com';

test('app title contains bubbles', async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/Bubbles/i);
});

test('login route is reachable', async ({ page }) => {
  const response = await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded' });

  expect(response).not.toBeNull();
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByRole('heading', { name: /This link was not found/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /hello@usebubbles\.com/i })).toBeVisible();
});

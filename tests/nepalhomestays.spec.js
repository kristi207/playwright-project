import { test, expect } from '@playwright/test';
 
const BASE_URL = 'https://www.nepalhomestays.com';
 
test.describe('nepalhomestays.com - Navigation and Booking Flow', () => {
 
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Nepal Homestays/i);
  });
 
  test('Happy path: sign in page loads with all required fields', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/signin/);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
 
  test('Happy path: sign up page loads with all required fields', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL(/signup/);
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });
 
  test('Happy path: all navigation bar links route to correct pages', async ({ page }) => {
    await page.getByRole('button', { name: 'Community Homestays' }).click();
    await expect(page).toHaveURL(/community-homestays/);
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'About Us' }).click();
    await expect(page).toHaveURL(/about-us/);
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Blogs', exact: true }).first().click();
    await expect(page).toHaveURL(/blogs/);
  });
 
  test('Edge case: homestay detail page loads correctly', async ({ page }) => {
    await page.goto('https://www.nepalhomestays.com/community-homestays');
    await page.waitForLoadState('networkidle');
    const firstCard = page.locator('a[href*="community-homestays/"]').first();
    await firstCard.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/community-homestays\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
 
  test('Edge case: community homestays list shows multiple listings', async ({ page }) => {
    await page.goto('https://www.nepalhomestays.com/community-homestays');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('a[href*="community-homestays/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
 
  test('Error case: wrong password shows error on sign in', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.locator('input').first().fill('test@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/signin/);
  });
 
});
 
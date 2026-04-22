const { test, expect } = require('@playwright/test');

const APP_URL = 'https://app.usebubbles.com';

async function open(page, path = '/') {
  await page.goto(`${APP_URL}${path}`, { waitUntil: 'domcontentloaded' });
}

async function assertAuthOrWorkspaceShell(page) {
  const authHeading = page.getByRole('heading', { name: /Create an account|Welcome back/i });

  if (await authHeading.count()) {
    await expect(authHeading.first()).toBeVisible();
    await expect(
      page
        .getByRole('button', {
          name: /Continue with Google|Continue with Microsoft|Continue with email|Log in/i,
        })
        .first()
    ).toBeVisible();
    return;
  }

  await expect(page.getByRole('button', { name: /Settings|Help|Upgrade|New Recording/i }).first()).toBeVisible();
}

// homepage smoke
test('homepage loads', async ({ page }) => {
  const response = await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

  expect(response).not.toBeNull();
  expect(response.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Bubbles/i);
  await expect(page.locator('#root')).toBeVisible();
});

// metadata check
test('homepage has core metadata', async ({ page }) => {
  await open(page);

  await expect(page.locator('meta[name="application-name"]')).toHaveAttribute('content', 'Bubbles');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /record|meeting|screen/i
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Bubbles/i);
});

// /login currently resolves to not-found guidance
test('login route shows support guidance', async ({ page }) => {
  await open(page, '/login');

  await expect(page.getByRole('heading', { name: /This link was not found/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /hello@usebubbles\.com/i })).toBeVisible();
});

// account entry UI appears on homepage for anonymous visitors
test('homepage exposes auth or workspace entry points', async ({ page }) => {
  await open(page);

  await assertAuthOrWorkspaceShell(page);
});

// static web app assets
test('app shell references manifest and scripts', async ({ page }) => {
  await open(page);

  await expect(page.locator('link[rel="manifest"][href="/manifest.json"]')).toHaveCount(1);
  await expect(page.locator('link[rel="shortcut icon"]')).toHaveCount(1);
  await expect(page.locator('script[src*="/static/js/main."]')).toHaveCount(1);
});

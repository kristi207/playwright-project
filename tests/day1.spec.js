
const { test, expect } = require('@playwright/test');


const TEST_USER = {
  fullName: 'Test User',
  password: 'Test@1234',
};

async function typeLikeUser(locator, value) {
  await locator.click();
  await locator.fill('');
  await locator.type(value, { delay: 50 });
}

test('User can complete signup form and reach OTP verification', async ({ page }) => {
  const uniqueEmail = `kristipanta${Date.now()}@betaninjas.com`;

 
  await page.goto('https://nepalhomestays.com');

  // Make sure the page loaded correctly
  await expect(page).toHaveTitle(/Nepal Homestays/i);

  await page.getByRole('link', { name: 'Sign Up' }).click();

  // Wait for the Create Account page to load
  await expect(page).toHaveURL(/signup/i);
  await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

  await typeLikeUser(page.getByPlaceholder('Enter your full name'), TEST_USER.fullName);
  await typeLikeUser(page.getByPlaceholder('Enter your email or mobile number'), uniqueEmail);
  await typeLikeUser(page.getByPlaceholder('Create a strong password'), TEST_USER.password);
  await typeLikeUser(page.getByPlaceholder('Confirm your password'), TEST_USER.password);

  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.getByRole('heading', { name: 'Verify Your Account' })).toBeVisible({ timeout: 20000 });
  const verificationDialog = page.getByRole('dialog', { name: 'Verify Your Account' });
  await expect(verificationDialog.getByRole('textbox')).toBeVisible();
  await expect(verificationDialog.getByRole('button', { name: 'Verify Code' })).toBeVisible();
  await expect(verificationDialog.getByText('Enter the 6-digit verification code sent to your email.')).toBeVisible();

  console.log('Signup reaches OTP verification step.');
});



test('Shows error when passwords do not match', async ({ page }) => {

  await page.goto('https://nepalhomestays.com/signup');

  await page.getByPlaceholder('Enter your full name').fill('Test User');
  await page.getByPlaceholder('Enter your email or mobile number').fill('test@example.com');
  await page.getByPlaceholder('Create a strong password').fill('Test@1234');

  // Intentionally type a DIFFERENT confirm password
  await page.getByPlaceholder('Confirm your password').fill('WrongPassword');

  await page.getByRole('button', { name: 'Create Account' }).click();

  // Expect the error message shown in your screenshot
  await expect(page.getByText('Passwords do not match')).toBeVisible();

  console.log('Password mismatch validation works!');
});

test('negative login - shows error message', async ({ page }) => {
  // Open website
  await page.goto('https://nepalhomestays.com');

  // Click Login
  await page.getByRole('link', { name: 'Login' }).click();

  // Enter wrong details
  await page.getByPlaceholder('Enter your email or mobile number').fill('wrong@example.com');
  await page.getByPlaceholder('Enter your password').fill('wrongpassword');

  // Click Login button
  await page.getByRole('button', { name: /login/i }).click();

  // Check error message appears
  await expect(page.getByText(/error|invalid|incorrect/i)).toBeVisible();
});
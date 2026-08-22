import { test } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

test('debug login process', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Step 1: Navigate to home...');
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Check localStorage before login
  const beforeLogin = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    return {
      keys,
      authKey: keys.find(k => k.startsWith('sb-') && k.endsWith('-auth-token')),
    };
  });
  console.log('localStorage before login:', beforeLogin);

  console.log('Step 2: Open admin login modal...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);

  const adminBtn = page.locator('button:has-text("Admin")').first();
  await adminBtn.click();
  await page.waitForTimeout(500);

  console.log('Step 3: Fill login form...');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);

  console.log('Step 4: Submit login...');
  await page.click('button[type="submit"]');

  // Wait for either redirect to /admin or error message
  console.log('Step 5: Waiting for response...');

  // Wait up to 10 seconds
  let redirected = false;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(500);
    const url = page.url();
    console.log(`  Check ${i + 1}: URL = ${url}`);

    if (url.includes('/admin')) {
      redirected = true;
      console.log('SUCCESS: Redirected to admin!');
      break;
    }

    // Check for error message
    const errorVisible = await page.locator('.bg-red-50').isVisible();
    if (errorVisible) {
      const errorText = await page.locator('.bg-red-50').textContent();
      console.log('ERROR MESSAGE:', errorText);
      break;
    }
  }

  // Check localStorage after login attempt
  const afterLogin = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const authKey = keys.find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    let authData = null;
    if (authKey) {
      try {
        authData = JSON.parse(localStorage.getItem(authKey) || '{}');
      } catch { /* malformed auth token — treat as absent */ }
    }
    return {
      keys,
      authKey,
      hasUser: !!authData?.user,
      userId: authData?.user?.id,
      email: authData?.user?.email,
    };
  });
  console.log('localStorage after login:', afterLogin);

  await page.screenshot({ path: 'tests/screenshots/debug-login-result.png', fullPage: true });

  if (redirected) {
    console.log('\n=== LOGIN SUCCESSFUL ===');

    // Try to access gallery
    await page.goto('/admin/gallery');
    await page.waitForTimeout(2000);

    const finalUrl = page.url();
    console.log('Gallery URL:', finalUrl);

    if (finalUrl.includes('/admin/gallery')) {
      console.log('Gallery access: SUCCESS');
    } else {
      console.log('Gallery access: DENIED (redirected to', finalUrl, ')');
    }

    await page.screenshot({ path: 'tests/screenshots/debug-gallery-access.png', fullPage: true });
  } else {
    console.log('\n=== LOGIN FAILED ===');
  }
});

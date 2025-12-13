import { test, expect } from '@playwright/test';

// Set these environment variables or replace with your credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

test.describe('Gallery Admin Reordering', () => {

  test('test gallery drag and drop with login', async ({ page }) => {
    // Step 1: Navigate to home and login
    console.log('Step 1: Navigating to home page...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to footer and click Admin
    console.log('Step 2: Opening admin login...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const adminBtn = page.locator('button:has-text("Admin")').first();
    await adminBtn.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'tests/screenshots/01-login-modal.png' });

    // Check if we have credentials
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.log('');
      console.log('========================================');
      console.log('MANUAL LOGIN REQUIRED');
      console.log('Login in browser, then press "Resume" in Inspector');
      console.log('Or set ADMIN_EMAIL and ADMIN_PASSWORD env vars');
      console.log('========================================');
      console.log('');

      // Pause for manual login - user can resume when ready
      await page.pause();
    } else {
      // Auto login
      console.log('Step 3: Logging in with provided credentials...');
      await page.fill('input[type="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');

      // Wait for redirect to admin
      await page.waitForURL('**/admin**', { timeout: 15000 });
    }

    console.log('Step 4: Navigating to gallery...');
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/02-gallery-page.png', fullPage: true });

    // Verify we're on the gallery page
    const pageUrl = page.url();
    console.log('Current URL:', pageUrl);
    expect(pageUrl).toContain('/admin/gallery');

    // Look for gallery image cards
    const imageCards = page.locator('[draggable="true"]');
    const cardCount = await imageCards.count();
    console.log(`Found ${cardCount} draggable image cards`);

    if (cardCount < 2) {
      console.log('Need at least 2 images to test drag and drop');
      return;
    }

    // Get the position badges to verify order
    const getPositions = async () => {
      const badges = await page.locator('.rounded-full:has-text("#")').allTextContents();
      return badges;
    };

    const beforePositions = await getPositions();
    console.log('Positions before drag:', beforePositions);

    await page.screenshot({ path: 'tests/screenshots/03-before-drag.png', fullPage: true });

    // Step 5: Test drag and drop
    console.log('Step 5: Testing drag and drop...');
    const firstCard = imageCards.nth(0);
    const secondCard = imageCards.nth(1);

    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    console.log('First card position:', firstBox);
    console.log('Second card position:', secondBox);

    if (!firstBox || !secondBox) {
      console.log('Could not get bounding boxes');
      return;
    }

    // Method 1: Try Playwright's built-in dragTo
    console.log('Attempting Playwright dragTo...');
    try {
      await firstCard.dragTo(secondCard, {
        sourcePosition: { x: firstBox.width / 2, y: firstBox.height / 2 },
        targetPosition: { x: secondBox.width / 2, y: secondBox.height / 2 },
      });
      await page.waitForTimeout(500);
    } catch (e) {
      console.log('dragTo error:', e);
    }

    await page.screenshot({ path: 'tests/screenshots/04-after-dragTo.png', fullPage: true });

    // Check for unsaved changes banner
    const unsavedBanner = page.locator('text=unsaved changes');
    let hasBanner = await unsavedBanner.isVisible();
    console.log('Unsaved changes banner visible after dragTo:', hasBanner);

    // Method 2: If dragTo didn't work, try manual drag with dispatchEvent
    if (!hasBanner) {
      console.log('Trying manual drag events...');

      // Use evaluate to dispatch native drag events
      await page.evaluate(async () => {
        const cards = document.querySelectorAll('[draggable="true"]');
        if (cards.length < 2) return;

        const firstCard = cards[0] as HTMLElement;
        const secondCard = cards[1] as HTMLElement;

        const createDragEvent = (type: string, target: Element) => {
          const event = new DragEvent(type, {
            bubbles: true,
            cancelable: true,
            dataTransfer: new DataTransfer(),
          });
          return event;
        };

        // Dispatch drag events
        const dragStartEvent = createDragEvent('dragstart', firstCard);
        dragStartEvent.dataTransfer?.setData('text/plain', '0');
        firstCard.dispatchEvent(dragStartEvent);

        await new Promise(r => setTimeout(r, 100));

        const dragOverEvent = createDragEvent('dragover', secondCard);
        secondCard.dispatchEvent(dragOverEvent);

        await new Promise(r => setTimeout(r, 100));

        const dropEvent = createDragEvent('drop', secondCard);
        secondCard.dispatchEvent(dropEvent);

        await new Promise(r => setTimeout(r, 100));

        const dragEndEvent = createDragEvent('dragend', firstCard);
        firstCard.dispatchEvent(dragEndEvent);
      });

      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/05-after-manual-drag.png', fullPage: true });

      hasBanner = await unsavedBanner.isVisible();
      console.log('Unsaved changes banner visible after manual drag:', hasBanner);
    }

    // Final verification
    const afterPositions = await getPositions();
    console.log('Positions after drag:', afterPositions);

    await page.screenshot({ path: 'tests/screenshots/06-final-state.png', fullPage: true });

    // Report results
    if (hasBanner) {
      console.log('SUCCESS: Drag and drop triggered unsaved changes banner!');
    } else {
      console.log('ISSUE: Drag and drop did not trigger state change');
    }
  });
});

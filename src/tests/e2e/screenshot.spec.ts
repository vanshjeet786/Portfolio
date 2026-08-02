import { test } from '@playwright/test';
test('take a screenshot', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(6000); // Wait for the new preloader to finish
  await page.screenshot({ path: 'screenshot.png' });
});

import { test, expect } from '@playwright/test';
test('take a screenshot', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'screenshot.png' });
});

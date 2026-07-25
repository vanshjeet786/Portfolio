import { test, expect } from '@playwright/test';

test.describe('App Shell E2E Test', () => {
  test('should load the app shell and canvas layer successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check that the root div of the App exists
    const appRoot = page.locator('#app-root');
    await expect(appRoot).toBeVisible();

    // Check that the Canvas container exists
    const canvasContainer = page.locator('#canvas-container');
    await expect(canvasContainer).toBeVisible();

    // Check that our custom UI layout layer is present
    const uiLayer = page.locator('#ui-layout-layer');
    await expect(uiLayer).toBeVisible();
  });
});

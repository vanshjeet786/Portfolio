import { test } from '@playwright/test';

test('check for errors while scrolling', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`CONSOLE ERROR: ${msg.text()}`);
    }
  });
  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });

  await page.goto('/');

  // Wait until body is present to evaluate
  await page.waitForSelector('body', { state: 'attached' });
  await page.waitForTimeout(1000);

  // Jump to specific scene to bypass lenis timing issues
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('scene-change', { detail: 5 }));
  });
  
  await page.waitForTimeout(2000); // Give it time to render the scene

  if (errors.length > 0) {
    throw new Error('Found errors:\n' + errors.join('\n'));
  }
});

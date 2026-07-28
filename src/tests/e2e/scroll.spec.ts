import { test, expect } from '@playwright/test';

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
  await page.waitForTimeout(2000);

  // simulate scrolling by dispatching wheel events
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(500);
  }
  
  if (errors.length > 0) {
    throw new Error('Found errors:\n' + errors.join('\n'));
  }
});

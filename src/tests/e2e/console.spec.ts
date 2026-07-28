import { test, expect } from '@playwright/test';

test('check console for errors', async ({ page }) => {
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
  
  if (errors.length > 0) {
    throw new Error('Found errors:\n' + errors.join('\n'));
  }
});

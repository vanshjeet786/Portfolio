# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> App Shell E2E Test >> should load the app shell and canvas layer successfully
- Location: src/tests/e2e/app.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#app-root')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#app-root')

```

```yaml
- text: V A N S H J E E T
- heading [level=2]
- navigation "Scene progress":
  - text: 00%
  - button "Jump to Home": Home
  - button "Jump to Compass": Compass
  - button "Jump to WHERE AM I?": WHERE AM I?
  - button "Jump to Skillometer": Skillometer
  - button "Jump to WHERE AM I NOW?": WHERE AM I NOW?
  - button "Jump to Mini Projects": Mini Projects
  - button "Jump to WHERE AM I AGAIN?": WHERE AM I AGAIN?
  - button "Jump to Stance": Stance
  - button "Jump to I THINK THIS IS THE END": I THINK THIS IS THE END
  - button "Jump to Vansh": Vansh
- text: Scroll
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('App Shell E2E Test', () => {
  4  |   test('should load the app shell and canvas layer successfully', async ({ page }) => {
  5  |     // Navigate to homepage
  6  |     await page.goto('/');
  7  | 
  8  |     // Check that the root div of the App exists
  9  |     const appRoot = page.locator('#app-root');
> 10 |     await expect(appRoot).toBeVisible();
     |                           ^ Error: expect(locator).toBeVisible() failed
  11 | 
  12 |     // Check that the Canvas container exists
  13 |     const canvasContainer = page.locator('#canvas-container');
  14 |     await expect(canvasContainer).toBeVisible();
  15 | 
  16 |     // Check that our custom UI layout layer is present
  17 |     const uiLayer = page.locator('#ui-layout-layer');
  18 |     await expect(uiLayer).toBeVisible();
  19 |   });
  20 | });
  21 | 
```
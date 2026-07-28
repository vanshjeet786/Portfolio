# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scroll.spec.ts >> check for errors while scrolling
- Location: src/tests/e2e/scroll.spec.ts:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForTimeout: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic:
    - generic [ref=e9]:
      - generic [ref=e10]: V
      - generic [ref=e11]: A
      - generic [ref=e12]: "N"
      - generic [ref=e13]: S
      - generic [ref=e14]: H
      - generic [ref=e15]: J
      - generic [ref=e16]: E
      - generic [ref=e17]: E
      - generic [ref=e18]: T
    - generic:
      - heading "Personality tests are horoscopes for LinkedIn." [level=2]
    - generic:
      - generic: Scroll
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('check for errors while scrolling', async ({ page }) => {
  4  |   const errors: string[] = [];
  5  |   page.on('console', msg => {
  6  |     if (msg.type() === 'error') {
  7  |       errors.push(`CONSOLE ERROR: ${msg.text()}`);
  8  |     }
  9  |   });
  10 |   page.on('pageerror', error => {
  11 |     errors.push(`PAGE ERROR: ${error.message}`);
  12 |   });
  13 | 
  14 |   await page.goto('/');
  15 |   await page.waitForTimeout(2000);
  16 | 
  17 |   // simulate scrolling by dispatching wheel events
  18 |   for (let i = 0; i < 20; i++) {
  19 |     await page.mouse.wheel(0, 100);
> 20 |     await page.waitForTimeout(500);
     |                ^ Error: page.waitForTimeout: Test timeout of 30000ms exceeded.
  21 |   }
  22 |   
  23 |   if (errors.length > 0) {
  24 |     throw new Error('Found errors:\n' + errors.join('\n'));
  25 |   }
  26 | });
  27 | 
```
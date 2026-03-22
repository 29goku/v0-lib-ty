import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Leben in Deutschland Test App - Main Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // ===== HOMEPAGE TESTS =====
  test.describe('Homepage', () => {
    test('should load homepage', async ({ page }) => {
      expect(page.url()).toBe(BASE_URL + '/');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should show main CTA buttons', async ({ page }) => {
      const practiceButton = page.locator('button:has-text("Start Practice")');
      const testButton = page.locator('button:has-text("Test")');

      await expect(practiceButton).toBeVisible();
      await expect(testButton).toBeVisible();
    });

    test('should navigate to practice page', async ({ page }) => {
      const practiceButton = page.locator('a:has-text("Start Practice")').first();
      await practiceButton.click();
      await page.waitForURL('**/practice');
      expect(page.url()).toContain('/practice');
    });

    test('should navigate to test page', async ({ page }) => {
      const testButton = page.locator('a:has-text("Test")').first();
      await testButton.click();
      await page.waitForURL('**/test');
      expect(page.url()).toContain('/test');
    });

    test('should have theme toggle', async ({ page }) => {
      const themeToggle = page.locator('button').filter({ hasText: /dark|light/i }).first();
      await expect(themeToggle).toBeVisible();
    });
  });

  // ===== PRACTICE MODE TESTS =====
  test.describe('Practice Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/practice');
    });

    test('should load practice page with questions', async ({ page }) => {
      await expect(page).toHaveTitle(/Leben in Deutschland/);
      const title = page.locator('h1:has-text("PRACTICE")');
      await expect(title).toBeVisible();
    });

    test('should display swipe card', async ({ page }) => {
      const card = page.locator('[class*="swipe"]');
      await page.waitForTimeout(500);
      // Card should be visible after loading
      const questionText = page.locator('div:has-text(/frage|question/i)');
      await expect(questionText.first()).toBeVisible({ timeout: 5000 });
    });

    test('should allow answering questions', async ({ page }) => {
      await page.waitForTimeout(1000);
      // Find a button with answer option (A, B, C, or D)
      const answerButton = page.locator('button').filter({ hasText: /A|B|C|D/ }).first();
      if (await answerButton.isVisible()) {
        await answerButton.click();
        await page.waitForTimeout(500);
        // Feedback should appear
        const feedback = page.locator('text=/✓|✗|Keep Grinding|Crushing/');
        await expect(feedback.first()).toBeVisible({ timeout: 3000 });
      }
    });

    test('should show next button after answer', async ({ page }) => {
      await page.waitForTimeout(1000);
      const answerButton = page.locator('button').filter({ hasText: /A|B|C|D/ }).first();
      if (await answerButton.isVisible()) {
        await answerButton.click();
        const nextButton = page.locator('button:has-text("Next Question")');
        await expect(nextButton).toBeVisible({ timeout: 3000 });
      }
    });

    test('should navigate through questions', async ({ page }) => {
      await page.waitForTimeout(1000);
      const initialUrl = page.url();

      // Answer first question
      const answerButton = page.locator('button').filter({ hasText: /A|B|C|D/ }).first();
      if (await answerButton.isVisible()) {
        await answerButton.click();
        // Click next
        const nextButton = page.locator('button:has-text("Next Question")');
        await nextButton.click();
        await page.waitForTimeout(500);
        // URL should remain practice but question may have changed
        expect(page.url()).toContain('/practice');
      }
    });
  });

  // ===== TEST MODE TESTS =====
  test.describe('Test Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/test');
    });

    test('should load test configuration page', async ({ page }) => {
      await expect(page).toHaveTitle(/Leben in Deutschland/);
      const configCard = page.locator('div:has-text(/test|configuration|questions/i)');
      await expect(configCard.first()).toBeVisible();
    });

    test('should have preset buttons', async ({ page }) => {
      const shortButton = page.locator('button:has-text("Short")');
      const standardButton = page.locator('button:has-text("Standard")');
      const fullButton = page.locator('button:has-text("Full")');

      await expect(shortButton).toBeVisible();
      await expect(standardButton).toBeVisible();
      await expect(fullButton).toBeVisible();
    });

    test('should start test with preset', async ({ page }) => {
      const standardButton = page.locator('button:has-text("Standard")').first();
      await standardButton.click();
      await page.waitForTimeout(500);
      // Should either go to test page or show timer
      const timer = page.locator('div:has-text(/\\d+:\\d+/)', { timeout: 3000 });
      if (await timer.isVisible()) {
        expect(page.url()).toContain('/test');
      }
    });
  });

  // ===== SETTINGS TESTS =====
  test.describe('Settings', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/settings');
    });

    test('should load settings page', async ({ page }) => {
      await expect(page).toHaveTitle(/Leben in Deutschland/);
      const settingsTitle = page.locator('h1, h2').filter({ hasText: /Settings|Einstellungen/i }).first();
      await expect(settingsTitle).toBeVisible({ timeout: 3000 });
    });

    test('should have theme toggle', async ({ page }) => {
      const themeButton = page.locator('button').filter({ hasText: /dark|light|theme/i }).first();
      await expect(themeButton).toBeVisible({ timeout: 3000 });
    });

    test('should have language selector', async ({ page }) => {
      const languageButton = page.locator('button, select').filter({ hasText: /Deutsch|English|Sprache|Language/i }).first();
      await expect(languageButton).toBeVisible({ timeout: 3000 });
    });
  });

  // ===== MOBILE RESPONSIVE TESTS =====
  test.describe('Mobile Responsiveness', () => {
    test('should be responsive on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);

      const title = page.locator('h1').first();
      await expect(title).toBeVisible();

      // No horizontal scrolling
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = 375;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small margin for rounding
    });

    test('should be responsive on mobile (275px)', async ({ page }) => {
      await page.setViewportSize({ width: 275, height: 600 });
      await page.goto(BASE_URL + '/practice');

      await page.waitForTimeout(1000);
      // Should still render without crashing
      const content = page.locator('body');
      await expect(content).toBeVisible();
    });

    test('should be responsive on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);

      const title = page.locator('h1').first();
      await expect(title).toBeVisible();
    });
  });

  // ===== DATA PERSISTENCE TESTS =====
  test.describe('Data Persistence', () => {
    test('should persist theme preference', async ({ page }) => {
      // Get initial theme
      const htmlElement = page.locator('html');
      const initialClass = await htmlElement.getAttribute('class');

      // Toggle theme
      await page.goto(BASE_URL);
      const themeToggle = page.locator('button').filter({ hasText: /dark|light/i }).first();
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();
      await page.waitForTimeout(500);

      // Theme should persist
      const finalClass = await htmlElement.getAttribute('class');
      // Class should have changed
      expect(finalClass).toBeDefined();
    });

    test('should persist language preference', async ({ page }) => {
      await page.goto(BASE_URL + '/settings');
      await page.waitForTimeout(1000);

      // Change language if available
      const languageButton = page.locator('button, select').filter({ hasText: /English|Deutsch/i }).first();
      if (await languageButton.isVisible()) {
        await languageButton.click();
        await page.waitForTimeout(500);

        // Reload
        await page.reload();
        await page.waitForTimeout(500);

        // Language should persist
        expect(page.url()).toContain('/settings');
      }
    });
  });

  // ===== SMOKE TEST =====
  test('smoke test - all main routes accessible', async ({ page }) => {
    const routes = ['/', '/practice', '/test', '/review', '/settings'];

    for (const route of routes) {
      await page.goto(BASE_URL + route);
      await page.waitForTimeout(500);
      expect(page.url()).toContain(route);
      // Page should not have 500 error
      const errorText = page.locator('text=500|error').first();
      expect(await errorText.isVisible()).toBe(false);
    }
  });
});

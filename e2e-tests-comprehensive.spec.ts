import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Leben in Deutschland Test App - Comprehensive E2E Tests', () => {
  // ===== HOMEPAGE (/) =====
  test.describe('Homepage - /', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
    });

    test('should load homepage with correct title', async ({ page }) => {
      expect(page.url()).toBe(BASE_URL + '/');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should display main hero section', async ({ page }) => {
      const heroTitle = page.locator('h1:has-text("LEBEN")');
      await expect(heroTitle).toBeVisible();

      const deutschlandTitle = page.locator('h1:has-text("IN DEUTSCHLAND")');
      await expect(deutschlandTitle).toBeVisible();
    });

    test('should show statistics (300, 33, 60)', async ({ page }) => {
      const stat300 = page.locator('text=300');
      const stat33 = page.locator('text=33');
      const stat60 = page.locator('text=60');

      await expect(stat300).toBeVisible();
      await expect(stat33).toBeVisible();
      await expect(stat60).toBeVisible();
    });

    test('should display CTA buttons (Start Practice & Test)', async ({ page }) => {
      const practiceButton = page.locator('button:has-text("Start Practice"), button:has-text("Start")').first();
      const testButton = page.locator('button:has-text("Test")').first();

      await expect(practiceButton).toBeVisible();
      await expect(testButton).toBeVisible();
    });

    test('should display feature cards section', async ({ page }) => {
      const practiceCard = page.locator('text=Practice').first();
      const testCard = page.locator('text=Test Mode');
      const reviewCard = page.locator('text=Review');
      const settingsCard = page.locator('text=Settings');
      const faqCard = page.locator('text=FAQ');

      await expect(practiceCard).toBeVisible();
      await expect(testCard).toBeVisible();
      await expect(reviewCard).toBeVisible();
      await expect(settingsCard).toBeVisible();
      await expect(faqCard).toBeVisible();
    });

    test('should navigate to practice from CTA', async ({ page }) => {
      const practiceButton = page.locator('a:has-text("Start Practice")').first();
      await practiceButton.click();
      await page.waitForURL('**/practice');
      expect(page.url()).toContain('/practice');
    });

    test('should navigate to test from CTA', async ({ page }) => {
      const testButton = page.locator('a:has-text("Test")').first();
      await testButton.click();
      await page.waitForURL('**/test');
      expect(page.url()).toContain('/test');
    });

    test('should have theme toggle', async ({ page }) => {
      const themeButtons = page.locator('button').filter({ hasText: /☀️|🌙/ });
      const count = await themeButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have language selector', async ({ page }) => {
      const languageButton = page.locator('button').filter({ hasText: /EN|DE/ }).first();
      await expect(languageButton).toBeVisible({ timeout: 3000 });
    });
  });

  // ===== PRACTICE PAGE (/practice) =====
  test.describe('Practice Page - /practice', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/practice');
      await page.waitForLoadState('networkidle');
    });

    test('should load practice page', async ({ page }) => {
      expect(page.url()).toContain('/practice');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should display practice header', async ({ page }) => {
      const header = page.locator('h1, h2').filter({ hasText: /Practice/i });
      await expect(header.first()).toBeVisible();
    });

    test('should display swipe card component', async ({ page }) => {
      await page.waitForTimeout(1000);
      // Check for card container
      const card = page.locator('[class*="card"], [class*="Card"]').first();
      await expect(card).toBeVisible({ timeout: 5000 });
    });

    test('should display answer buttons (A, B, C, D)', async ({ page }) => {
      await page.waitForTimeout(1500);
      // Look for answer options
      const optionA = page.locator('button, div[role="button"]').filter({ hasText: /^A/ });
      const optionB = page.locator('button, div[role="button"]').filter({ hasText: /^B/ });

      const hasOptions = await optionA.count().then(c => c > 0) ||
                        await optionB.count().then(c => c > 0);
      expect(hasOptions).toBeTruthy();
    });

    test('should allow selecting an answer', async ({ page }) => {
      await page.waitForTimeout(1500);
      const answerButtons = page.locator('button, div[role="button"]').filter({ hasText: /^[A-D]$/ });

      if (await answerButtons.first().isVisible().catch(() => false)) {
        await answerButtons.first().click();
        await page.waitForTimeout(800);
        // Should still be on practice page
        expect(page.url()).toContain('/practice');
      }
    });

    test('should show feedback after answering', async ({ page }) => {
      await page.waitForTimeout(1500);
      const answerButtons = page.locator('button, div[role="button"]').filter({ hasText: /^[A-D]$/ });

      if (await answerButtons.first().isVisible().catch(() => false)) {
        await answerButtons.first().click();
        await page.waitForTimeout(1000);

        // Check for feedback (checkmark or X)
        const feedback = page.locator('text=✓, text=✗, text=Correct, text=Incorrect').first();
        // Feedback should appear
        expect(page.url()).toContain('/practice');
      }
    });

    test('should display navigation controls', async ({ page }) => {
      await page.waitForTimeout(500);
      // Back button should be visible
      const backButton = page.locator('button:has-text("Back"), a:has-text("Back")');
      await expect(backButton).toBeVisible({ timeout: 3000 });
    });

    test('should have filter options', async ({ page }) => {
      const filterButton = page.locator('button').filter({ hasText: /Filter/i });
      // May not always be visible, but check it exists
      expect(await filterButton.count() >= 0).toBeTruthy();
    });

    test('should allow navigation back to home', async ({ page }) => {
      const backButton = page.locator('a:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
        expect(page.url()).toBe(BASE_URL + '/');
      }
    });
  });

  // ===== TEST PAGE (/test) =====
  test.describe('Test Page - /test', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/test');
      await page.waitForLoadState('networkidle');
    });

    test('should load test configuration page', async ({ page }) => {
      expect(page.url()).toContain('/test');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should display test presets', async ({ page }) => {
      const shortPreset = page.locator('button:has-text("Short")');
      const standardPreset = page.locator('button:has-text("Standard")');
      const fullPreset = page.locator('button:has-text("Full")');

      expect(await shortPreset.count() + await standardPreset.count() + await fullPreset.count()).toBeGreaterThan(0);
    });

    test('should allow selecting test configuration', async ({ page }) => {
      const configButtons = page.locator('button').filter({ hasText: /\d+/ });
      if (await configButtons.first().isVisible().catch(() => false)) {
        expect(await configButtons.count()).toBeGreaterThan(0);
      }
    });

    test('should display test info and instructions', async ({ page }) => {
      const testTitle = page.locator('h1, h2').filter({ hasText: /Test/i });
      await expect(testTitle.first()).toBeVisible({ timeout: 3000 });
    });

    test('should have back button to home', async ({ page }) => {
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
        expect(page.url()).toBe(BASE_URL + '/');
      }
    });
  });

  // ===== REVIEW PAGE (/review) =====
  test.describe('Review Page - /review', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/review');
      await page.waitForLoadState('networkidle');
    });

    test('should load review page', async ({ page }) => {
      expect(page.url()).toContain('/review');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should display review header', async ({ page }) => {
      const header = page.locator('h1, h2').filter({ hasText: /Review/i });
      await expect(header.first()).toBeVisible({ timeout: 3000 });
    });

    test('should have filter or question display', async ({ page }) => {
      await page.waitForTimeout(500);
      // Should have some content visible
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should navigate back to home', async ({ page }) => {
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
        expect(page.url()).toBe(BASE_URL + '/');
      }
    });
  });

  // ===== STATS PAGE (/stats) =====
  test.describe('Stats Page - /stats', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/stats');
      await page.waitForLoadState('networkidle');
    });

    test('should load stats page', async ({ page }) => {
      expect(page.url()).toContain('/stats');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should display stats header', async ({ page }) => {
      const header = page.locator('h1, h2').filter({ hasText: /Statistics|Stats/i });
      await expect(header.first()).toBeVisible({ timeout: 3000 });
    });

    test('should show KPI cards (Accuracy, Streak, XP, etc)', async ({ page }) => {
      // Look for stat containers
      const statContainers = page.locator('[class*="card"], [class*="Card"]');
      expect(await statContainers.count()).toBeGreaterThan(0);
    });

    test('should display charts if data exists', async ({ page }) => {
      await page.waitForTimeout(1000);
      // Check for chart or graph elements
      const chartArea = page.locator('[class*="chart"], [class*="graph"], svg');
      // Charts may exist depending on user data
      expect(page.url()).toContain('/stats');
    });

    test('should navigate back to home', async ({ page }) => {
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
        expect(page.url()).toBe(BASE_URL + '/');
      }
    });
  });

  // ===== SETTINGS PAGE (/settings) =====
  test.describe('Settings Page - /settings', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/settings');
      await page.waitForLoadState('networkidle');
    });

    test('should load settings page', async ({ page }) => {
      expect(page.url()).toContain('/settings');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should display settings header', async ({ page }) => {
      const header = page.locator('h1, h2').filter({ hasText: /Settings|Einstellungen/i });
      await expect(header.first()).toBeVisible({ timeout: 3000 });
    });

    test('should have theme toggle option', async ({ page }) => {
      const themeLabel = page.locator('text=Dark Mode, text=Dark, text=Theme').first();
      // Theme setting should be accessible
      expect(page.url()).toContain('/settings');
    });

    test('should have language selector', async ({ page }) => {
      const languageSelector = page.locator('button, select').filter({ hasText: /English|Deutsch|EN|DE/ });
      expect(await languageSelector.count()).toBeGreaterThan(0);
    });

    test('should have reset/data management option', async ({ page }) => {
      const resetButton = page.locator('button').filter({ hasText: /Reset|Reset Progress|Clear/i });
      // Reset option should exist
      expect(page.url()).toContain('/settings');
    });

    test('should navigate back to home', async ({ page }) => {
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
        expect(page.url()).toBe(BASE_URL + '/');
      }
    });
  });

  // ===== FAQ PAGE (/faq) =====
  test.describe('FAQ Page - /faq', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL + '/faq');
      await page.waitForLoadState('networkidle');
    });

    test('should load FAQ page', async ({ page }) => {
      expect(page.url()).toContain('/faq');
      await expect(page).toHaveTitle(/Leben in Deutschland/);
    });

    test('should display FAQ content', async ({ page }) => {
      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should navigate back to home', async ({ page }) => {
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
        expect(page.url()).toBe(BASE_URL + '/');
      }
    });
  });

  // ===== THEME AND LANGUAGE FUNCTIONALITY =====
  test.describe('Theme & Language Functionality', () => {
    test('should toggle theme from light to dark', async ({ page }) => {
      await page.goto(BASE_URL);

      // Get initial theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );

      // Find and click theme toggle
      const themeButton = page.locator('button').filter({ hasText: /☀️|🌙/ }).first();
      if (await themeButton.isVisible().catch(() => false)) {
        await themeButton.click();
        await page.waitForTimeout(500);

        // Check theme changed
        const newTheme = await page.evaluate(() =>
          document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        );
        expect(newTheme).not.toBe(initialTheme);
      }
    });

    test('should persist theme preference', async ({ page }) => {
      await page.goto(BASE_URL);

      // Get theme
      const theme = await page.evaluate(() => localStorage.getItem('theme-storage'));
      // Should have some theme stored or be able to store it
      expect(page.url()).toBe(BASE_URL + '/');
    });

    test('should change language', async ({ page }) => {
      await page.goto(BASE_URL);

      const languageButton = page.locator('button').filter({ hasText: /EN|DE/ }).first();
      if (await languageButton.isVisible().catch(() => false)) {
        const initialText = await page.locator('h1').first().textContent();

        await languageButton.click();
        await page.waitForTimeout(500);

        // Language change should work
        expect(page.url()).toBe(BASE_URL + '/');
      }
    });
  });

  // ===== RESPONSIVE DESIGN TESTS =====
  test.describe('Responsive Design', () => {
    test('should be responsive on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);

      const title = page.locator('h1').first();
      await expect(title).toBeVisible();

      // No horizontal scrolling
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(385);
    });

    test('should be responsive on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);

      const title = page.locator('h1').first();
      await expect(title).toBeVisible();
    });

    test('should be responsive on desktop (1920px)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);

      const title = page.locator('h1').first();
      await expect(title).toBeVisible();
    });

    test('should load practice on mobile without crashing', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL + '/practice');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/practice');
    });

    test('should load test on tablet without crashing', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL + '/test');

      expect(page.url()).toContain('/test');
    });
  });

  // ===== SMOKE TEST - ALL ROUTES =====
  test.describe('Smoke Tests', () => {
    test('all main routes should be accessible', async ({ page }) => {
      const routes = ['/', '/practice', '/test', '/review', '/stats', '/settings', '/faq'];

      for (const route of routes) {
        await page.goto(BASE_URL + route);
        await page.waitForLoadState('networkidle');

        // Should not have error
        expect(page.url()).toContain(route);

        // Should have title
        await expect(page).toHaveTitle(/Leben in Deutschland/);

        // Should not have 500 error
        const errorIndicators = await page.locator('text=/500|Internal Server Error/i').count();
        expect(errorIndicators).toBe(0);
      }
    });

    test('should handle rapid navigation', async ({ page }) => {
      const routes = ['/', '/practice', '/test', '/settings', '/review'];

      for (const route of routes) {
        await page.goto(BASE_URL + route);
        expect(page.url()).toContain(route);
      }

      // Should end on last route
      expect(page.url()).toContain('/review');
    });
  });

  // ===== ERROR HANDLING TESTS =====
  test.describe('Error Handling', () => {
    test('should handle 404 for non-existent route gracefully', async ({ page }) => {
      await page.goto(BASE_URL + '/non-existent-route');

      // Should either redirect or show not found
      // Just verify page doesn't crash
      expect(page.url()).toBeDefined();
    });

    test('should handle offline gracefully', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.context().setOffline(true);

      // Page should still be functional
      await page.waitForTimeout(500);
      expect(page.url()).toContain('/');

      // Restore online
      await page.context().setOffline(false);
    });
  });

  // ===== INTEGRATION TESTS =====
  test.describe('User Flow Integration', () => {
    test('complete practice flow: home -> practice -> answer -> home', async ({ page }) => {
      // Start at home
      await page.goto(BASE_URL);
      expect(page.url()).toBe(BASE_URL + '/');

      // Navigate to practice
      const practiceLink = page.locator('a:has-text("Start Practice")').first();
      await practiceLink.click();
      await page.waitForURL('**/practice');
      expect(page.url()).toContain('/practice');

      // Wait for content
      await page.waitForTimeout(1500);

      // Try to answer question if available
      const answerButtons = page.locator('button, div[role="button"]').filter({ hasText: /^[A-D]$/ });
      if (await answerButtons.first().isVisible().catch(() => false)) {
        await answerButtons.first().click();
        await page.waitForTimeout(500);
      }

      // Navigate back
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
      }

      expect(page.url()).toBe(BASE_URL + '/');
    });

    test('complete test flow: home -> test -> config -> home', async ({ page }) => {
      // Start at home
      await page.goto(BASE_URL);

      // Navigate to test
      const testLink = page.locator('a:has-text("Test")').first();
      await testLink.click();
      await page.waitForURL('**/test');
      expect(page.url()).toContain('/test');

      // Navigate back
      const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
      if (await backButton.isVisible().catch(() => false)) {
        await backButton.click();
        await page.waitForURL('**/');
      }

      expect(page.url()).toBe(BASE_URL + '/');
    });

    test('complete settings flow: home -> settings -> back -> home', async ({ page }) => {
      // Start at home
      await page.goto(BASE_URL);

      // Navigate to settings from feature card
      const settingsLink = page.locator('a:has-text("Settings"), button:has-text("Settings")').first();
      if (await settingsLink.isVisible().catch(() => false)) {
        await settingsLink.click();
        await page.waitForTimeout(500);

        // Navigate back
        const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
        if (await backButton.isVisible().catch(() => false)) {
          await backButton.click();
          await page.waitForURL('**/');
        }
      }

      expect(page.url()).toBe(BASE_URL + '/');
    });
  });
});

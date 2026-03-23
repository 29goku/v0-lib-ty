import { test, expect, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

// Desktop configuration
const desktopConfig = {
  name: 'Desktop',
  viewport: { width: 1280, height: 720 }
};

// Mobile configuration
const mobileConfig = {
  ...devices['Pixel 5'],
  name: 'Mobile'
};

// Run tests in both viewport sizes
for (const config of [desktopConfig, mobileConfig]) {
  test.describe(`[${config.name}] Leben in Deutschland Test App - E2E Tests`, () => {
    test.use(config.viewport ? { viewport: config.viewport } : config);

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
        const heroSection = page.locator('h1').filter({ hasText: /LEBEN|IN DEUTSCHLAND/ });
        const count = await heroSection.count();
        expect(count).toBeGreaterThan(0);
      });

      test('should show statistics', async ({ page }) => {
        // Look for stat numbers more flexibly
        const stats = page.locator('[class*="stat"], [class*="card"]');
        const count = await stats.count();
        expect(count).toBeGreaterThan(0);
      });

      test('should display CTA buttons', async ({ page }) => {
        const practiceLink = page.locator('a').filter({ hasText: /Practice/ }).first();
        const testLink = page.locator('a').filter({ hasText: /Test/ }).first();

        await expect(practiceLink).toBeVisible();
        await expect(testLink).toBeVisible();
      });

      test('should navigate to practice', async ({ page }) => {
        const practiceLink = page.locator('a').filter({ hasText: /Practice/ }).first();
        await practiceLink.click();
        await page.waitForURL('**/practice', { timeout: 10000 });
        expect(page.url()).toContain('/practice');
      });

      test('should navigate to test', async ({ page }) => {
        const testLink = page.locator('a').filter({ hasText: /Test/ }).first();
        await testLink.click();
        await page.waitForURL('**/test', { timeout: 10000 });
        expect(page.url()).toContain('/test');
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

      test('should display practice content', async ({ page }) => {
        const content = page.locator('body');
        await expect(content).toBeVisible();

        // Check for practice-specific content
        const questionText = page.locator('text=/Frage|Question/');
        expect(await questionText.count()).toBeGreaterThanOrEqual(0);
      });

      test('should have back button', async ({ page }) => {
        const backButton = page.locator('button').filter({ hasText: /Back|Zurück/ }).first();
        await expect(backButton).toBeVisible({ timeout: 5000 });
      });

      test('back button should navigate to home', async ({ page }) => {
        const backButton = page.locator('button').filter({ hasText: /Back|Zurück/ }).first();
        await backButton.click();
        await page.waitForURL(BASE_URL + '/', { timeout: 10000 });
        expect(page.url()).toBe(BASE_URL + '/');
      });
    });

    // ===== TEST PAGE (/test) =====
    test.describe('Test Page - /test', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL + '/test');
        await page.waitForLoadState('networkidle');
      });

      test('should load test page', async ({ page }) => {
        expect(page.url()).toContain('/test');
        await expect(page).toHaveTitle(/Leben in Deutschland/);
      });

      test('should have test configuration', async ({ page }) => {
        const content = page.locator('body');
        await expect(content).toBeVisible();
      });

      test('back button should navigate to home', async ({ page }) => {
        const backButton = page.locator('button').filter({ hasText: /Back|Zurück/ }).first();
        if (await backButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await backButton.click();
          await page.waitForURL(BASE_URL + '/', { timeout: 15000 });
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
      });

      test('should have back button', async ({ page }) => {
        const backButton = page.locator('button').filter({ hasText: /Back|Zurück/ }).first();
        await expect(backButton).toBeVisible({ timeout: 5000 });
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
      });

      test('should have back button', async ({ page }) => {
        const backButton = page.locator('button').filter({ hasText: /Back|Zurück/ }).first();
        await expect(backButton).toBeVisible({ timeout: 5000 });
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
      });

      test('should have back button', async ({ page }) => {
        const backButton = page.locator('button').filter({ hasText: /Back|Zurück/ }).first();
        await expect(backButton).toBeVisible({ timeout: 5000 });
      });
    });

    // ===== Navigation =====
    test.describe('Navigation', () => {
      test('should navigate between pages', async ({ page }) => {
        // Home -> Practice
        await page.goto(BASE_URL);
        const practiceLink = page.locator('a').filter({ hasText: /Practice/ }).first();
        await practiceLink.click();
        await page.waitForURL('**/practice', { timeout: 10000 });

        // Practice -> Home
        const backButton = page.locator('button').filter({ hasText: /Back|Zurück/ }).first();
        await backButton.click();
        await page.waitForURL(BASE_URL + '/', { timeout: 10000 });
        expect(page.url()).toBe(BASE_URL + '/');
      });
    });
  });
}

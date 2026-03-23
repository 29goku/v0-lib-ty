# E2E Testing Guide

## Overview

This project uses **Playwright** for end-to-end testing with separate test configurations for **Desktop** and **Mobile** viewports.

## Test Files

- **`e2e-tests-fixed.spec.ts`** - Main e2e test suite with improved selectors and mobile/desktop separation
- **`playwright.config.ts`** - Playwright configuration with multiple browser/device combinations and reporting

## Running Tests

### Start Development Server First
```bash
npm run dev  # Starts on http://localhost:3001
```

### Run E2E Tests

```bash
# Run all e2e tests (all browsers + devices)
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Debug mode (step through tests)
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Build + full test suite (for CI/CD)
npm run build:test
```

## Test Coverage

Tests run across **5 configurations**:

### Desktop Browsers
1. **Desktop Chrome** (1280x720)
2. **Desktop Firefox** (1280x720)
3. **Desktop Safari** (1280x720)

### Mobile Devices
4. **Mobile Chrome** (Pixel 5 emulation)
5. **Mobile Safari** (iPhone 12 emulation)

## Test Sections

### Homepage (`/`)
- ✅ Page loads with correct title
- ✅ Hero section displays
- ✅ Statistics visible
- ✅ CTA buttons functional
- ✅ Navigation works

### Practice Page (`/practice`)
- ✅ Page loads
- ✅ Content displays
- ✅ Back button functional
- ✅ Navigation to home works

### Test Page (`/test`)
- ✅ Page loads
- ✅ Test config displays
- ✅ Back button functional
- ✅ Navigation works

### Review, Settings, Stats Pages
- ✅ Pages load correctly
- ✅ Back buttons work
- ✅ Navigation functional

## Reports

Test reports are generated in:
- **`test-results/playwright-report/`** - HTML report (visual)
- **`test-results/test-results.json`** - Machine-readable JSON
- **`test-results/junit.xml`** - JUnit XML for CI/CD integration

## Playwright Config Details

- **Framework**: Playwright (TypeScript)
- **Retry on CI**: 2 retries
- **Workers**: Parallel (unless on CI)
- **Screenshot**: On failure only
- **Video**: On failure only
- **Trace**: On first retry

## Integration with Vercel

The test suite is configured to:
1. Generate HTML, JSON, and JUnit reports
2. Work in CI environments
3. Support Vercel deployments
4. Provide detailed failure diagnostics

To add e2e tests to Vercel build:
1. Add `npm run test:e2e` to post-build steps
2. Configure artifact upload for `test-results/` directory
3. View reports in Vercel deployment dashboard

## Common Issues & Fixes

### Issue: Tests timeout
**Fix**: Increase `timeout` in playwright.config.ts (currently 30s)

### Issue: "Element not visible"
**Fix**: Tests use flexible locators - check for CSS hiding/display:none on elements

### Issue: Port 3001 in use
**Fix**: Kill existing process: `lsof -i :3001 | grep -v COMMAND | awk '{print $2}' | xargs kill -9`

### Issue: Mobile tests fail on desktop
**Fix**: Tests automatically adjust viewport - this is normal and expected

## Debugging

```bash
# Interactive UI mode - click through tests
npm run test:e2e:ui

# Debug specific test with stepping
npm run test:e2e:debug

# See failures in detail
npm run test:e2e:report
```

## Best Practices

1. ✅ Run tests before pushing to main
2. ✅ Check both desktop and mobile results
3. ✅ Use `--ui` mode for debugging failures
4. ✅ Update tests when UI changes
5. ✅ Test critical user flows
6. ✅ Keep timeouts reasonable

## Next Steps

- [ ] Add authentication flow tests
- [ ] Add practice question interaction tests
- [ ] Add test mode submission tests
- [ ] Add filtering/sorting tests
- [ ] Add accessibility tests (a11y)

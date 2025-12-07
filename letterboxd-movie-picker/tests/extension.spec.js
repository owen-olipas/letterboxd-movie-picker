const { test, expect, chromium } = require("@playwright/test");
const path = require("path");
const { LIST_URLS, SELECTORS, TEST_DATA, TIMEOUTS } = require("./test-constants");
const { mockPagesWithoutMovieComponents } = require("./helpers");

test.describe("Letterboxd Movie Picker Extension", () => {
  let extensionPath;
  let context;
  let browser;

  test.beforeAll(() => {
    extensionPath = path.join(__dirname, "..");
  });

  test.beforeEach(async () => {
    // Launch Chrome with the extension loaded
    browser = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    context = browser;
  });

  test.afterEach(async () => {
    await browser.close();
  });

  test("should load extension and inject button on list page", async () => {
    const page = (await context.pages()[0]) || (await context.newPage());

    await page.goto(LIST_URLS.testList, {
      waitUntil: "networkidle",
    });

    // Wait for the page to load
    await page.waitForSelector(SELECTORS.actionsPanel, {
      timeout: TIMEOUTS.long,
      state: "attached",
    });

    // Wait for extension to inject the button (content scripts run after page load)
    const spinButton = page.locator(SELECTORS.spinButton);
    await expect(spinButton).toBeVisible({ timeout: TIMEOUTS.pageLoad });
  });

  test("should show loading overlay when button is clicked", async () => {
    const page = (await context.pages()[0]) || (await context.newPage());
    await page.goto(LIST_URLS.testList, {
      waitUntil: "networkidle",
    });

    await page.waitForSelector(SELECTORS.actionsPanel, {
      timeout: TIMEOUTS.long,
      state: "attached",
    });

    // Wait for extension to inject button
    const spinButton = page.locator(SELECTORS.spinButton);
    await expect(spinButton).toBeVisible({ timeout: TIMEOUTS.pageLoad });

    // Click the spin button
    await spinButton.click();

    // Check if loading overlay appears
    const loadingOverlay = page.locator(SELECTORS.movieOverlay);
    await expect(loadingOverlay).toBeVisible();

    // Check if loading text is present
    const loadingText = page.locator(SELECTORS.loadingText);
    await expect(loadingText).toBeVisible();
  });

  test("should display error overlay when selector fails", async () => {
    const page = (await context.pages()[0]) || (await context.newPage());

    // Mock pages without movie components (selector will fail)
    // This simulates page structure change
    await mockPagesWithoutMovieComponents(page, LIST_URLS.testList);

    await page.goto(LIST_URLS.testList, {
      waitUntil: "networkidle",
    });
    await page.waitForSelector(SELECTORS.actionsPanel, {
      timeout: TIMEOUTS.long,
      state: "attached",
    });

    // Wait for extension to inject button
    const spinButton = page.locator(SELECTORS.spinButton);
    await expect(spinButton).toBeVisible({ timeout: TIMEOUTS.pageLoad });

    await spinButton.click();

    // Wait for error overlay (selector failure should trigger error)
    const errorOverlay = page.locator(SELECTORS.movieOverlay);
    await expect(errorOverlay).toBeVisible({ timeout: TIMEOUTS.veryLong });

    const errorTitle = page.locator(SELECTORS.errorTitle);
    await expect(errorTitle).toBeVisible();

    // Selector failures should show contact info (actual errors)
    const contactText = page.locator(SELECTORS.contactText);
    await expect(contactText).toBeVisible();

    const emailLink = page.locator(SELECTORS.emailLink);
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveText(TEST_DATA.email);
  });
});

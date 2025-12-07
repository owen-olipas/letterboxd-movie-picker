const { test, expect, chromium } = require("@playwright/test");
const path = require("path");
const {
  LIST_URLS,
  SELECTORS,
  TEST_DATA,
  TIMEOUTS,
} = require("./test-constants");
const { mockPagesWithoutMovieComponents } = require("./helpers");

test.describe("Letterboxd Movie Picker - Error Overlay Tests", () => {
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

  test("should display error overlay when selector fails", async () => {
    const page = (await context.pages()[0]) || (await context.newPage());

    // Navigate to a list page
    await page.goto(LIST_URLS.testList, {
      waitUntil: "networkidle",
    });

    // Wait for the actions panel
    await page.waitForSelector(SELECTORS.actionsPanel, {
      timeout: TIMEOUTS.veryLong,
    });

    // Wait for extension to inject button
    const spinButton = page.locator(SELECTORS.spinButton);
    await expect(spinButton).toBeVisible();

    // Route requests to return HTML without movie components (selector will fail)
    // This simulates page structure change
    await mockPagesWithoutMovieComponents(page, LIST_URLS.testList);

    // Click the button
    await spinButton.click();

    // Wait for error overlay to appear (selector failure should trigger error)
    const errorOverlay = page.locator(SELECTORS.movieOverlay);
    await expect(errorOverlay).toBeVisible({ timeout: TIMEOUTS.pageLoad });

    // Check error title
    const errorTitle = page.locator(SELECTORS.errorTitle);
    await expect(errorTitle).toBeVisible();

    const contactText = page.locator(SELECTORS.contactText);
    await expect(contactText).toBeVisible();

    const emailLink = page.locator(SELECTORS.emailLink);
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveText(TEST_DATA.email);
  });
});

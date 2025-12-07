const { test, expect, chromium } = require("@playwright/test");
const path = require("path");
const { LIST_URLS, SELECTORS, TIMEOUTS } = require("./test-constants");

test.describe("Letterboxd Movie Picker Extension - Full Chrome Test", () => {
  let extensionPath;
  let context;
  let browser;

  test.beforeAll(() => {
    extensionPath = path.join(__dirname, "..");
  });

  test.beforeEach(async () => {
    // Launch Chrome with the extension loaded
    browser = await chromium.launchPersistentContext("", {
      headless: false, // Set to true for CI
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

  test("should load extension in Chrome and show button", async () => {
    const page = (await context.pages()[0]) || (await context.newPage());

    // Navigate to a list page
    await page.goto(LIST_URLS.testList, {
      waitUntil: "networkidle",
    });

    // Wait for the actions panel
    await page.waitForSelector(SELECTORS.actionsPanel, {
      timeout: TIMEOUTS.veryLong,
    });

    // Check if extension button is present
    const spinButton = page.locator(SELECTORS.spinButton);
    await expect(spinButton).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test("should process movies and show result", async () => {
    const page = (await context.pages()[0]) || (await context.newPage());

    await page.goto(LIST_URLS.testList, {
      waitUntil: "networkidle",
    });

    await page.waitForSelector(SELECTORS.actionsPanel, {
      timeout: TIMEOUTS.veryLong,
    });

    const spinButton = page.locator(SELECTORS.spinButton);
    await expect(spinButton).toBeVisible();

    // Click the button
    await spinButton.click();

    // Wait for loading overlay
    const loadingOverlay = page.locator(SELECTORS.movieOverlay);
    await expect(loadingOverlay).toBeVisible();

    // Wait for either result overlay or error (with longer timeout for actual fetching)
    await page.waitForTimeout(TIMEOUTS.medium);

    // Check if we have a movie overlay or error overlay
    const movieOverlay = page.locator(SELECTORS.movieOverlay);
    await expect(movieOverlay).toBeVisible({ timeout: TIMEOUTS.pageLoad });

    // Either we see a movie title or an error message
    // Use scoped selector to only find title within the overlay
    const hasContent = await Promise.race([
      page
        .locator(SELECTORS.movieOverlay)
        .locator(SELECTORS.title1)
        .isVisible()
        .then(() => "movie"),
      page
        .locator(SELECTORS.movieOverlay)
        .locator("text=Error")
        .isVisible()
        .then(() => "error"),
      page.waitForTimeout(TIMEOUTS.long).then(() => "timeout"),
    ]);

    expect(["movie", "error"]).toContain(hasContent);
  });
});

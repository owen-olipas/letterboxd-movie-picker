// Helper functions for e2e tests

/**
 * Wait for extension to be loaded
 */
async function waitForExtension(page, timeout = 10000) {
  await page.waitForFunction(
    () => {
      return (
        document.querySelector('button:has-text("🎲 Pick a Movie")') !== null
      );
    },
    { timeout }
  );
}

/**
 * Mock Letterboxd page with movies
 */
async function mockLetterboxdPageWithMovies(page, movieCount = 10) {
  const movies = Array.from({ length: movieCount }, (_, i) => ({
    title: `Test Movie ${i + 1}`,
    link: `/film/test-movie-${i + 1}/`,
  }));

  await page.route("**/watchlist/**", (route) => {
    const html = `
      <html>
        <body>
          <ul class="actions-panel">
            <ul></ul>
          </ul>
          <div class="react-component" data-component-class="LazyPoster" 
               data-item-link="/film/test-movie-1/" 
               data-item-full-display-name="Test Movie 1">
          </div>
        </body>
      </html>
    `;
    route.fulfill({
      status: 200,
      body: html,
      headers: { "Content-Type": "text/html" },
    });
  });
}

/**
 * Mock empty Letterboxd page
 */
async function mockEmptyLetterboxdPage(page) {
  await page.route("**/watchlist/**", (route) => {
    route.fulfill({
      status: 200,
      body: '<html><body><ul class="actions-panel"><ul></ul></ul></body></html>',
      headers: { "Content-Type": "text/html" },
    });
  });
}

/**
 * Mock movie poster fetch
 */
async function mockPosterFetch(
  page,
  posterUrl = "https://example.com/poster.jpg"
) {
  await page.route("**/film/**", (route) => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Movie",
      image: posterUrl,
    };
    route.fulfill({
      status: 200,
      body: `<html>
        <body>
          <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
        </body>
      </html>`,
      headers: { "Content-Type": "text/html" },
    });
  });
}

/**
 * Mock pages without movie components to simulate selector failure
 * This causes getAllMovies to throw an error (page structure changed)
 * @param {Page} page - Playwright page object
 * @param {string} listUrl - The base URL of the list to mock
 */
async function mockPagesWithoutMovieComponents(page, listUrl) {
  const listUrlBase = listUrl.replace(/\/page\/\d+\/?$/, "").replace(/\/$/, "");

  await page.route("**/letterboxd.com/**", (route) => {
    const url = route.request().url();
    const requestMethod = route.request().method();

    // Only intercept GET requests (fetch requests), not navigation
    if (requestMethod !== "GET") {
      route.continue();
      return;
    }

    const urlPath = new URL(url).pathname;
    const urlWithoutPage = url
      .replace(/\/page\/\d+\/?$/, "")
      .replace(/\/$/, "");

    // Intercept pages that getAllMovies will fetch
    if (urlPath.includes("/page/") || urlWithoutPage === listUrlBase) {
      // Return HTML without movie components - selector will fail
      route.fulfill({
        status: 200,
        body: `<!DOCTYPE html>
          <html>
            <head><title>Test List</title></head>
            <body>
              <ul class="actions-panel"><ul></ul></ul>
              <!-- No movie components - selector will fail -->
            </body>
          </html>`,
        headers: { "Content-Type": "text/html" },
      });
    } else {
      // Allow other requests to proceed normally
      route.continue();
    }
  });
}

module.exports = {
  waitForExtension,
  mockLetterboxdPageWithMovies,
  mockEmptyLetterboxdPage,
  mockPosterFetch,
  mockPagesWithoutMovieComponents,
};

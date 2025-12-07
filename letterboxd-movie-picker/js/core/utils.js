function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found`));
    }, timeout);
  });
}

// Cache for movies by URL
const moviesCache = {
  data: new Map(), // URL -> { movies, timestamp }

  get(url) {
    const normalizedUrl = url.replace(/\/page\/\d+\/?$/, "");
    const cached = this.data.get(normalizedUrl);
    if (!cached) return null;

    // Cache is valid (no expiration for now, but can add timestamp check later)
    return cached.movies;
  },

  set(url, movies) {
    const normalizedUrl = url.replace(/\/page\/\d+\/?$/, "");
    this.data.set(normalizedUrl, {
      movies,
      timestamp: Date.now(),
    });
  },

  clear(url) {
    if (url) {
      const normalizedUrl = url.replace(/\/page\/\d+\/?$/, "");
      this.data.delete(normalizedUrl);
    } else {
      // Clear all cache
      this.data.clear();
    }
  },

  // Check if URL changed (different list/watchlist)
  isUrlChanged(currentUrl) {
    const normalizedUrl = currentUrl.replace(/\/page\/\d+\/?$/, "");
    const lastUrl = this._lastUrl;
    this._lastUrl = normalizedUrl;
    return lastUrl && lastUrl !== normalizedUrl;
  },
};

async function getMoviePoster(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const script = doc.querySelector('script[type="application/ld+json"]');
    if (!script) return null;

    const json = JSON.parse(
      script.textContent.replace(/\/\*[\s\S]*?\*\//g, "").trim()
    );
    return json.image || null;
  } catch (e) {
    console.error("Failed to fetch poster", e);
    return null;
  }
}

async function fetchPage(url, isFirstPage = false) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch page: HTTP ${res.status}`);
    }

    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    // Verify page actually loaded (has body element)
    const body = doc.querySelector("body");
    if (!body) {
      throw new Error("Failed to parse page: page did not load properly");
    }

    const items = doc.querySelectorAll(
      '.react-component[data-component-class="LazyPoster"]'
    );

    // If selector finds nothing:
    // - On first page: it's an error (page structure changed - Letterboxd doesn't allow empty lists)
    // - On subsequent pages: it's normal (end of pagination, return empty array)
    if (!items.length) {
      if (isFirstPage) {
        // First page with no items = selector failed or page structure changed
        // This is an actual error since Letterboxd doesn't allow empty lists
        throw new Error();
      }
      // Subsequent pages with no items = end of list (normal, not an error)
      return [];
    }

    const movies = Array.from(items, (el) => {
      const link = el.dataset.itemLink;
      const title = el.dataset.itemFullDisplayName;
      return link && title
        ? { title, fullUrl: `https://letterboxd.com${link}` }
        : null;
    }).filter(Boolean);

    // Return empty array if no valid movies found (not null, to distinguish from errors)
    return movies.length > 0 ? movies : [];
  } catch (e) {
    console.error("Failed to fetch page", e);
    throw e; // Re-throw to propagate error
  }
}

async function getAllMovies(baseUrl, onProgress = null) {
  const movies = [];
  baseUrl = baseUrl.replace(/\/page\/\d+\/?$/, "");

  try {
    for (let page = 1; ; page++) {
      const url = page === 1 ? baseUrl : `${baseUrl}page/${page}/`;
      const isFirstPage = page === 1;
      const pageMovies = await fetchPage(url, isFirstPage);

      // fetchPage returns [] for empty pagination pages, throws for errors
      if (!pageMovies || pageMovies.length === 0) break;

      movies.push(...pageMovies);
      if (onProgress) onProgress(page, pageMovies.length);
    }
  } catch (e) {
    // Re-throw errors from fetchPage (selector failures, fetch failures, etc.)
    throw e;
  }

  return movies;
}

function selectRandomMovie(movies) {
  return movies[Math.floor(Math.random() * movies.length)];
}

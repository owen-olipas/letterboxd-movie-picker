async function initializeExtension() {
  if (!/watchlist|list/.test(window.location.pathname)) return;

  let actionsList = document.querySelector(".actions-panel ul");
  if (!actionsList) {
    try {
      actionsList = await waitForElement(".actions-panel ul", 3000);
    } catch (e) {
      console.error(
        "Letterboxd Movie Picker: Could not find actions panel.",
        e
      );
      // Selector failure - show error with contact info
      createErrorOverlay();
      return;
    }
  }

  const spinButton = createSpinButton();
  const spinListItem = document.createElement("li");
  spinListItem.appendChild(spinButton);
  actionsList.appendChild(spinListItem);

  let isProcessing = false;
  let currentOverlay = null;

  // Clear cache if URL changed (different list/watchlist)
  if (moviesCache.isUrlChanged(window.location.href)) {
    moviesCache.clear();
  }

  spinButton.addEventListener("click", async (e) => {
    if (isProcessing) return;

    if (currentOverlay) currentOverlay.remove();

    const currentUrl = window.location.href;
    const forceRefresh = e.shiftKey; // Shift+Click to force refresh

    // Check cache first (unless forcing refresh)
    let movies = null;
    if (!forceRefresh) {
      movies = moviesCache.get(currentUrl);
    }

    // If cache miss or force refresh, fetch movies
    if (!movies) {
      isProcessing = true;
      spinButton.disabled = true;

      const { overlay: loadingOverlay, title: loadingTitle } =
        createLoadingOverlay(() => {
          cleanup();
        });
      currentOverlay = loadingOverlay;

      const cleanup = () => {
        if (loadingOverlay.parentNode) loadingOverlay.remove();
        isProcessing = false;
        spinButton.disabled = false;
        currentOverlay = null;
      };

      try {
        movies = await getAllMovies(currentUrl, (page) => {
          loadingTitle.textContent = `Loading... (page ${page})`;
        });

        loadingOverlay.remove();
        currentOverlay = null;

        // Letterboxd doesn't allow empty lists, so if we get 0 movies,
        // it means the page structure changed or selector failed
        if (!movies.length) {
          cleanup();
          throw new Error();
        }

        // Cache the movies
        moviesCache.set(currentUrl, movies);

        isProcessing = false;
        spinButton.disabled = false;
      } catch (error) {
        cleanup();
        console.error("Error fetching movies", error);
        createErrorOverlay();
        return;
      }
    }

    // Use cached or freshly fetched movies
    await animateMovies(movies, 3000, 100);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}

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

  spinButton.addEventListener("click", async () => {
    if (isProcessing) return;

    if (currentOverlay) currentOverlay.remove();

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
      const movies = await getAllMovies(window.location.href, (page) => {
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

      isProcessing = false;
      spinButton.disabled = false;
      await animateMovies(movies, 3000, 100);
    } catch (e) {
      cleanup();
      console.error("Error fetching movies", e);

      createErrorOverlay();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}

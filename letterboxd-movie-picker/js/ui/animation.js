function startTitleShuffle(titleElement, movies, intervalTime) {
  return setInterval(() => {
    titleElement.textContent =
      movies[Math.floor(Math.random() * movies.length)].title;
  }, intervalTime);
}

function updateMovieDisplay(movie, imgElement, titleElement, titleDiv) {
  if (movie.poster) {
    imgElement.src = movie.poster;
    imgElement.alt = `${movie.title} poster`;
    imgElement.style.display = "block";
  }
  titleElement.textContent = movie.title;
  titleDiv.style.marginTop = "12px";
}

async function animateMovies(movies, duration = 3000, intervalTime = 100) {
  if (!movies?.length) return;

  const finalMovie = selectRandomMovie(movies);
  const { overlay, box, title, titleDiv, img } = createMovieOverlay(finalMovie);

  let shuffleInterval = null;
  let timeoutId = null;

  const cleanup = () => {
    if (shuffleInterval) clearInterval(shuffleInterval);
    if (timeoutId) clearTimeout(timeoutId);
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      cleanup();
      overlay.remove();
    }
  });

  const posterPromise = getMoviePoster(finalMovie.fullUrl).then(
    (url) => (finalMovie.poster = url)
  );

  shuffleInterval = startTitleShuffle(title, movies, intervalTime);

  timeoutId = setTimeout(async () => {
    await posterPromise;
    cleanup();
    updateMovieDisplay(finalMovie, img, title, titleDiv);

    const buttonsDiv = createActionButtons(
      () => {
        cleanup();
        overlay.remove();
      },
      () => {
        cleanup();
        overlay.remove();
        animateMovies(movies, duration, intervalTime);
      }
    );

    box.appendChild(buttonsDiv);
  }, duration);
}

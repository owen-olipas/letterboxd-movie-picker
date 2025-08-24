// Fetch poster from Letterboxd film page
async function getMoviePosterFromFilmPage(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;

        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const script = doc.querySelector('script[type="application/ld+json"]');
        if (!script) return null;

        const cleanText = script.textContent.replace(/\/\*.*?\*\//gs, "").trim();
        const json = JSON.parse(cleanText);
        return json.image || null;
    } catch (e) {
        console.error("Failed to fetch poster", e);
        return null;
    }
}

// Get all movies from a list/watchlist page
async function getAllMovies(baseUrl, onProgress = null) {
    let movies = [];
    let page = 1;
    baseUrl = baseUrl.replace(/page\/\d+\/?$/, "");

    while (true) {
        const url = page === 1 ? baseUrl : `${baseUrl}page/${page}/`;
        const res = await fetch(url);
        if (!res.ok) break;

        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const movieItems = [...doc.querySelectorAll('[data-component-class="globals.comps.LazyPoster"]')];
        if (!movieItems.length) break;

        const pageMovies = movieItems.map(el => {
            const link = el.dataset.itemLink;
            return {
                title: el.dataset.itemFullDisplayName,
                fullUrl: `https://letterboxd.com${link}`,
            };
        });

        movies.push(...pageMovies);

        if (onProgress) {
            onProgress(page, movieItems.length); // update overlay
        }

        page++;
    }

    return movies;
}

// Animate random movie picker
async function animateMovies(movies, duration = 3000, intervalTime = 100) {
    // Pick final movie immediately
    const finalMovie = movies[Math.floor(Math.random() * movies.length)];

    // --- Overlay ---
    const overlay = document.createElement("div");
    overlay.className = "movie-overlay";

    const box = document.createElement("div");
    box.className = "movie-box";

    // Intro
    const intro = document.createElement("p");
    intro.textContent = "You will watch...";

    const introDiv = document.createElement("div");
    introDiv.className = "body-text -prose -hero clear js-collapsible-text";
    introDiv.appendChild(intro);

    // Title placeholder
    const titleDiv = document.createElement("div");
    titleDiv.className = "title-div"

    const title = document.createElement("h1");
    title.className = "title-1 prettify";
    title.textContent = "";

    titleDiv.appendChild(title);

    // Poster container
    const posterDiv = document.createElement("div");
    posterDiv.className = "poster film-poster";

    const img = document.createElement("img");
    img.style.display = "none";

    // Link wrapper for poster
    const link = document.createElement("a");
    link.href = finalMovie.fullUrl;
    link.className = "frame has-menu";
    link.title = finalMovie.title;
    link.target = "";
    
    const frameTitle = document.createElement("span");
    frameTitle.className = "frame-title";
    frameTitle.textContent = finalMovie.title;
    
    const overlaySpan = document.createElement("span");
    overlaySpan.className = "overlay";
    
    const overlayActions = document.createElement("span");
    overlayActions.className = "overlay-actions -w125";
    overlayActions.hidden = true;
    
    link.append(frameTitle, overlaySpan, overlayActions);
    posterDiv.append(img, link);


    box.append(introDiv, posterDiv, titleDiv);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Fetch poster concurrently
    const posterPromise = getMoviePosterFromFilmPage(finalMovie.fullUrl)
        .then(url => finalMovie.poster = url)
        .catch(() => finalMovie.poster = null);

    // Shuffle titles for aesthetics
    const shuffle = setInterval(() => {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        title.textContent = randomMovie.title;
    }, intervalTime);

    setTimeout(async () => {
        await posterPromise;
        if (finalMovie.poster) {
            img.src = finalMovie.poster;
            img.alt = finalMovie.title + " poster";
            img.style.display = "block";
        }

        clearInterval(shuffle);
        
        title.textContent = finalMovie.title;
        titleDiv.style.marginTop = "12px";

        // Buttons container
        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "movie-buttons";

        const closeBtn = document.createElement("button");
        closeBtn.className = "button button-delete -destructive";
        closeBtn.innerHTML = `<span class="label">Close</span>`;
        closeBtn.addEventListener("click", () => overlay.remove());

        const rerollBtn = document.createElement("button");
        rerollBtn.className = "button -action button-action";
        rerollBtn.innerHTML = `<span class="label">Reroll</span>`;
        rerollBtn.addEventListener("click", () => {
            overlay.remove();
            animateMovies(movies, duration, intervalTime);
        });

        buttonsDiv.append(closeBtn, rerollBtn);
        box.appendChild(buttonsDiv);
    }, duration);
}

// Check if on list/watchlist page
if (/watchlist|list/.test(window.location.pathname)) {
    const spinButton = document.createElement("button");
    spinButton.textContent = "🎲 Pick a Movie";
    spinButton.style.cursor = "pointer";

    const actionsList = document.querySelector(".actions-panel ul");
    const spinListItem = document.createElement("li");
    spinListItem.appendChild(spinButton);
    actionsList.appendChild(spinListItem);

    spinButton.addEventListener("click", async () => {
        // Show overlay immediately
        const placeholderOverlay = document.createElement("div");
        placeholderOverlay.className = "movie-overlay";
        const box = document.createElement("div");
        box.className = "movie-box";
        
        const intro = document.createElement("p");
        intro.textContent = "You will watch...";

        const introDiv = document.createElement("div");
        introDiv.className = "body-text -prose -hero clear js-collapsible-text";
        introDiv.appendChild(intro);

        const title = document.createElement("h5");
        title.textContent = "Loading... (page 1)";
        title.style.fontStyle = "italic"
        box.append(introDiv, title);
        placeholderOverlay.appendChild(box);
        document.body.appendChild(placeholderOverlay);

        // Fetch movies
        const movies = await getAllMovies(window.location.href, (page, count) => {
            title.textContent = `Loading... (page ${page})`;
        });
        placeholderOverlay.remove();
        if (movies.length === 0) return;

        animateMovies(movies);
    });
}

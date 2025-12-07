function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "movie-overlay";
  return overlay;
}

function createLoadingOverlay(onCancel) {
  const overlay = createOverlay();
  const box = document.createElement("div");
  box.className = "movie-box";

  const intro = document.createElement("p");
  intro.textContent = "You will watch...";
  const introDiv = document.createElement("div");
  introDiv.className = "body-text -prose -hero clear js-collapsible-text";
  introDiv.appendChild(intro);

  const title = document.createElement("h5");
  title.textContent = "Loading... (page 1)";
  title.style.fontStyle = "italic";

  box.append(introDiv, title);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  if (onCancel) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) onCancel();
    });
  }

  return { overlay, title };
}

function createMovieOverlay(movie) {
  const overlay = createOverlay();
  const box = document.createElement("div");
  box.className = "movie-box";

  const intro = document.createElement("p");
  intro.textContent = "You will watch...";
  const introDiv = document.createElement("div");
  introDiv.className = "body-text -prose -hero clear js-collapsible-text";
  introDiv.appendChild(intro);

  const titleDiv = document.createElement("div");
  titleDiv.className = "title-div";
  const title = document.createElement("h1");
  title.className = "title-1 prettify";
  title.textContent = "";
  titleDiv.appendChild(title);

  const posterDiv = document.createElement("div");
  posterDiv.className = "poster film-poster";
  const img = document.createElement("img");
  img.style.display = "none";

  const link = document.createElement("a");
  link.href = movie.fullUrl;
  link.className = "frame has-menu";
  link.title = movie.title;
  link.target = "";

  const frameTitle = document.createElement("span");
  frameTitle.className = "frame-title";
  frameTitle.textContent = movie.title;

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

  return { overlay, box, title, titleDiv, img };
}

function createActionButtons(onClose, onReroll) {
  const div = document.createElement("div");
  div.className = "movie-buttons";

  const closeBtn = document.createElement("button");
  closeBtn.className = "button button-delete -destructive";
  closeBtn.innerHTML = `<span class="label">Close</span>`;
  closeBtn.onclick = onClose;

  const rerollBtn = document.createElement("button");
  rerollBtn.className = "button -action button-action";
  rerollBtn.innerHTML = `<span class="label">Reroll</span>`;
  rerollBtn.onclick = onReroll;

  div.append(closeBtn, rerollBtn);
  return div;
}

function createSpinButton() {
  const button = document.createElement("button");
  button.textContent = "🎲 Pick a Movie";
  button.style.cursor = "pointer";
  return button;
}

function createErrorOverlay() {
  const overlay = createOverlay();
  const box = document.createElement("div");
  box.className = "movie-box";

  // Error icon - vertical stack of 3 colored divs
  const iconContainer = document.createElement("div");
  iconContainer.style.display = "flex";
  iconContainer.style.justifyContent = "center";
  iconContainer.style.flexDirection = "row";
  iconContainer.style.gap = "4px";
  iconContainer.style.alignItems = "center";
  iconContainer.style.marginBottom = "24px";

  const diameter = "40px";

  // Orange div left
  const orangeDiv = document.createElement("div");
  orangeDiv.style.width = diameter;
  orangeDiv.style.height = diameter;
  orangeDiv.style.backgroundColor = "#ff8000"; // Orange
  orangeDiv.style.borderRadius = "50%";

  // Green div with X (middle)
  const greenDiv = document.createElement("div");
  greenDiv.style.width = diameter;
  greenDiv.style.height = diameter;
  greenDiv.style.backgroundColor = "#00e054"; // Green
  greenDiv.style.borderRadius = "50%";
  greenDiv.style.display = "flex";
  greenDiv.style.alignItems = "center";
  greenDiv.style.justifyContent = "center";
  greenDiv.style.color = "white";
  greenDiv.style.fontSize = "24px";
  greenDiv.style.fontWeight = "bold";
  greenDiv.textContent = "✕";

  // Blue div (bottom)
  const blueDiv = document.createElement("div");
  blueDiv.style.width = diameter;
  blueDiv.style.height = diameter;
  blueDiv.style.backgroundColor = "#40bcf4"; // Blue
  blueDiv.style.borderRadius = "50%";

  iconContainer.appendChild(orangeDiv);
  iconContainer.appendChild(greenDiv);
  iconContainer.appendChild(blueDiv);

  // Title: "Oops! Something went wrong..."
  const title = document.createElement("h1");
  title.className = "title-1 prettify";
  title.textContent = "Oops! Something went wrong...";
  title.style.textAlign = "center";
  title.style.marginBottom = "16px";

  // Description text
  const descriptionDiv = document.createElement("div");
  descriptionDiv.className = "body-text -prose -hero clear js-collapsible-text";

  const descriptionText = document.createElement("p");
  descriptionText.textContent =
    "Could not find movie components. The page structure may have changed.";
  descriptionText.style.textAlign = "center";

  const contactText = document.createElement("p");
  contactText.style.textAlign = "center";
  contactText.style.fontSize = "14px";
  contactText.style.color = "#666";
  contactText.innerHTML = `Please try again later or contact the extension's owner:<br><a href="mailto:owenolipas@gmail.com" style="color: #4a9eff;">owenolipas@gmail.com</a>`;

  descriptionDiv.appendChild(descriptionText);
  descriptionDiv.appendChild(contactText);

  // Retry button
  const retryBtn = document.createElement("button");
  retryBtn.className = "button -action button-action";
  retryBtn.style.marginTop = "24px";
  retryBtn.style.display = "block";
  retryBtn.style.marginLeft = "auto";
  retryBtn.style.marginRight = "auto";
  retryBtn.innerHTML = `<span class="label">Retry</span>`;
  retryBtn.onclick = () => overlay.remove();

  box.append(iconContainer, title, descriptionDiv, retryBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  return overlay;
}

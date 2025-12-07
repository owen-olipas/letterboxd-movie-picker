// Test URLs and constants for Letterboxd Movie Picker tests

const TEST_BASE_URL = "https://letterboxd.com";

// Test account URLs (update these with your actual test account)
const TEST_USERNAME = "owennnnnnnnnnnn";

// Watchlist URLs
// const WATCHLIST_URLS = {
//   testUser: `${TEST_BASE_URL}/${TEST_USERNAME}/watchlist/`,
// };

// List URLs
const LIST_URLS = {
  testList: `${TEST_BASE_URL}/${TEST_USERNAME}/list/when-cgi-surgery-has-yet-to-be-invented/`,
};

// Film/Poster URLs
const FILM_URLS = {
  testMovie: `${TEST_BASE_URL}/film/one-hundred-and-one-dalmatians/`,
};

// Page URLs (for pagination testing)
const PAGE_URLS = {
  //   watchlistPage1: `${TEST_BASE_URL}/${TEST_USERNAME}/watchlist/`,
  //   watchlistPage2: `${TEST_BASE_URL}/${TEST_USERNAME}/watchlist/page/2/`,
  listPage1: `${LIST_URLS.testList}`,
  listPage2: `${LIST_URLS.testList}/page/2/`,
};

// Selectors
const SELECTORS = {
  actionsPanel: ".actions-panel ul",
  spinButton: 'button:has-text("🎲 Pick a Movie")',
  movieOverlay: ".movie-overlay",
  movieBox: ".movie-box",
  loadingText: "text=Loading...",
  errorTitle: "h1:has-text('Oops! Something went wrong...')",
  contactText: "text=Please try again later or contact the extension's owner",
  emailLink: 'a[href="mailto:owenolipas@gmail.com"]',
  closeButton: 'button:has-text("Close")',
  title1: ".title-1",
  movieOverlayTitle: ".movie-overlay .title-1",
  lazyPoster: '.react-component[data-component-class="LazyPoster"]',
};

// Test data
const TEST_DATA = {
  movieTitle: "One Hundred and One Dalmatians",
  movieLink: "/film/one-hundred-and-one-dalmatians/",
  email: "owenolipas@gmail.com",
  customErrorMessage:
    "Failed to load movies. Please check your connection and try again.",
  noMoviesMessage:
    "No movies found. Make sure you're on a list or watchlist page.",
};

// Timeouts (in milliseconds)
const TIMEOUTS = {
  short: 1000,
  medium: 3000,
  long: 5000,
  veryLong: 10000,
  pageLoad: 150000,
};

module.exports = {
  TEST_BASE_URL,
  TEST_USERNAME,
  LIST_URLS,
  FILM_URLS,
  PAGE_URLS,
  SELECTORS,
  TEST_DATA,
  TIMEOUTS,
};

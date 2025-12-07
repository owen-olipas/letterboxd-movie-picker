# End-to-End Testing Guide

This directory contains end-to-end tests for the Letterboxd Movie Picker Chrome extension using Playwright.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install chromium
```

## Running Tests

### Run all tests:

```bash
npm test
```

### Run tests in headed mode (see browser):

```bash
npm run test:headed
```

### Run tests in debug mode:

```bash
npm run test:debug
```

### Run tests with UI mode:

```bash
npm run test:ui
```

### Run specific tests 

```bash
npx playwright test extension.spec.js         # Run a single test file
npx playwright test error-overlay.spec.js     # Run another single test file
npx playwright test -g "error overlay"        # Run tests with names matching "error overlay"
```

You can also use test titles or partial strings with `-g` to select individual test cases.

For more options, see: https://playwright.dev/docs/cli




## Test Files

- `extension.spec.js` - Basic extension functionality tests
- `extension-with-chrome.spec.js` - Full Chrome extension tests with extension loaded
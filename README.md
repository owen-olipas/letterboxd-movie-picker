# Letterboxd Movie Picker

A lightweight Chrome extension that lets you pick a random movie from your Letterboxd list/s or watchlist.

**[Install from Chrome Web Store](https://chromewebstore.google.com/detail/blmhojgjpbplglhipfkdcdjpnbgmoajj?utm_source=item-share-cb)**

## Building the Extension

To create a zip file for Chrome Web Store upload, use one of these methods:

### Option 1: Using the Shell Script (macOS/Linux)

```bash
./build.sh
```

### Option 2: Using the Node.js Script (Cross-platform)

```bash
node build-extension.js
```

The build script will:

- Include only essential files (manifest.json, js/, styles.css, images/)
- Exclude development files (node_modules, tests, package.json, etc.)
- Create a zip file in the `dist/` directory

## Development

### Running Tests

```bash
cd letterboxd-movie-picker
npm install
npm test
```

### Project Structure

```
letterboxd-movie-picker/
├── manifest.json          # Extension manifest
├── js/                    # JavaScript files
│   ├── core/             # Core utilities and API
│   ├── ui/               # UI components and animation
│   └── main.js           # Entry point
├── styles.css            # Extension styles
└── images/               # Extension icons
```

## Installation

### Option 1: Install from Chrome Web Store (Recommended)

**[Install from Chrome Web Store](https://chromewebstore.google.com/detail/blmhojgjpbplglhipfkdcdjpnbgmoajj?utm_source=item-share-cb)**

### Option 2: Manual Installation (Development)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `letterboxd-movie-picker` directory

## Usage

1. Navigate to any Letterboxd watchlist or list page
2. Click the "🎲 Pick a Movie" button
3. Wait for the extension to load all movies
4. A random movie will be selected and displayed with its poster

## License

See LICENSE file for details.

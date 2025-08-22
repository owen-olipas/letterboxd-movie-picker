# 🎬 Random Movie Picker for Letterboxd

A lightweight **Chrome/Edge extension** that lets you pick a random movie from your Letterboxd list or watchlist, with a fun shuffle animation and poster preview.  

## Features

- Pick a random movie from any **list** or **watchlist** page on Letterboxd.  
- Buttons to **Close** or **Reroll** a new movie instantly.  
- Live feedback while fetching movies.  
- Styled to match Letterboxd’s clean aesthetic.  

## Installation

1. Clone or download this repository.  
2. Open Chrome/Edge and go to `chrome://extensions` or `edge://extensions`.  
3. Enable **Developer mode** (toggle at top-right).  
4. Click **Load unpacked** and select the folder containing this extension.  
5. Navigate to a Letterboxd list or watchlist page.  

## Usage

1. Open a list/watchlist on Letterboxd.  
2. Click the `"🎲 Pick a Movie"` button added to the page’s actions panel.  
3. Watch the title shuffle animation, then reveal the final movie with poster.  
4. Use **Close** to remove the overlay or **Reroll** to pick another random movie.  

## Notes

- Works on **Letterboxd watchlists** and **user-created lists** only.  
- Posters are fetched directly from each movie page using JSON-LD metadata.  
- Shuffle animation duration can be configured in `content.js`.  

## License

MIT License – free to use and modify.  
Copyright (c) 2025 KARL KENNETH OWEN D. OLIPAS
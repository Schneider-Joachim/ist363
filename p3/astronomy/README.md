# Astronomy Explorer

A React SPA for exploring NASA imagery and space knowledge. Built for IST 363 Project 3.

## APIs Used

- **NASA APOD** — `https://api.nasa.gov/planetary/apod`
- **NASA Image Library** — `https://images-api.nasa.gov/search`
- **Wikipedia REST API** — `https://en.wikipedia.org/api/rest_v1/page/summary/`

The app uses `DEMO_KEY` for NASA by default (rate-limited to 30 req/hour). For production, get a free key at https://api.nasa.gov and replace `DEMO_KEY` in `src/pages/Home.js` and `src/pages/Explorer.js`.

## Pages

| Page | Route (view state) | Layout |
|---|---|---|
| Home / APOD | `home` | Full-bleed editorial hero |
| Explorer | `explorer` | App layout with sticky search |
| My Collection | `collection` | App layout with grid |
| Space Facts | `facts` | App layout with sidebar + content |

## Features

- **4 pages**, 2 distinct layouts
- **localStorage persistence** — saved images survive page refresh
- **Conditional rendering** — active nav states, loading/error/empty states, expanded descriptions, note editing
- **Modular components** — Navbar, ImageCard, LoadingSpinner, useCollection hook
- **No global variables** — all state managed via props and custom hook
- **Responsive** — Tailwind CSS, works on mobile and desktop

## Setup

```bash
npm install
npm start
```

Runs at http://localhost:3000

## Deploy to Netlify

```bash
npm run build
# Drag the /build folder to netlify.com → "Deploy manually"
```

## Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/astronomy-explorer",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Then:
```bash
npm run deploy
```

## Project Structure

```
src/
  hooks/
    useCollection.js       # localStorage read/write/state
  components/
    Navbar.js              # Navigation with collection badge
    ImageCard.js           # Reusable image card with save/note
    LoadingSpinner.js      # Reusable loading indicator
  pages/
    Home.js                # APOD hero page (NASA API)
    Explorer.js            # Image search (NASA API)
    Collection.js          # Saved items (localStorage)
    SpaceFacts.js          # Topic articles (Wikipedia API)
  App.js                   # View router + state
  index.js                 # Entry point
  index.css                # Tailwind + global styles
```

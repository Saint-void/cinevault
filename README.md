# CineVault

CineVault is a movie discovery and watchlist project for WDD 330. Browse featured films, search and filter by genre, view movie details, and save favorites or watched titles. Collections are stored in your browser with `localStorage`.

## Run locally

From the project directory, start a static server:

```sh
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173) in your browser.

## Project status

Discover uses a curated CineVault collection and TMDB-hosted artwork. Search for two or more characters to load live series JSON from TVmaze. Opening a live result requests its full listing and a matching reference summary from Wikipedia. These endpoints require no API keys.

The app saves watchlists, favorites, watched titles, sort order, and selected genre in `localStorage`. Search, genre filters, sorting, movie details, collection actions, offline feedback, and cross-tab preference updates are interactive.

## APIs

- [TVmaze Search API](https://api.tvmaze.com/search/shows) returns searchable series records.
- [TVmaze Show API](https://api.tvmaze.com/shows) adds full metadata for a selected result.
- [Wikipedia Action API](https://en.wikipedia.org/w/api.php) finds a matching article; the [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) provides its summary.

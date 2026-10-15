import { movies, getMovie } from './movies.js';
import { fetchWikipediaSummary, lookupTvMazeShow, searchTvMazeShows } from './api.js';
import { loadState, saveState, STORAGE_KEY } from './storage.js';
import { filterMovies, sortMovies } from './search.js';
import { isInCollection, toggleCollection } from './watchlist.js';
import { renderMovieCards, renderMovieDetails, showToast } from './ui.js';

const state = loadState();
const elements = {
  grid: document.querySelector('#movie-grid'),
  search: document.querySelector('#movie-search'),
  sort: document.querySelector('#sort-select'),
  dialog: document.querySelector('#movie-dialog'),
  dialogContent: document.querySelector('#dialog-content'),
  empty: document.querySelector('#empty-state'),
  pageTitle: document.querySelector('#page-title'),
  kicker: document.querySelector('#collection-kicker'),
  collectionTitle: document.querySelector('#collection-title'),
  welcomeEyebrow: document.querySelector('#welcome-eyebrow'),
  apiStatus: document.querySelector('#api-status')
};

let activeView = 'discover';
let activeGenre = state.genre;
let activeMovieId = null;
let liveMovies = [];
let liveQuery = '';
let searchTimer;
let searchController;
let detailRequestId = 0;

const viewCopy = {
  discover: { title: 'Popular this week', kicker: 'CURATED FOR YOUR EVENING', welcome: 'YOUR NEXT GREAT WATCH STARTS HERE', heading: 'Find your next <span>favorite.</span>' },
  watchlist: { title: 'Your watchlist', kicker: 'SAVED FOR MOVIE NIGHT', welcome: 'YOUR PERSONAL MOVIE SHELF', heading: 'Keep the good ones <span>close.</span>' },
  favorites: { title: 'Your favorites', kicker: 'THE ONES THAT STAY WITH YOU', welcome: 'YOUR ALL-TIME SHORTLIST', heading: 'Films you <span>love.</span>' }
};

function getVisibleMovies() {
  const query = elements.search.value.trim();
  const savedMovies = activeView === 'discover'
    ? []
    : state[activeView].filter((movie) => typeof movie === 'object');
  let visible = [...movies, ...(activeView === 'discover' && query === liveQuery ? liveMovies : []), ...savedMovies];
  visible = [...new Map(visible.map((movie) => [movie.id, movie])).values()];
  if (activeView === 'watchlist') visible = visible.filter((movie) => isInCollection(state, 'watchlist', movie.id));
  if (activeView === 'favorites') visible = visible.filter((movie) => isInCollection(state, 'favorites', movie.id));
  return sortMovies(filterMovies(visible, { query: elements.search.value, genre: activeView === 'discover' ? activeGenre : 'all' }), elements.sort.value);
}

function findMovie(id) {
  const savedMovie = ['watchlist', 'favorites', 'watched']
    .flatMap((collection) => state[collection])
    .find((movie) => typeof movie === 'object' && movie.id === String(id));
  return liveMovies.find((movie) => movie.id === String(id)) || savedMovie || getMovie(id);
}

function render() {
  const copy = viewCopy[activeView];
  elements.pageTitle.innerHTML = copy.heading;
  elements.welcomeEyebrow.textContent = copy.welcome;
  elements.collectionTitle.textContent = copy.title;
  elements.kicker.textContent = copy.kicker;
  document.querySelector('.featured').hidden = activeView !== 'discover';
  document.querySelector('#genre-filters').hidden = activeView !== 'discover';
  document.querySelector('.sort-control').hidden = activeView !== 'discover';
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('is-active', link.dataset.view === activeView));
  const visibleMovies = getVisibleMovies();
  renderMovieCards(elements.grid, visibleMovies, state);
  elements.empty.hidden = visibleMovies.length > 0;
  elements.grid.hidden = visibleMovies.length === 0;
  document.querySelector('#watchlist-count').textContent = state.watchlist.length;
}

function openMovie(movie) {
  if (!movie) return;
  activeMovieId = movie.id;
  const requestId = ++detailRequestId;
  renderMovieDetails(elements.dialogContent, movie, state, { loading: movie.source === 'tvmaze' });
  elements.dialog.showModal();

  if (movie.source !== 'tvmaze') return;
  Promise.allSettled([lookupTvMazeShow(movie.id), fetchWikipediaSummary(movie.title)]).then((results) => {
    if (!elements.dialog.open || activeMovieId !== movie.id || requestId !== detailRequestId) return;
    const [appleResult, wikipediaResult] = results;
    const appleMovie = appleResult.status === 'fulfilled' ? appleResult.value : null;
    const wikipedia = wikipediaResult.status === 'fulfilled' ? wikipediaResult.value : null;
    if (appleMovie) Object.assign(movie, appleMovie);
    if (wikipedia?.extract) {
      movie.synopsis = wikipedia.extract;
      movie.wikipediaTitle = wikipedia.title;
    }
    renderMovieDetails(elements.dialogContent, movie, state, {
      wikipediaTitle: movie.wikipediaTitle,
      apiError: !appleMovie && !wikipedia
    });
  });
}

function updateCollection(button) {
  const collection = button.dataset.action;
  const stateCollection = collection === 'favorite' ? 'favorites' : collection;
  const movie = findMovie(button.dataset.movieId);
  if (!movie) return;
  const added = toggleCollection(state, stateCollection, movie);
  saveState(state);
  render();
  if (elements.dialog.open && activeMovieId === movie.id) renderMovieDetails(elements.dialogContent, movie, state);
  const collectionName = collection === 'watchlist' ? 'watchlist' : collection === 'favorite' ? 'favorites' : 'watched list';
  showToast(added ? `Added to ${collectionName}` : `Removed from ${collectionName}`);
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const viewButton = target?.closest('[data-view]');
  const actionButton = target?.closest('[data-action]');
  const openButton = target?.closest('[data-open-movie]');

  if (viewButton) {
    clearTimeout(searchTimer);
    activeView = viewButton.dataset.view;
    elements.search.value = '';
    liveMovies = [];
    liveQuery = '';
    elements.apiStatus.textContent = '';
    searchController?.abort();
    render();
  } else if (actionButton) {
    updateCollection(actionButton);
  } else if (openButton) {
    openMovie(findMovie(openButton.dataset.openMovie));
  } else if (target?.closest('[data-open-featured]')) {
    openMovie(getMovie('693134'));
  } else if (target?.closest('[data-close-dialog]')) {
    elements.dialog.close();
  }
});

document.querySelector('#genre-filters').addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest('[data-genre]') : null;
  if (!target) return;
  activeGenre = target.dataset.genre;
  state.genre = activeGenre;
  saveState(state);
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    const selected = chip === target;
    chip.classList.toggle('is-selected', selected);
    chip.setAttribute('aria-pressed', String(selected));
  });
  render();
});

elements.search.addEventListener('input', () => {
  const query = elements.search.value.trim();
  clearTimeout(searchTimer);
  if (query.length < 2) {
    searchController?.abort();
    liveMovies = [];
    liveQuery = '';
    elements.apiStatus.textContent = '';
    render();
    return;
  }

  render();
  elements.apiStatus.textContent = 'Searching the TVmaze series catalog...';
  searchTimer = setTimeout(async () => {
    searchController?.abort();
    searchController = new AbortController();
    const controller = searchController;
    try {
      const results = await searchTvMazeShows(query, { signal: controller.signal });
      if (controller.signal.aborted || query !== elements.search.value.trim()) return;
      liveMovies = results;
      liveQuery = query;
      elements.apiStatus.textContent = results.length
        ? `${results.length} live series results from TVmaze.`
        : 'No TVmaze matches. Local titles are still shown.';
    } catch (error) {
      if (error.name === 'AbortError') return;
      liveMovies = [];
      liveQuery = '';
      elements.apiStatus.textContent = 'Live series search is unavailable. Showing local titles.';
    }
    render();
  }, 350);
});
elements.sort.addEventListener('change', () => {
  state.sortBy = elements.sort.value;
  saveState(state);
  render();
});
elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});
elements.dialog.addEventListener('close', () => {
  activeMovieId = null;
  detailRequestId += 1;
});
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    elements.search.focus();
  }
});

window.addEventListener('online', () => showToast('Connection restored. Live movie search is available.'));
window.addEventListener('offline', () => showToast('You are offline. Your saved collections are still available.'));
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY) return;
  Object.assign(state, loadState());
  activeGenre = state.genre;
  elements.sort.value = state.sortBy;
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    const selected = chip.dataset.genre === activeGenre;
    chip.classList.toggle('is-selected', selected);
    chip.setAttribute('aria-pressed', String(selected));
  });
  render();
});

elements.sort.value = state.sortBy;
document.querySelectorAll('.filter-chip').forEach((chip) => {
  const selected = chip.dataset.genre === activeGenre;
  chip.classList.toggle('is-selected', selected);
  chip.setAttribute('aria-pressed', String(selected));
});
render();
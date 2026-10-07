import { movies, getMovie } from './movies.js';
import { loadState, saveState } from './storage.js';
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
  welcomeEyebrow: document.querySelector('#welcome-eyebrow')
};

let activeView = 'discover';
let activeGenre = 'all';
let activeMovieId = null;

const viewCopy = {
  discover: { title: 'Popular this week', kicker: 'CURATED FOR YOUR EVENING', welcome: 'YOUR NEXT GREAT WATCH STARTS HERE', heading: 'Find your next <span>favorite.</span>' },
  watchlist: { title: 'Your watchlist', kicker: 'SAVED FOR MOVIE NIGHT', welcome: 'YOUR PERSONAL MOVIE SHELF', heading: 'Keep the good ones <span>close.</span>' },
  favorites: { title: 'Your favorites', kicker: 'THE ONES THAT STAY WITH YOU', welcome: 'YOUR ALL-TIME SHORTLIST', heading: 'Films you <span>love.</span>' }
};

function getVisibleMovies() {
  let visible = movies;
  if (activeView === 'watchlist') visible = visible.filter((movie) => state.watchlist.includes(movie.id));
  if (activeView === 'favorites') visible = visible.filter((movie) => state.favorites.includes(movie.id));
  return sortMovies(filterMovies(visible, { query: elements.search.value, genre: activeView === 'discover' ? activeGenre : 'all' }), elements.sort.value);
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
  renderMovieDetails(elements.dialogContent, movie, state);
  elements.dialog.showModal();
}

function updateCollection(button) {
  const collection = button.dataset.action;
  const stateCollection = collection === 'favorite' ? 'favorites' : collection;
  const movie = getMovie(button.dataset.movieId);
  if (!movie) return;
  const added = toggleCollection(state, stateCollection, movie.id);
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
    activeView = viewButton.dataset.view;
    elements.search.value = '';
    activeGenre = 'all';
    document.querySelectorAll('.filter-chip').forEach((chip) => {
      const selected = chip.dataset.genre === 'all';
      chip.classList.toggle('is-selected', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });
    render();
  } else if (actionButton) {
    updateCollection(actionButton);
  } else if (openButton) {
    openMovie(getMovie(openButton.dataset.openMovie));
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
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    const selected = chip === target;
    chip.classList.toggle('is-selected', selected);
    chip.setAttribute('aria-pressed', String(selected));
  });
  render();
});

elements.search.addEventListener('input', render);
elements.sort.addEventListener('change', render);
elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    elements.search.focus();
  }
});

render();
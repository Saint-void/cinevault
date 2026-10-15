import { imageUrl } from './movies.js';
import { isInCollection } from './watchlist.js';

const icons = {
  watchlist: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
  favorite: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z"></path></svg>',
  watched: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>'
};

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function getImageUrl(movie, type) {
  const directUrl = type === 'poster' ? movie.posterUrl : movie.backdropUrl;
  const fallbackPath = type === 'poster' ? movie.poster : movie.backdrop;
  try {
    const image = new URL(directUrl || imageUrl(fallbackPath), window.location.href);
    return image.protocol === 'https:' ? image.href : imageUrl(fallbackPath);
  } catch {
    return imageUrl(fallbackPath);
  }
}

function formatRating(rating) {
  return Number.isFinite(rating) ? `★ ${rating.toFixed(1)}` : 'Not rated';
}

export function renderMovieCards(container, movies, state) {
  container.innerHTML = movies.map((movie, index) => `
    <article class="movie-card" style="animation-delay:${Math.min(index * 45, 225)}ms">
      <div class="poster-frame">
        <button class="poster-open" type="button" data-open-movie="${escapeHTML(movie.id)}" aria-label="View details for ${escapeHTML(movie.title)}">
          <img src="${escapeHTML(getImageUrl(movie, 'poster'))}" alt="${escapeHTML(movie.title)} movie poster" loading="lazy" />
        </button>
        <div class="poster-actions">
          <button class="icon-action ${isInCollection(state, 'watchlist', movie.id) ? 'is-saved' : ''}" type="button" data-action="watchlist" data-movie-id="${escapeHTML(movie.id)}" aria-label="${isInCollection(state, 'watchlist', movie.id) ? 'Remove from' : 'Add to'} watchlist" title="${isInCollection(state, 'watchlist', movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}">${icons.watchlist}</button>
          <button class="icon-action ${isInCollection(state, 'favorites', movie.id) ? 'is-saved' : ''}" type="button" data-action="favorite" data-movie-id="${escapeHTML(movie.id)}" aria-label="${isInCollection(state, 'favorites', movie.id) ? 'Remove from' : 'Add to'} favorites" title="${isInCollection(state, 'favorites', movie.id) ? 'Remove from favorites' : 'Add to favorites'}">${icons.favorite}</button>
        </div>
      </div>
      <div class="movie-info">
        <div class="movie-title-row"><h3 class="movie-title">${escapeHTML(movie.title)}</h3><span class="movie-rating">${escapeHTML(formatRating(movie.rating))}</span></div>
        <p class="movie-meta"><span>${escapeHTML(movie.year || 'Year unavailable')}</span><span>${escapeHTML(movie.genre)}</span></p>
      </div>
    </article>`).join('');
}

export function renderMovieDetails(container, movie, state, { loading = false, wikipediaTitle = '', apiError = false } = {}) {
  const inWatchlist = isInCollection(state, 'watchlist', movie.id);
  const isFavorite = isInCollection(state, 'favorites', movie.id);
  const isWatched = isInCollection(state, 'watched', movie.id);
  const apiNotice = loading
    ? 'Loading series details from TVmaze and a reference summary from Wikipedia...'
    : apiError
      ? 'Live details are unavailable. The TVmaze listing is shown.'
      : movie.source === 'tvmaze'
        ? `Series data from TVmaze${wikipediaTitle ? ` · Reference: ${escapeHTML(wikipediaTitle)} (Wikipedia)` : ''}.`
        : 'Details from the CineVault collection.';
  container.innerHTML = `
    <div class="dialog-hero">
      <img src="${escapeHTML(getImageUrl(movie, 'backdrop'))}" alt="" aria-hidden="true" />
      <h2 id="dialog-title">${escapeHTML(movie.title)}</h2>
    </div>
    <div class="dialog-body">
      <p class="dialog-meta"><span>${escapeHTML(movie.year || 'Year unavailable')}</span><span>·</span><span>${escapeHTML(movie.genre)}</span><span>·</span><span>${escapeHTML(movie.runtime)}</span><span>·</span><span class="movie-rating">${escapeHTML(formatRating(movie.rating))}</span></p>
      <p>${escapeHTML(movie.synopsis)}</p>
      ${movie.source === 'tvmaze' ? `<dl class="movie-facts"><div><dt>Network</dt><dd>${escapeHTML(movie.studio)}</dd></div><div><dt>Country</dt><dd>${escapeHTML(movie.country)}</dd></div><div><dt>Format</dt><dd>${escapeHTML(movie.format)}</dd></div><div><dt>Status</dt><dd>${escapeHTML(movie.status)}</dd></div><div><dt>Language</dt><dd>${escapeHTML(movie.language)}</dd></div></dl>` : ''}
      <p class="api-attribution" role="status" aria-live="polite">${apiNotice}</p>
      <div class="dialog-actions">
        <button class="button button-quiet ${inWatchlist ? 'is-selected' : ''}" type="button" data-action="watchlist" data-movie-id="${escapeHTML(movie.id)}">${icons.watchlist}<span>${inWatchlist ? 'In your watchlist' : 'Add to watchlist'}</span></button>
        <button class="button button-quiet ${isFavorite ? 'is-selected' : ''}" type="button" data-action="favorite" data-movie-id="${escapeHTML(movie.id)}">${icons.favorite}<span>${isFavorite ? 'Favorited' : 'Add to favorites'}</span></button>
        <button class="button button-quiet ${isWatched ? 'is-selected' : ''}" type="button" data-action="watched" data-movie-id="${escapeHTML(movie.id)}">${icons.watched}<span>${isWatched ? 'Watched' : 'Mark as watched'}</span></button>
      </div>
    </div>`;
}

export function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}
import { imageUrl } from './movies.js';

const icons = {
  watchlist: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
  favorite: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z"></path></svg>',
  watched: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>'
};

export function renderMovieCards(container, movies, state) {
  container.innerHTML = movies.map((movie, index) => `
    <article class="movie-card" style="animation-delay:${Math.min(index * 45, 225)}ms">
      <div class="poster-frame">
        <button class="poster-open" type="button" data-open-movie="${movie.id}" aria-label="View details for ${movie.title}">
          <img src="${imageUrl(movie.poster)}" alt="${movie.title} movie poster" loading="lazy" />
        </button>
        <div class="poster-actions">
          <button class="icon-action ${state.watchlist.includes(movie.id) ? 'is-saved' : ''}" type="button" data-action="watchlist" data-movie-id="${movie.id}" aria-label="${state.watchlist.includes(movie.id) ? 'Remove from' : 'Add to'} watchlist" title="${state.watchlist.includes(movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}">${icons.watchlist}</button>
          <button class="icon-action ${state.favorites.includes(movie.id) ? 'is-saved' : ''}" type="button" data-action="favorite" data-movie-id="${movie.id}" aria-label="${state.favorites.includes(movie.id) ? 'Remove from' : 'Add to'} favorites" title="${state.favorites.includes(movie.id) ? 'Remove from favorites' : 'Add to favorites'}">${icons.favorite}</button>
        </div>
      </div>
      <div class="movie-info">
        <div class="movie-title-row"><h3 class="movie-title">${movie.title}</h3><span class="movie-rating">★ ${movie.rating.toFixed(1)}</span></div>
        <p class="movie-meta"><span>${movie.year}</span><span>${movie.genre}</span></p>
      </div>
    </article>`).join('');
}

export function renderMovieDetails(container, movie, state) {
  const inWatchlist = state.watchlist.includes(movie.id);
  const isFavorite = state.favorites.includes(movie.id);
  const isWatched = state.watched.includes(movie.id);
  container.innerHTML = `
    <div class="dialog-hero" style="background-image:url('${imageUrl(movie.backdrop, 'w1280')}')">
      <h2 id="dialog-title">${movie.title}</h2>
    </div>
    <div class="dialog-body">
      <p class="dialog-meta"><span>${movie.year}</span><span>·</span><span>${movie.genre}</span><span>·</span><span>${movie.runtime}</span><span>·</span><span class="movie-rating">★ ${movie.rating.toFixed(1)}</span></p>
      <p>${movie.synopsis}</p>
      <div class="dialog-actions">
        <button class="button button-quiet ${inWatchlist ? 'is-selected' : ''}" type="button" data-action="watchlist" data-movie-id="${movie.id}">${icons.watchlist}<span>${inWatchlist ? 'In your watchlist' : 'Add to watchlist'}</span></button>
        <button class="button button-quiet ${isFavorite ? 'is-selected' : ''}" type="button" data-action="favorite" data-movie-id="${movie.id}">${icons.favorite}<span>${isFavorite ? 'Favorited' : 'Add to favorites'}</span></button>
        <button class="button button-quiet ${isWatched ? 'is-selected' : ''}" type="button" data-action="watched" data-movie-id="${movie.id}">${icons.watched}<span>${isWatched ? 'Watched' : 'Mark as watched'}</span></button>
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
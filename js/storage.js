export const STORAGE_KEY = 'cinevault-preferences-v1';

const emptyState = () => ({
  watchlist: [],
  favorites: [],
  watched: [],
  sortBy: 'popular',
  genre: 'all'
});

const validSorts = ['popular', 'rating', 'newest'];
const validGenres = ['all', 'Sci-Fi', 'Drama', 'Animation', 'Action', 'Romance', 'Thriller'];

function normalizeCollection(collection) {
  if (!Array.isArray(collection)) return [];
  return collection.map((item) => {
    if (item && typeof item === 'object' && item.id !== undefined) {
      return { ...item, id: String(item.id) };
    }
    return String(item);
  });
}

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return emptyState();
    return {
      watchlist: normalizeCollection(saved.watchlist),
      favorites: normalizeCollection(saved.favorites),
      watched: normalizeCollection(saved.watched),
      sortBy: validSorts.includes(saved.sortBy) ? saved.sortBy : 'popular',
      genre: validGenres.includes(saved.genre) ? saved.genre : 'all'
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return false;
  }
  return true;
}
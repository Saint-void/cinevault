const STORAGE_KEY = 'cinevault-preferences-v1';

const emptyState = () => ({ watchlist: [], favorites: [], watched: [] });

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return emptyState();
    return {
      watchlist: Array.isArray(saved.watchlist) ? saved.watchlist.map(String) : [],
      favorites: Array.isArray(saved.favorites) ? saved.favorites.map(String) : [],
      watched: Array.isArray(saved.watched) ? saved.watched.map(String) : []
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
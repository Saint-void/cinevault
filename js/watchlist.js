function getEntryId(entry) {
  return String(entry && typeof entry === 'object' ? entry.id : entry);
}

export function toggleCollection(state, collection, movie) {
  const movieId = getEntryId(movie);
  const current = state[collection];
  if (!Array.isArray(current)) return false;
  const exists = current.some((item) => getEntryId(item) === movieId);
  const entry = movie && typeof movie === 'object' ? { ...movie, id: movieId } : movieId;
  state[collection] = exists
    ? current.filter((item) => getEntryId(item) !== movieId)
    : [...current, entry];
  return !exists;
}

export function isInCollection(state, collection, id) {
  return state[collection]?.some((entry) => getEntryId(entry) === String(id)) ?? false;
}
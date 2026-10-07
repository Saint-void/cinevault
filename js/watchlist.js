export function toggleCollection(state, collection, id) {
  const movieId = String(id);
  const current = state[collection];
  if (!Array.isArray(current)) return false;
  const exists = current.includes(movieId);
  state[collection] = exists ? current.filter((item) => item !== movieId) : [...current, movieId];
  return !exists;
}

export function isInCollection(state, collection, id) {
  return state[collection]?.includes(String(id)) ?? false;
}
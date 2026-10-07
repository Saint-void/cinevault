export function filterMovies(movies, { query = '', genre = 'all' } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return movies.filter((movie) => {
    const matchesQuery = !normalizedQuery || `${movie.title} ${movie.year} ${movie.genre}`.toLocaleLowerCase().includes(normalizedQuery);
    const matchesGenre = genre === 'all' || movie.genre === genre;
    return matchesQuery && matchesGenre;
  });
}

export function sortMovies(movies, sortBy = 'popular') {
  const sorters = {
    popular: (first, second) => second.popularity - first.popularity,
    rating: (first, second) => second.rating - first.rating,
    newest: (first, second) => second.year - first.year
  };
  return [...movies].sort(sorters[sortBy] || sorters.popular);
}
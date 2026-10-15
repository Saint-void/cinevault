const TVMAZE_API = 'https://api.tvmaze.com';
const WIKIPEDIA_API = 'https://en.wikipedia.org';

function stripMarkup(markup = '') {
  return new DOMParser().parseFromString(markup, 'text/html').body.textContent?.trim() ?? '';
}

function normalizeShow(show, searchScore = 0) {
  const channel = show.network ?? show.webChannel;
  const releaseDate = show.premiered ?? '';
  const genres = Array.isArray(show.genres) ? show.genres : [];
  const posterUrl = show.image?.original ?? show.image?.medium ?? '';

  return {
    id: String(show.id),
    title: show.name ?? 'Untitled series',
    year: releaseDate ? new Date(releaseDate).getFullYear() : 0,
    genre: genres[0] ?? 'Series',
    genres,
    rating: Number.isFinite(show.rating?.average) ? show.rating.average : null,
    runtime: show.averageRuntime || show.runtime ? `${show.averageRuntime || show.runtime} min` : 'Varies by episode',
    popularity: searchScore || show.weight || 0,
    poster: '',
    backdrop: '',
    posterUrl,
    backdropUrl: posterUrl,
    synopsis: stripMarkup(show.summary) || 'No description is available yet.',
    releaseDate,
    studio: channel?.name ?? 'Not listed',
    country: channel?.country?.name ?? 'Not listed',
    format: show.type ?? 'Series',
    language: show.language ?? 'Not listed',
    status: show.status ?? 'Unknown',
    schedule: Array.isArray(show.schedule?.days) ? show.schedule.days.join(', ') : 'Not listed',
    officialSite: show.officialSite ?? '',
    tvmazeUrl: show.url ?? '',
    imdbId: show.externals?.imdb ?? '',
    source: 'tvmaze'
  };
}

async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

export async function searchTvMazeShows(query, { signal } = {}) {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`${TVMAZE_API}/search/shows?${params}`, { signal });
  if (!response.ok) throw new Error(`Movie search failed (${response.status})`);
  const data = await response.json();
  return (Array.isArray(data) ? data : [])
    .filter((result) => result.show?.id && result.show?.name)
    .map((result) => normalizeShow(result.show, result.score))
    .filter((movie) => movie.posterUrl);
}

export async function lookupTvMazeShow(id) {
  const show = await readJson(`${TVMAZE_API}/shows/${encodeURIComponent(id)}?embed=cast`);
  return show?.id ? normalizeShow(show) : null;
}

export async function fetchWikipediaSummary(title) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: `${title} film`,
    format: 'json',
    origin: '*'
  });
  const search = await readJson(`${WIKIPEDIA_API}/w/api.php?${params}`);
  const pageTitle = search.query?.search?.[0]?.title;
  if (!pageTitle) return null;

  const summary = await readJson(`${WIKIPEDIA_API}/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`);
  return summary.extract ? { title: pageTitle, extract: summary.extract } : null;
}
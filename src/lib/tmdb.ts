const API_KEY = "0771dff053c430ce7b915a696b1ef9ac";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export const img = (path: string | null, size: string = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";

export const backdrop = (path: string | null) => img(path, "original");

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime?: number;
  genres: { id: number; name: string }[];
  tagline?: string;
  status: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
}

export interface Credits {
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
}

interface ListResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
}

export const getTrending = (type: "movie" | "tv" | "all" = "all") =>
  tmdbFetch<ListResponse<Movie>>(`/trending/${type}/week`);

export const getPopular = (type: "movie" | "tv") =>
  tmdbFetch<ListResponse<Movie>>(`/${type}/popular`);

export const getTopRated = (type: "movie" | "tv") =>
  tmdbFetch<ListResponse<Movie>>(`/${type}/top_rated`);

export const getMovieDetail = (id: number) =>
  tmdbFetch<MovieDetail>(`/movie/${id}`);

export const getTvDetail = (id: number) =>
  tmdbFetch<MovieDetail>(`/tv/${id}`);

export const getTvSeasonEpisodes = (tvId: number, season: number) =>
  tmdbFetch<{ episodes: Episode[] }>(`/tv/${tvId}/season/${season}`);

export const getCredits = (type: "movie" | "tv", id: number) =>
  tmdbFetch<Credits>(`/${type}/${id}/credits`);

export const searchMulti = (query: string) =>
  tmdbFetch<ListResponse<Movie>>("/search/multi", { query });

export const getRecommendations = (type: "movie" | "tv", id: number) =>
  tmdbFetch<ListResponse<Movie>>(`/${type}/${id}/recommendations`);

// Anime: discover TV with animation genre (16) and JP origin
export const getAnime = () =>
  tmdbFetch<ListResponse<Movie>>("/discover/tv", {
    with_genres: "16",
    with_original_language: "ja",
    sort_by: "popularity.desc",
  });

// VidLink embed URLs
export const getMoviePlayerUrl = (tmdbId: number) =>
  `https://vidlink.pro/movie/${tmdbId}`;

export const getTvPlayerUrl = (tmdbId: number, season: number, episode: number) =>
  `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;

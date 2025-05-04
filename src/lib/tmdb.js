const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: {
    small: `${IMAGE_BASE_URL}/w185`,
    medium: `${IMAGE_BASE_URL}/w342`,
    large: `${IMAGE_BASE_URL}/w500`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  backdrop: {
    small: `${IMAGE_BASE_URL}/w300`,
    medium: `${IMAGE_BASE_URL}/w780`,
    large: `${IMAGE_BASE_URL}/w1280`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  profile: {
    small: `${IMAGE_BASE_URL}/w45`,
    medium: `${IMAGE_BASE_URL}/w185`,
    large: `${IMAGE_BASE_URL}/h632`,
    original: `${IMAGE_BASE_URL}/original`,
  },
};

async function fetchFromTMDB(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`TMDB API error: ${errorData.status_message || response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
}

export async function getTrendingMovies(timeWindow = 'week', page = 1) {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`, { page });
}

export async function getPopularMovies(page = 1) {
  return fetchFromTMDB('/movie/popular', { 
    page,
    include_adult: false,
    region: 'US'
  });
}

export async function getMovieDetails(movieId) {
  return fetchFromTMDB(`/movie/${movieId}`);
}

export async function searchMovies(query, page = 1) {
  return fetchFromTMDB('/search/movie', { query, page });
}


export async function searchMulti(query, page = 1) {
  return fetchFromTMDB('/search/multi', { query, page });
}


export async function getMoviesByGenre(genreId, page = 1) {
  return fetchFromTMDB('/discover/movie', { 
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc'
  });
}


export async function getGenres() {
  return fetchFromTMDB('/genre/movie/list');
}

export async function getPersonDetails(personId) {
  return fetchFromTMDB(`/person/${personId}`);
}

export async function getPersonMovieCredits(personId) {
  return fetchFromTMDB(`/person/${personId}/movie_credits`);
}

export function formatMovieData(movie) {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path 
      ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
      : '/images/placeholder.jpg',
    backdropPath: movie.backdrop_path
      ? `${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
      : null,
    overview: movie.overview,
    releaseDate: movie.release_date,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : '',
    rating: movie.vote_average,
    genres: movie.genres || [],
    runtime: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '',
    voteCount: movie.vote_count,
    originalLanguage: movie.original_language,
  };
}
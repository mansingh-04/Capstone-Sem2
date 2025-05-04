"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getPopularMovies, formatMovieData, getMovieDetails, getPersonMovieCredits, getGenres } from "../lib/tmdb"

export const dynamic = 'force-dynamic';

export default function Home() {
  const [movies, setMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [genreMap, setGenreMap] = useState({})

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await getGenres();
        const map = {};
        data.genres.forEach(g => { map[g.id] = g.name });
        setGenreMap(map);
      } catch (e) { console.error("Error fetching genres", e); }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const moviesData = await getPopularMovies(currentPage)
        let shuffledMovies = [...moviesData.results].sort(() => Math.random() - 0.5)
        shuffledMovies = shuffledMovies.sort((a, b) => {
          if (b.vote_average !== a.vote_average) {
            return b.vote_average - a.vote_average
          }
          return new Date(b.release_date) - new Date(a.release_date)
        })
        const formattedMovies = shuffledMovies.map(movie => {
          let genres = [];
          if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
            genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).map(name => ({ name }));
          } else if (movie.genres && Array.isArray(movie.genres) && movie.genres[0]?.name) {
            genres = movie.genres;
          }
          return { ...formatMovieData(movie), genres };
        });
        setMovies(formattedMovies)
        setTotalPages(Math.min(moviesData.total_pages, 500))
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message)
        setMovies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentPage, genreMap])

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const openModal = async (movie) => {
    try {
      const details = await getMovieDetails(movie.id);
      const credits = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
        .then(res => res.json());
      const actors = credits.cast ? credits.cast.slice(0, 5) : [];
      setSelectedMovie({ ...movie, actors, genres: details.genres || [] });
    } catch (e) {
      setSelectedMovie({ ...movie, actors: [], genres: [] });
    }
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMovie(null)
  }

  return (
    <div>
      <section className="hero-section" style={{ backgroundImage: "url(/images/cinema-background.jpg)" }}>
        <div className="container hero-content">
          <h1 className="hero-title">Your Ultimate Movie Experience Hub</h1>
          <p className="hero-subtitle">Discover, search, and test your movie knowledge all in one place</p>
          <div className="hero-ctas">
            <Link href="/recommendations" className="btn btn-primary">
              Get Recommendations
            </Link>
            <Link href="/search" className="btn btn-secondary">
              Search Movies
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Movie Recommendations</h2>
          </div>

          {error ? (
            <div className="error-message">
              <p>Error loading movies: {error}</p>
              <p>Please try again later or check your API configuration.</p>
            </div>
          ) : isLoading ? (
            <div className="loading-spinner">Loading movies...</div>
          ) : (
            <>
              <div className="movie-grid">
                {movies.map(movie => (
                  <div key={movie.id} className="card">
                    <div className="relative aspect-[2/3] w-full">
                      <Image 
                        src={movie.posterPath || "/placeholder.svg"} 
                        alt={movie.title} 
                        fill 
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 250px"
                        style={{ objectFit: "cover" }} 
                      />
                      <div className="movie-rating">{movie.rating.toFixed(1)}</div>
                    </div>
                    <div className="p-4 search-result-content">
                      <h3>{movie.title}</h3>
                      <p>
                        {movie.year}
                        {movie.genres && movie.genres.length > 0
                          ? ` • ${movie.genres.map(g => g.name).join(', ')}`
                          : ' • N/A'}
                        {movie.originalLanguage ? ` • ${movie.originalLanguage.toUpperCase()}` : ''}
                      </p>
                      <div className="details-btn-container">
                        <button 
                          className="text-sm btn btn-primary py-1 px-3"
                          onClick={() => openModal(movie)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {showModal && selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-header">
              <h2>{selectedMovie.title}</h2>
              <span className="movie-rating">{selectedMovie.rating.toFixed(1)}</span>
            </div>
            <div className="modal-body">
              <Image
                src={selectedMovie.posterPath || "/placeholder.svg"}
                alt={selectedMovie.title}
                width={200}
                height={300}
                style={{ borderRadius: '0.5rem', marginBottom: '1rem' }}
              />
              <p><strong>Year:</strong> {selectedMovie.year}</p>
              <p><strong>Genres:</strong> {selectedMovie.genres.map(g => g.name).join(', ')}</p>
              <p><strong>Actors:</strong> {selectedMovie.actors ? selectedMovie.actors.map(a => a.name).join(', ') : '—'}</p>
              <p style={{ marginTop: '1rem' }}>{selectedMovie.overview}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
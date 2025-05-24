// app/recommendations/page.js
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getGenres, getMoviesByGenre, formatMovieData, getMovieDetails } from "../../lib/tmdb"

export default function Recommendations() {
  const [genres, setGenres] = useState([])
  const [movies, setMovies] = useState([])
  const [activeGenre, setActiveGenre] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [genreMap, setGenreMap] = useState({})

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await getGenres()
        const map = {}
        data.genres.forEach(g => { map[g.id] = g.name })
        setGenreMap(map)
        setGenres(data.genres)
        if (data.genres.length > 0 && !activeGenre) {
          setActiveGenre(data.genres[0].id)
        }
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }
    fetchGenres()
  }, [])

  useEffect(() => {
    async function fetchMovies() {
      if (!activeGenre) return
      setLoading(true)
      try {
        const data = await getMoviesByGenre(activeGenre)
        let sortedMovies = [...data.results].sort((a, b) => {
          if (b.vote_average !== a.vote_average) {
            return b.vote_average - a.vote_average
          }
          return new Date(b.release_date) - new Date(a.release_date)
        })
        const formattedMovies = sortedMovies.map(movie => {
          let genres = []
          if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
            genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).map(name => ({ name }))
          } else if (movie.genres && Array.isArray(movie.genres) && movie.genres[0]?.name) {
            genres = movie.genres
          }
          return { ...formatMovieData(movie), genres }
        })
        setMovies(formattedMovies)
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [activeGenre, genreMap])

  const openModal = async (movie) => {
    try {
      const details = await getMovieDetails(movie.id)
      const credits = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
        .then(res => res.json())
      const actors = credits.cast ? credits.cast.slice(0, 5) : []
      setSelectedMovie({ ...movie, actors, genres: details.genres || [] })
    } catch (e) {
      setSelectedMovie({ ...movie, actors: [], genres: [] })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMovie(null)
  }

  return (
    <div className="container">
      <h1 className="section-title">Movie Recommendations</h1>
      <div className="genre-tags">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-tag${activeGenre === genre.id ? " active" : ""}`}
            onClick={() => setActiveGenre(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="loading-message">
          <p>Loading movies...</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="card">
              <div className="relative aspect-[2/3] w-full">
                <Image 
                  src={movie.posterPath || "/placeholder.svg"} 
                  alt={movie.title} 
                  fill 
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 250px"
                  style={{ objectFit: "cover" }} 
                />
                <div className="movie-rating">
                  {movie.rating.toFixed(1)}
                </div>
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
      )}
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
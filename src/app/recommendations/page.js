// app/recommendations/page.js
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getGenres, getMoviesByGenre, formatMovieData, getMovieDetails } from "../../lib/tmdb"
import { addToWishlist, removeFromWishlist, getWishlist } from '../../lib/userData';
import { auth } from '../../lib/firebase';

export default function Recommendations() {
  const [genres, setGenres] = useState([])
  const [movies, setMovies] = useState([])
  const [activeGenre, setActiveGenre] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [genreMap, setGenreMap] = useState({})
  const [wishlist, setWishlist] = useState([]);

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

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getWishlist(user.uid).then(setWishlist);
    }
  }, []);

  const isInWishlist = (movieId) => wishlist.some((m) => m.id === movieId);

  const handleToggleWishlist = async (movie) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in to manage your wishlist.');
      return;
    }
    if (isInWishlist(movie.id)) {
      await removeFromWishlist(user.uid, movie.id);
    } else {
      await addToWishlist(user.uid, movie);
    }
    const updated = await getWishlist(user.uid);
    setWishlist(updated);
  };

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

  const handleAddToWishlist = (movie) => {
    const user = auth.currentUser;
    if (user) {
      addToWishlist(user.uid, movie);
    } else {
      alert('Please sign in to add to your wishlist.');
    }
  };

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
            <div key={movie.id} className="card movie-card-hover-group">
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
                <span
                  className={`wishlist-heart ${isInWishlist(movie.id) ? 'wishlist-heart-active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleToggleWishlist(movie); }}
                  title={isInWishlist(movie.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  {isInWishlist(movie.id) ? (
                    <svg width="24" height="24" fill="#e11d48" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  ) : (
                    <svg width="24" height="24" fill="none" stroke="#e11d48" strokeWidth="2" viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 7.24 5.6 9.28c-1.5 2.04-0.44 5.12 3.4 8.36l2.1 1.92 2.1-1.92c3.84-3.24 4.9-6.32 3.4-8.36-1.5-2.04-4.54-2.68-6.39-0.64z"/></svg>
                  )}
                </span>
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
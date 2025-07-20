// app/search/page.js
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { searchMulti, IMAGE_SIZES, getGenres, getMovieDetails } from "../../lib/tmdb"
import { addToWishlist, removeFromWishlist, getWishlist } from '../../lib/userData';
import { auth } from '../../lib/firebase';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchFilter, setSearchFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [genreMap, setGenreMap] = useState({})
  const debounceTimeout = useRef(null)
  const [wishlist, setWishlist] = useState([]);

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
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setIsLoading(true)
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      handleSearch()
    }, 400)
  }, [searchQuery, searchFilter])

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

  async function getTVDetails(tvId) {
    const details = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`).then(res => res.json());
    return details;
  }
  async function getTVCredits(tvId) {
    const credits = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`).then(res => res.json());
    return credits;
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return
    setIsLoading(true)
    try {
      const data = await searchMulti(searchQuery);
      const formattedResults = data.results.map(item => {
        if (item.media_type === 'movie') {
          let genres = [];
          if (item.genre_ids && Array.isArray(item.genre_ids)) {
            genres = item.genre_ids.map(id => genreMap[id]).filter(Boolean);
          }
          return {
            id: item.id,
            title: item.title,
            year: item.release_date ? new Date(item.release_date).getFullYear() : '',
            genres,
            runtime: '',
            rating: item.vote_average,
            overview: item.overview,
            posterPath: item.poster_path 
              ? `${IMAGE_SIZES.poster.medium}${item.poster_path}`
              : '/images/placeholder.jpg',
            type: 'movie',
            voteCount: item.vote_count,
            originalLanguage: item.original_language,
          }
        } else if (item.media_type === 'tv') {
          let genres = [];
          if (item.genre_ids && Array.isArray(item.genre_ids)) {
            genres = item.genre_ids.map(id => genreMap[id]).filter(Boolean);
          }
          return {
            id: item.id,
            title: item.name,
            year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : '',
            genres,
            overview: item.overview,
            posterPath: item.poster_path 
              ? `${IMAGE_SIZES.poster.medium}${item.poster_path}`
              : '/images/placeholder.jpg',
            type: 'tv',
            originalLanguage: item.original_language,
          }
        } else if (item.media_type === 'person') {
          return {
            id: item.id,
            title: item.name,
            image: item.profile_path 
              ? `${IMAGE_SIZES.profile.medium}${item.profile_path}`
              : '/images/placeholder.jpg',
            type: 'person',
            knownFor: item.known_for_department || 'Actor/Actress',
          }
        } else {
          return {
            id: item.id,
            title: item.name || item.title,
            image: item.poster_path 
              ? `${IMAGE_SIZES.poster.medium}${item.poster_path}`
              : '/images/placeholder.jpg',
            type: item.media_type,
          }
        }
      });
      const filtered = searchFilter === "all" 
        ? formattedResults 
        : formattedResults.filter((item) => {
            if (searchFilter === "movie") return item.type === "movie";
            if (searchFilter === "person") return item.type === "person";
            if (searchFilter === "tv") return item.type === "tv";
            return true;
          });
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const openModal = async (item) => {
    if (item.type === 'tv') {
      try {
        const details = await getTVDetails(item.id);
        const credits = await getTVCredits(item.id);
        const actors = credits.cast ? credits.cast.slice(0, 5) : [];
        const genres = details.genres ? details.genres.map(g => g.name) : [];
        setSelectedMovie({
          ...item,
          title: details.name || item.title,
          year: details.first_air_date ? new Date(details.first_air_date).getFullYear() : '',
          genres,
          originalLanguage: details.original_language,
          overview: details.overview,
          actors,
        });
      } catch (e) {
        setSelectedMovie({ ...item, actors: [], genres: [] });
      }
      setShowModal(true);
      return;
    }

    try {
      const details = await getMovieDetails(item.id);
      const credits = await fetch(`https://api.themoviedb.org/3/movie/${item.id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
        .then(res => res.json());
      const actors = credits.cast ? credits.cast.slice(0, 5) : [];
      setSelectedMovie({ ...item, actors, genres: details.genres ? details.genres.map(g => g.name) : [] });
    } catch (e) {
      setSelectedMovie({ ...item, actors: [], genres: [] });
    }
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMovie(null)
  }

  return (
    <div className="search-page">
      <h1 className="search-page-title">Search Movies</h1>
      
      <div className="search-box-container">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search movies, actors, or directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
          
          <div className="search-filters">
            <button 
              type="button" 
              className={`filter-button ${searchFilter === "all" ? "active" : ""}`} 
              onClick={() => setSearchFilter("all")}
            >
              All
            </button>
            <button 
              type="button" 
              className={`filter-button ${searchFilter === "movie" ? "active" : ""}`} 
              onClick={() => setSearchFilter("movie")}
            >
              Movies
            </button>
            <button 
              type="button" 
              className={`filter-button ${searchFilter === "tv" ? "active" : ""}`} 
              onClick={() => setSearchFilter("tv")}
            >
              TV Shows
            </button>
            <button 
              type="button" 
              className={`filter-button ${searchFilter === "person" ? "active" : ""}`} 
              onClick={() => setSearchFilter("person")}
            >
              People
            </button>
          </div>
        </form>
      </div>

      {searchResults.length > 0 ? (
        <div>
          <h2 className="search-results-title">Search Results</h2>
          <div className="search-results-grid">
            {searchResults.map((item) => (
              (item.type === 'movie' || item.type === 'tv') ? (
                <div key={item.id} className="search-result-card movie-card-hover-group">
                  <div className="relative">
                    <Image 
                      src={item.posterPath || "/placeholder.svg"} 
                      alt={item.title} 
                      fill 
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 250px" 
                      style={{ objectFit: "cover" }} 
                    />
                    <span
                      className={`wishlist-heart ${isInWishlist(item.id) ? 'wishlist-heart-active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleToggleWishlist(item); }}
                      title={isInWishlist(item.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      {isInWishlist(item.id) ? (
                        <svg width="24" height="24" fill="#e11d48" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      ) : (
                        <svg width="24" height="24" fill="none" stroke="#e11d48" strokeWidth="2" viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 7.24 5.6 9.28c-1.5 2.04-0.44 5.12 3.4 8.36l2.1 1.92 2.1-1.92c3.84-3.24 4.9-6.32 3.4-8.36-1.5-2.04-4.54-2.68-6.39-0.64z"/></svg>
                      )}
                    </span>
                  </div>
                  <div className="search-result-content">
                    <h3>{item.title}</h3>
                    <p>
                      {item.year}
                      {item.genres && item.genres.length > 0
                        ? ` • ${typeof item.genres[0] === 'object' ? item.genres.map(g => g.name).join(', ') : item.genres.join(', ')}`
                        : ' • N/A'}
                      {item.originalLanguage ? ` • ${item.originalLanguage.toUpperCase()}` : ''}
                    </p>
                    <div className="details-btn-container">
                      <button 
                        className="btn btn-primary"
                        onClick={() => openModal(item)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={item.id} className="search-result-card">
                  <div className="relative">
                    <Image 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.title} 
                      fill 
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 250px" 
                      style={{ objectFit: "cover" }} 
                    />
                  </div>
                  <div className="search-result-content">
                    <h3>{item.title}</h3>
                    <p>{item.type === "person" ? "Person" : item.type}<br />{item.knownFor && `Known for: ${item.knownFor}`}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      ) : searchQuery && !isLoading ? (
        <div className="search-message">
          <p>No results found for "{searchQuery}"</p>
          <p>Try different keywords or filters</p>
        </div>
      ) : null}

      {!searchQuery && (
        <div className="popular-searches">
          <h3 className="popular-searches-title">Popular Searches</h3>
          <div className="popular-tags">
            <button className="popular-tag" onClick={() => setSearchQuery("Marvel")}>Marvel</button>
            <button className="popular-tag" onClick={() => setSearchQuery("Christopher Nolan")}>Christopher Nolan</button>
            <button className="popular-tag" onClick={() => setSearchQuery("Tom Hanks")}>Tom Hanks</button>
            <button className="popular-tag" onClick={() => setSearchQuery("Star Wars")}>Star Wars</button>
          </div>
        </div>
      )}

      {showModal && selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-header">
              <h2>{selectedMovie.title}</h2>
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
              {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                <p><strong>Genres:</strong> {typeof selectedMovie.genres[0] === 'object' ? selectedMovie.genres.map(g => g.name).join(', ') : selectedMovie.genres.join(', ')}</p>
              )}
              <p><strong>Actors:</strong> {selectedMovie.actors ? selectedMovie.actors.map(a => a.name).join(', ') : '—'}</p>
              <p style={{ marginTop: '1rem' }}>{selectedMovie.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
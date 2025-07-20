"use client";
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../lib/userData";
import { auth } from "../../lib/firebase";
import Image from "next/image";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getWishlist(user.uid).then((data) => {
        setWishlist(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleRemove = async (movieId) => {
    const user = auth.currentUser;
    if (user) {
      await removeFromWishlist(user.uid, movieId);
      setWishlist((prev) => prev.filter((m) => m.id !== movieId));
    }
  };

  if (loading) return <div className="container"><p>Loading wishlist...</p></div>;
  if (!wishlist || wishlist.length === 0) return <div className="container"><h2>Your Wishlist</h2><p>No movies in your wishlist yet.</p></div>;

  return (
    <div className="container">
      <h2 className="section-title">Your Wishlist</h2>
      <div className="movie-grid">
        {wishlist.map((movie) => (
          <div key={movie.id} className="card">
            <div className="relative aspect-[2/3] w-full">
              <Image 
                src={movie.posterPath || "/placeholder.svg"} 
                alt={movie.title} 
                fill 
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 250px"
                style={{ objectFit: "cover" }} 
              />
            </div>
            <div className="p-4 search-result-content">
              <h3>{movie.title}</h3>
              <p>{movie.year}</p>
              <button className="btn btn-secondary mt-2" onClick={() => handleRemove(movie.id)}>
                Remove from Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
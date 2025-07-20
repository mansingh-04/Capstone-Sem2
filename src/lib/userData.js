import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Add a movie to the user's wishlist (minimal info for uniqueness)
export async function addToWishlist(userId, movie) {
  const userRef = doc(db, "users", userId);
  const minimalMovie = {
    id: movie.id,
    title: movie.title,
    posterPath: movie.posterPath,
    year: movie.year,
  };
  // Only create the doc if it doesn't exist
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, { wishlist: [] }, { merge: true });
  }
  await updateDoc(userRef, { wishlist: arrayUnion(minimalMovie) });
  console.log('[addToWishlist] Added:', minimalMovie, 'User:', userId);
}

// Remove a movie from the user's wishlist
export async function removeFromWishlist(userId, movieId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const wishlist = userSnap.data().wishlist || [];
    const updatedWishlist = wishlist.filter((m) => m.id !== movieId);
    await updateDoc(userRef, { wishlist: updatedWishlist });
    console.log('[removeFromWishlist] Removed movieId:', movieId, 'User:', userId, 'Updated:', updatedWishlist);
  }
}

// Get the user's wishlist
export async function getWishlist(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const wishlist = userSnap.exists() ? userSnap.data().wishlist || [] : [];
  console.log('[getWishlist] Wishlist for user', userId, ':', wishlist);
  return wishlist;
} 
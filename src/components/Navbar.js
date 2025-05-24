"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link href="/">
            <span className="navbar-logo">MovieVerse</span>
          </Link>
        </div>
        <div className="navbar-links">
          <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
          <Link href="/recommendations" className={pathname.startsWith("/recommendations") ? "active" : ""}>Recommendations</Link>
          <Link href="/search" className={pathname.startsWith("/search") ? "active" : ""}>Search</Link>
          <Link href="/trivia" className={pathname.startsWith("/trivia") ? "active" : ""}>Trivia</Link>
        </div>
        <div className="navbar-actions">
          <ThemeToggle />
          <Link href="/login" className="btn btn-secondary">Sign In</Link>
          <Link href="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
        <button className="navbar-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="navbar-mobile">
          <div className="navbar-mobile-links">
            <Link href="/" className={pathname === "/" ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/recommendations" className={pathname.startsWith("/recommendations") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Recommendations</Link>
            <Link href="/search" className={pathname.startsWith("/search") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Search</Link>
            <Link href="/trivia" className={pathname.startsWith("/trivia") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Trivia</Link>
            <div className="navbar-mobile-actions">
              <ThemeToggle />
              <Link href="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/signup" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // Set theme from localStorage or system preference on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      document.body.setAttribute("data-theme", stored);
    } else {
      // Default to light theme if no stored preference
      setTheme("light");
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, []);

  // Update theme and localStorage when changed
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      className="ml-4 p-2 rounded-full border-2 border-red-500 bg-white"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        // Sun icon
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-400 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      ) : (
        // Moon icon
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-all" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}


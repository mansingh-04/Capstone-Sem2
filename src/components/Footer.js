import Link from "next/link"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-brand">
            <Link href="/">
              <span className="footer-logo">MovieVerse</span>
            </Link>
            <p className="footer-desc">Your ultimate destination for movie recommendations and knowledge.</p>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Features</h3>
            <ul>
              <li><Link href="/recommendations">Recommendations</Link></li>
              <li><Link href="/search">Movie Search</Link></li>
              <li><Link href="/trivia">Movie Trivia</Link></li>
              <li><Link href="/watch-list">Watch List</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} Crafted with code, coffee, and curiosity.</p>
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/manpreet-singh-9bb415318/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
            </a>
            <a href="https://portfolio-msst9876tr-gmailcoms-projects.vercel.app/" aria-label="Portfolio" target="_blank" rel="noopener noreferrer">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.371 0 0 5.371 0 12c0 6.629 5.371 12 12 12s12-5.371 12-12c0-6.629-5.371-12-12-12zm0 22c-5.514 0-10-4.486-10-10 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10 0 5.514-4.486 10-10 10zm0-18c-4.411 0-8 3.589-8 8 0 4.411 3.589 8 8 8 4.411 0 8-3.589 8-8 0-4.411-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6 0-3.309 2.691-6 6-6 3.309 0 6 2.691 6 6 0 3.309-2.691 6-6 6zm0-10c-2.206 0-4 1.794-4 4 0 2.206 1.794 4 4 4 2.206 0 4-1.794 4-4 0-2.206-1.794-4-4-4z"/></svg>
            </a>
            <a href="https://github.com/mansingh-04" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

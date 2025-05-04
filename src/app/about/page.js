import Image from "next/image"

export default function About() {
  return (
    <div>
      <section className="hero-section" style={{ backgroundImage: "url(/images/about-hero.jpg)" }}>
        <div className="container hero-content">
          <h1 className="hero-title">About This Project</h1>
          <p className="hero-subtitle">A modern, full-stack movie web app built for movie lovers and tech enthusiasts</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="about-mission">
            <div>
              <h1 className="about-title">Project Overview</h1>
              <p>This project is a feature-rich movie web application that allows users to discover, search, and learn about movies and TV shows. It offers recommendations, search functionality, trivia, and user authentication, all wrapped in a modern, responsive UI.</p>
              <h1 className="about-title" style={{ marginTop: '2rem' }}>Tech Stack</h1>
              <ul>
                <li><strong>Frontend:</strong> Next.js (React), CSS Modules</li>
                <li><strong>Backend/API:</strong> TMDB (The Movie Database) API</li>
                <li><strong>Authentication:</strong> Custom (with future Firebase integration)</li>
                <li><strong>UI/UX:</strong> Responsive design, dark/light mode, modern card layouts</li>
              </ul>
              <h1 className="about-title" style={{ marginTop: '2rem' }}>Key Features</h1>
              <ul>
                <li>Movie & TV show recommendations with pagination and sorting</li>
                <li>Live search for movies, TV shows, and people</li>
                <li>Detailed modals for both movies and TV shows (cast, genres, overview, etc.)</li>
                <li>Authentication (sign up/sign in) with form validation</li>
                <li>Light/dark theme toggle with smooth transitions</li>
                <li>Responsive, mobile-friendly design</li>
                <li>Trivia and fun facts (coming soon)</li>
              </ul>
            </div>
            <div className="about-image">
              <Image src="/images/about-image.jpg" alt="MovieVerse Project" fill style={{ objectFit: "cover", borderRadius: "0.5rem" }} />
            </div>
          </div>
        </div>
        <br></br>
      </section>

      <section className="about-team">
        <div className="container">
          <h1 className="about-title text-center">About the Developer</h1>
          <div className="about-team-grid">
            <div className="about-team-member">
              <div className="about-team-photo"><Image src="/images/team-member1.jpg" alt="Developer Photo" fill style={{ objectFit: "cover" }} /></div>
              <h2>Manpreet Singh</h2>
              <p className="about-team-role">Full Stack Developer</p>
              <p>I am a passionate developer with a love for movies and technology. This project was built to combine my interests in web development and film, and to provide a seamless, enjoyable experience for users. I enjoy working with modern JavaScript frameworks and building scalable, user-friendly applications.</p>
              <p>Connect with me on <a href="https://www.linkedin.com/in/manpreet-singh-9bb415318/" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline' }}>LinkedIn</a>!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

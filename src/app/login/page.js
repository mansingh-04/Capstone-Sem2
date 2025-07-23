"use client"
import { auth, signInWithEmailAndPassword } from '../../lib/firebase';
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    if (!emailValid) {
      setError("Please enter a valid email address.")
      return
    }
    if (!formData.password) {
      setError("Password cannot be empty.")
      return
    }
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      router.replace("/")
    } catch (err) {
      let message = "Failed to sign in. Please try again."
      if (err.code === "auth/user-not-found") {
        message = "No account found with this email address."
      } else if (err.code === "auth/wrong-password") {
        message = "The password you entered is incorrect. Please try again."
      } else if (err.code === "auth/invalid-email") {
        message = "The email address is invalid."
      } else if (err.code === "auth/too-many-requests") {
        message = "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later."
      } else if (err.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection and try again."
      } else if (err.code === "auth/internal-error") {
        message = "An internal error occurred. Please try again later."
      } else if (err.code === "auth/operation-not-allowed") {
        message = "Sign in is currently disabled. Please contact support."
      } else if (err.code === "auth/invalid-credential") {
        message = "Your login credentials are invalid or have expired. Please check your email and password and try again. If the problem persists, try signing up for a new account."
      } else if (err.message) {
        message = err.message;
      }
      setError(message)
    }
  }

  return (
    <div className="container">
      <div className="auth-container">
        <h1 className="auth-title text-2xl font-bold">Sign In to MovieVerse</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>
            {/* <Link href="/forgot-password" className="text-sm text-[#7c3aed] hover:underline">
              Forgot password?
            </Link> */}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

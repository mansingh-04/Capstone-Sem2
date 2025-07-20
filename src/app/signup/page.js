"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth, createUserWithEmailAndPassword } from '../../lib/firebase';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      router.push("/")
    } catch (err) {
      let message = "Failed to create account. Please try again."
      if (err.code === "auth/email-already-in-use") {
        message = "An account with this email already exists. Please sign in or use a different email."
      } else if (err.code === "auth/invalid-email") {
        message = "The email address is invalid."
      } else if (err.code === "auth/weak-password") {
        message = "Password is too weak. Please use at least 8 characters."
      } else if (err.code === "auth/operation-not-allowed") {
        message = "Sign up is currently disabled. Please contact support."
      } else if (err.message) {
        message = err.message;
      }
      setError(message)
    }
  }

  return (
    <div className="container">
      <div className="auth-container">
        <h1 className="auth-title text-2xl font-bold">Create an Account</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="flex items-center mb-6">
            <input type="checkbox" id="terms" className="mr-2" required />
            <label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms-of-service" className="text-[#7c3aed] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#7c3aed] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

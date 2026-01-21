'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordReset, validateEmail, getAuthErrorMessage } from '@/lib/firebase/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      await sendPasswordReset(email)
      setSuccess(true)
      setEmail('')
    } catch (error: any) {
      console.error('Password reset error:', error)

      const errorMessage = error.code
        ? getAuthErrorMessage(error.code)
        : 'Failed to send reset email. Please try again.'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light via-light to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-serif text-dark mb-2">Forgot Password</h1>
          <p className="text-dark/60">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Reset Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {success ? (
            // Success Message
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-dark mb-2">Check Your Email</h3>
                <p className="text-dark/70 text-sm">
                  We've sent a password reset link to your email address. Please check your inbox
                  and follow the instructions.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/admin/login"
                  className="inline-block bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors touch-active touch-manipulation"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            // Reset Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all touch-manipulation"
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-active touch-manipulation"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="text-sm text-primary hover:text-primary-600 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Back to Site */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-dark/60 hover:text-dark transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to site
          </a>
        </div>
      </div>
    </div>
  )
}

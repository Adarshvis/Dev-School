'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface InvitationData {
  valid: boolean
  email: string
  name?: string
  role: string
  expiresAt: string
}

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="accept-invite-page">
      <div className="invite-container">
        <div className="invite-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
}

// Main component that uses useSearchParams
function AcceptInviteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  })

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. No token provided.')
      setLoading(false)
      return
    }

    async function validateToken() {
      try {
        const response = await fetch(`/api/invitations/accept?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Invalid invitation')
          setLoading(false)
          return
        }

        setInvitation(data)
        setFormData(prev => ({ ...prev, name: data.name || '' }))
        setLoading(false)
      } catch (err) {
        setError('Failed to validate invitation')
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          name: formData.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      
      // Redirect to admin after 3 seconds
      setTimeout(() => {
        router.push('/admin')
      }, 3000)
    } catch (err) {
      setError('Failed to create account')
      setSubmitting(false)
    }
  }

  const roleLabels: Record<string, string> = {
    author: 'Author',
    editor: 'Editor',
    admin: 'Administrator',
    superadmin: 'Super Administrator',
  }

  // Loading state
  if (loading) {
    return (
      <div className="accept-invite-page">
        <div className="invite-container">
          <div className="invite-card">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Validating invitation...</p>
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  }

  // Error state (invalid/expired token)
  if (error && !invitation) {
    return (
      <div className="accept-invite-page">
        <div className="invite-container">
          <div className="invite-card error-card">
            <div className="error-icon">X</div>
            <h1>Invitation Error</h1>
            <p className="error-message">{error}</p>
            <Link href="/" className="btn-secondary">
              Return to Home
            </Link>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="accept-invite-page">
        <div className="invite-container">
          <div className="invite-card success-card">
            <div className="success-icon-check"></div>
            <h1>Welcome to CyPSi Lab!</h1>
            <p>Your account has been created successfully.</p>
            <p className="redirect-notice">Redirecting to login...</p>
            <Link href="/admin" className="btn-primary">
              Go to Admin Panel
            </Link>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  }

  // Form state
  return (
    <div className="accept-invite-page">
      <div className="invite-container">
        <div className="invite-card">
          {/* Header */}
          <div className="invite-header">
            <div className="logo">
              <span className="logo-cypsi">CyPSi</span>
              <span className="logo-lab">Lab</span>
            </div>
            <p className="tagline">Cyber Physical Systems</p>
            <p className="university">University of Delhi, South Campus</p>
          </div>

          {/* Welcome Message */}
          <div className="welcome-section">
            <h1>You're Invited!</h1>
            <p>Complete your account setup to join as</p>
            <span className="role-badge">{roleLabels[invitation?.role || 'author']}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="invite-form">
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={invitation?.email || ''}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password (min 8 characters)"
                minLength={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="invite-footer">
            <p>Already have an account? <Link href="/admin">Login here</Link></p>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
}

// Wrapper component with Suspense boundary
export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AcceptInviteContent />
    </Suspense>
  )
}

const styles = `
  .accept-invite-page {
    min-height: 100vh;
    background: #e6edf0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .invite-container {
    width: 100%;
    max-width: 480px;
  }

  .invite-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .invite-header {
    background: linear-gradient(135deg, #011e2c 0%, #022a3d 100%);
    padding: 30px;
    text-align: center;
  }

  .logo {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .logo-cypsi {
    color: #ffffff;
  }

  .logo-lab {
    color: #f59e0b;
  }

  .tagline {
    color: #94a3b8;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }

  .university {
    color: #cbd5e1;
    font-size: 11px;
    margin: 5px 0 0 0;
  }

  .welcome-section {
    padding: 30px 30px 20px;
    text-align: center;
  }

  .welcome-section h1 {
    color: #011e2c;
    font-size: 28px;
    margin: 0 0 10px;
  }

  .welcome-section p {
    color: #64748b;
    margin: 0 0 15px;
  }

  .role-badge {
    display: inline-block;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #ffffff;
    padding: 8px 24px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
  }

  .invite-form {
    padding: 0 30px 30px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    color: #334155;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .form-group input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #011e2c;
    box-shadow: 0 0 0 3px rgba(1, 30, 44, 0.1);
  }

  .input-disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }

  .form-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .btn-primary {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #011e2c 0%, #022a3d 100%);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(1, 30, 44, 0.3);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-secondary {
    display: inline-block;
    padding: 14px 28px;
    background: #f1f5f9;
    color: #334155;
    border-radius: 10px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
  }

  .invite-footer {
    padding: 20px 30px;
    background: #f8fafc;
    text-align: center;
    border-top: 1px solid #e2e8f0;
  }

  .invite-footer p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
  }

  .invite-footer a {
    color: #011e2c;
    font-weight: 600;
    text-decoration: none;
  }

  .invite-footer a:hover {
    text-decoration: underline;
  }

  /* Error and Success Cards */
  .error-card,
  .success-card {
    padding: 50px 30px;
    text-align: center;
  }

  .error-icon,
  .success-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  .error-icon {
    width: 64px;
    height: 64px;
    background: #fef2f2;
    color: #dc2626;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 32px;
    font-weight: 700;
  }

  .success-icon-check {
    width: 64px;
    height: 64px;
    background: #22c55e;
    border-radius: 50%;
    margin: 0 auto 20px;
    position: relative;
  }

  .success-icon-check::after {
    content: '';
    position: absolute;
    left: 22px;
    top: 14px;
    width: 18px;
    height: 32px;
    border: solid white;
    border-width: 0 4px 4px 0;
    transform: rotate(45deg);
  }

  .error-card h1,
  .success-card h1 {
    color: #011e2c;
    margin: 0 0 15px;
  }

  .error-message {
    color: #dc2626;
    margin-bottom: 25px;
  }

  .success-card p {
    color: #64748b;
    margin: 0 0 10px;
  }

  .redirect-notice {
    color: #22c55e;
    font-weight: 500;
    margin-bottom: 20px !important;
  }

  /* Loading Spinner */
  .loading-spinner {
    padding: 60px;
    text-align: center;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top-color: #011e2c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-spinner p {
    color: #64748b;
    margin: 0;
  }
`

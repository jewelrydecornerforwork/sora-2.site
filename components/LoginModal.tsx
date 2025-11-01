'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted (for SSR compatibility)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!mounted) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, mounted])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast.error('Failed to sign in with Google')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsLoading(true)
      await login(email, password)
      toast.success('Login successful!')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render anything on server or if not open
  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 my-auto transform transition-all duration-300 ease-out scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
          aria-label="Close login modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="Sora-2 Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text">Welcome to Sora-2</h2>
          <p className="text-gray-400 text-sm">Sign in to start creating amazing AI videos</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-md hover:shadow-lg transform hover:scale-[1.02] duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-[1.02] duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render at document body
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null
}

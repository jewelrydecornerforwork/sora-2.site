'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, LogOut, CreditCard } from 'lucide-react'
import { LoginModal } from './LoginModal'

export function Header() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 监听滚动事件，实现导航栏背景透明度变化
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`backdrop-blur-md border-b border-gray-700 sticky top-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-gray-900/95 shadow-lg' 
        : 'bg-gray-900/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">Sora-2</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors font-medium">
              Features
            </a>
            <Link href="/pricing" className="text-gray-300 hover:text-purple-400 transition-colors font-medium">
              Pricing
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name || 'User'}</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{user.credits} Credits</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-black text-white px-6 py-2 rounded-lg border-2 border-transparent hover:opacity-90 transition-all"
                  style={{
                    background: 'linear-gradient(black, black) padding-box, linear-gradient(45deg, #9333ea, #ec4899) border-box',
                    border: '2px solid transparent'
                  }}
                >
                  Log in
                </button>
                <Link
                  href="/auth/register"
                  className="bg-black text-white px-6 py-2 rounded-lg border-2 border-transparent hover:opacity-90 transition-all"
                  style={{
                    background: 'linear-gradient(black, black) padding-box, linear-gradient(45deg, #9333ea, #ec4899) border-box',
                    border: '2px solid transparent'
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/explore" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link 
                href="/history" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>

              <div className="pt-4 border-t border-gray-700">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm text-gray-400">
                      Welcome, {user.name || 'User'}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{user.credits} Credits</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-black text-white px-6 py-2 rounded-lg border-2 border-transparent hover:opacity-90 transition-all"
                      style={{
                        background: 'linear-gradient(black, black) padding-box, linear-gradient(45deg, #9333ea, #ec4899) border-box',
                        border: '2px solid transparent'
                      }}
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-black text-white px-6 py-2 rounded-lg border-2 border-transparent hover:opacity-90 transition-all"
                      style={{
                        background: 'linear-gradient(black, black) padding-box, linear-gradient(45deg, #9333ea, #ec4899) border-box',
                        border: '2px solid transparent'
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  )
}

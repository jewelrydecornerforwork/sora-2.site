'use client'

import { useState } from 'react'
import Link from 'next/link'
// import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, CreditCard } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // 模拟用户状态
  const session = null as { user?: { name?: string } } | null
  const status: 'loading' | 'authenticated' | 'unauthenticated' = 'unauthenticated'

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">Sora-2 Ai</span>
              <span className="text-xs text-gray-500">sora-2.site</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-blue-600 transition-colors">
              Explore
            </Link>
            <Link href="/history" className="text-gray-700 hover:text-blue-600 transition-colors">
              History
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{session.user?.name || 'User'}</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credits</span>
                </Link>
                <button
                  onClick={() => alert('登出功能待实现')}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
                <button
                  onClick={() => alert('登录功能待实现')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/explore" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link 
                href="/history" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>
              
              <div className="pt-4 border-t border-gray-200">
                {session ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm text-gray-600">
                      Welcome, {session.user?.name || 'User'}
                    </div>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Credits</span>
                    </Link>
                    <button
                      onClick={() => {
                        alert('登出功能待实现')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                    <button
                      onClick={() => {
                        alert('Login feature coming soon')
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Login
                    </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

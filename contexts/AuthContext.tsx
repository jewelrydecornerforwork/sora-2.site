'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  image?: string
  credits: number
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateCredits: (credits: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 同步 NextAuth session 和本地用户状态
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (session?.user) {
      // 使用 NextAuth session
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        credits: session.user.credits || 100,
      })
      setLoading(false)
    } else {
      // 检查本地存储的用户（用于非 OAuth 登录）
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Failed to load user from localStorage:', error)
        }
      }
      setLoading(false)
    }
  }, [session, status])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      toast.success('Login successful!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      toast.success('Registration successful!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
      throw error
    }
  }

  const logout = async () => {
    // 如果使用 NextAuth session，调用 NextAuth signOut
    if (session) {
      await nextAuthSignOut({ redirect: false })
    }

    // 清除本地存储
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
  }

  const updateCredits = (credits: number) => {
    if (user) {
      const updatedUser = { ...user, credits }
      setUser(updatedUser)
      if (!session) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateCredits }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

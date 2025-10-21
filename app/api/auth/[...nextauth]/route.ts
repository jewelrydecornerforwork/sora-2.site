import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

// 简单的用户数据存储
const getUsers = () => {
  if (typeof window === 'undefined') {
    return global.users || (global.users = [])
  }
  return []
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const users = getUsers()
        const user = users.find((u: any) => u.email === credentials.email)

        if (!user) {
          throw new Error('User not found')
        }

        if (user.password !== credentials.password) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || null,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 处理 OAuth 登录
      if (account?.provider === 'google' || account?.provider === 'github') {
        const users = getUsers()
        let existingUser = users.find((u: any) => u.email === user.email)

        if (!existingUser) {
          // 创建新用户
          const newUser = {
            id: user.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email: user.email!,
            name: user.name || 'User',
            image: user.image || null,
            credits: 100,
            createdAt: new Date().toISOString(),
            provider: account.provider,
          }
          users.push(newUser)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image

        // 从存储中获取用户完整信息
        const users = getUsers()
        const fullUser = users.find((u: any) => u.email === user.email)
        if (fullUser) {
          token.credits = fullUser.credits
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.credits = token.credits as number || 100
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

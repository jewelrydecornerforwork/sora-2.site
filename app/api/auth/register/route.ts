import { NextRequest, NextResponse } from 'next/server'

interface RegisterRequest {
  email: string
  password: string
  name: string
}

// 简单的用户数据存储（生产环境应该使用真实数据库）
const getUsers = () => {
  if (typeof window === 'undefined') {
    return (global as any).users || ((global as any).users = [])
  }
  return []
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, name } = body

    // 验证输入
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // 密码强度验证
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const users = getUsers()
    const existingUser = users.find((u: any) => u.email === email)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // 创建新用户
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password, // 实际应用中应该加密存储
      name,
      credits: 100, // 新用户赠送100积分
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    // 生成简单的 token（实际应用中应该使用JWT）
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

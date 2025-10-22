import { NextRequest, NextResponse } from 'next/server'

interface LoginRequest {
  email: string
  password: string
}

// 简单的用户数据存储（生产环境应该使用真实数据库）
const getUsers = () => {
  if (typeof window === 'undefined') {
    // 服务器端：使用内存存储
    return (global as any).users || ((global as any).users = [])
  }
  return []
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // 从本地存储或数据库查找用户（这里使用简单的模拟）
    // 在实际应用中，应该从数据库查询
    const users = getUsers()
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // 验证密码（实际应用中应该使用bcrypt等加密）
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // 生成简单的 token（实际应用中应该使用JWT）
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

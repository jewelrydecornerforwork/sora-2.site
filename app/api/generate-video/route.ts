import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🎬 收到视频生成请求')
  
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string
    const model = formData.get('model') as string
    const resolution = formData.get('resolution') as string
    const duration = formData.get('duration') as string

    console.log('📋 请求参数:', {
      hasImage: !!image,
      imageName: image?.name,
      imageSize: image?.size,
      prompt: prompt?.substring(0, 50) + '...',
      model,
      resolution,
      duration
    })

    // 验证输入
    if (!image) {
      console.log('❌ 缺少图像文件')
      return NextResponse.json({ error: '请上传图像文件' }, { status: 400 })
    }
    
    if (!prompt || !prompt.trim()) {
      console.log('❌ 缺少运动描述')
      return NextResponse.json({ error: '请输入运动描述' }, { status: 400 })
    }

    console.log('⏳ 开始模拟视频生成...')
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 3000))

    console.log('✅ 视频生成完成')

    // 返回模拟结果
    return NextResponse.json({
      success: true,
      videoUrl: '/demo-video.mp4', // 演示视频
      imageUrl: '/demo-image.jpg', // 演示图像
      creditsUsed: 10,
      message: '视频生成成功！（演示模式）',
      prompt: prompt,
      model: model,
      resolution: resolution,
      duration: duration
    })

  } catch (error) {
    console.error('❌ 视频生成错误:', error)
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

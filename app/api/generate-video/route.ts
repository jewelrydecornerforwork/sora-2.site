import { NextRequest, NextResponse } from 'next/server'

// 将图片文件转换为 Base64 编码
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return `data:${file.type};base64,${buffer.toString('base64')}`
}

// Replicate API - 免费额度每月 $5
async function generateWithReplicate(imageBase64: string, prompt: string): Promise<string> {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN
  
  if (!REPLICATE_API_TOKEN) {
    throw new Error('未配置 REPLICATE_API_TOKEN')
  }

  console.log('📡 使用 Replicate API 生成视频...')

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
      input: {
        input_image: imageBase64,
        motion_bucket_id: 127,
        fps: 7,
        cond_aug: 0.02,
        decoding_t: 14,
        seed: Math.floor(Math.random() * 1000000)
      }
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Replicate API 错误: ${error.detail || response.statusText}`)
  }

  const prediction = await response.json()
  console.log('⏳ 预测 ID:', prediction.id)

  // 轮询结果
  let result = prediction
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      },
    })
    
    result = await statusResponse.json()
    console.log('📊 状态:', result.status)
  }

  if (result.status === 'succeeded' && result.output) {
    return result.output
  } else {
    throw new Error(`视频生成失败: ${result.error || '未知错误'}`)
  }
}

// Hugging Face Inference API - 完全免费（有速率限制）
async function generateWithHuggingFace(imageBase64: string, prompt: string): Promise<string> {
  const HF_API_TOKEN = process.env.HF_API_TOKEN
  
  if (!HF_API_TOKEN) {
    throw new Error('未配置 HF_API_TOKEN')
  }

  console.log('📡 使用 Hugging Face API 生成视频...')

  // 移除 base64 前缀
  const base64Data = imageBase64.split(',')[1]

  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: base64Data,
        parameters: {
          num_frames: 14,
          num_inference_steps: 25
        }
      }),
    }
  )

  if (!response.ok) {
    if (response.status === 503) {
      throw new Error('模型正在加载中，请稍后再试（约20秒）')
    }
    const error = await response.json()
    throw new Error(`Hugging Face API 错误: ${error.error || response.statusText}`)
  }

  // 将响应转换为 Base64
  const videoBlob = await response.blob()
  const buffer = Buffer.from(await videoBlob.arrayBuffer())
  return `data:video/mp4;base64,${buffer.toString('base64')}`
}

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

    // 检查是否配置了API密钥
    const hasReplicateToken = !!process.env.REPLICATE_API_TOKEN
    const hasHFToken = !!process.env.HF_API_TOKEN

    console.log('🔑 API 密钥状态:', {
      hasReplicateToken,
      hasHFToken
    })

    // 如果没有配置任何API，返回演示模式
    if (!hasReplicateToken && !hasHFToken) {
      console.log('⚠️ 未配置 API 密钥，使用演示模式')
      console.log('⏳ 返回演示视频...')
      
      await new Promise(resolve => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        videoUrl: '/demo-video.mp4',
        imageUrl: '/demo-image.jpg',
        creditsUsed: 0,
        message: '演示模式：请配置 REPLICATE_API_TOKEN 或 HF_API_TOKEN 以使用真实的 AI 视频生成服务',
        prompt: prompt,
        model: 'demo',
        resolution: resolution,
        duration: duration,
        isDemo: true
      })
    }

    console.log('⏳ 开始生成视频...')
    
    // 将图片转换为 Base64
    const imageBase64 = await fileToBase64(image)
    
    let videoUrl: string

    try {
      // 优先使用 Replicate（质量更好）
      if (hasReplicateToken) {
        videoUrl = await generateWithReplicate(imageBase64, prompt)
      } 
      // 备选使用 Hugging Face（完全免费）
      else if (hasHFToken) {
        videoUrl = await generateWithHuggingFace(imageBase64, prompt)
      } else {
        throw new Error('未配置任何 API 密钥')
      }

      console.log('✅ 视频生成成功')

      return NextResponse.json({
        success: true,
        videoUrl: videoUrl,
        creditsUsed: hasReplicateToken ? 1 : 0,
        message: '视频生成成功！',
        prompt: prompt,
        model: hasReplicateToken ? 'stable-video-diffusion (Replicate)' : 'stable-video-diffusion (HuggingFace)',
        resolution: resolution,
        duration: duration,
        isDemo: false
      })

    } catch (apiError) {
      console.error('❌ API 调用失败，回退到演示模式:', apiError)
      
      // API 失败时回退到演示模式
      return NextResponse.json({
        success: true,
        videoUrl: '/demo-video.mp4',
        imageUrl: '/demo-image.jpg',
        creditsUsed: 0,
        message: `API 调用失败，返回演示视频。错误: ${apiError instanceof Error ? apiError.message : '未知错误'}`,
        prompt: prompt,
        model: 'demo (fallback)',
        resolution: resolution,
        duration: duration,
        isDemo: true
      })
    }

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

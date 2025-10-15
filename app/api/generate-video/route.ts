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

// Kie.ai Sora 2 API - 付费但价格便宜（$0.15/10秒视频）
async function generateWithKie(imageBase64: string, prompt: string, duration: string, resolution: string): Promise<string> {
  const KIE_API_KEY = process.env.KIE_API_KEY

  if (!KIE_API_KEY) {
    throw new Error('未配置 KIE_API_KEY')
  }

  console.log('📡 使用 Kie.ai Sora 2 API 生成视频...')

  // 移除 base64 前缀（如果有）
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64

  const response = await fetch('https://api.kie.ai/api/v1/sora-2/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      image: base64Data,
      duration: parseInt(duration) || 5,
      resolution: resolution || '720p',
      aspectRatio: '16:9'
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`

    try {
      const error = JSON.parse(errorText)
      errorMessage = error.error || error.message || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }

    throw new Error(`Kie API 错误: ${errorMessage}`)
  }

  const result = await response.json()
  console.log('📊 Kie API 响应:', result)

  // Kie API 可能返回任务 ID 需要轮询，或者直接返回视频 URL
  if (result.taskId) {
    // 轮询任务状态
    console.log('⏳ 任务 ID:', result.taskId)
    return await pollKieTask(result.taskId, KIE_API_KEY)
  } else if (result.videoUrl || result.video_url || result.url) {
    return result.videoUrl || result.video_url || result.url
  } else {
    throw new Error('Kie API 返回格式不正确')
  }
}

// 轮询 Kie API 任务状态
async function pollKieTask(taskId: string, apiKey: string): Promise<string> {
  const maxAttempts = 60 // 最多轮询 60 次（约 2 分钟）
  let attempts = 0

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000)) // 每 2 秒轮询一次
    attempts++

    const response = await fetch(`https://api.kie.ai/api/v1/sora-2/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`轮询任务失败: HTTP ${response.status}`)
    }

    const result = await response.json()
    console.log(`📊 任务状态 (${attempts}/${maxAttempts}):`, result.status)

    if (result.status === 'completed' || result.status === 'succeeded') {
      if (result.videoUrl || result.video_url || result.url) {
        return result.videoUrl || result.video_url || result.url
      }
      throw new Error('任务完成但没有返回视频 URL')
    } else if (result.status === 'failed' || result.status === 'error') {
      throw new Error(`任务失败: ${result.error || result.message || '未知错误'}`)
    }
  }

  throw new Error('任务超时：视频生成时间过长')
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

    // 检查是否配置了API密钥（排除占位符）
    const kieApiKey = process.env.KIE_API_KEY
    const replicateToken = process.env.REPLICATE_API_TOKEN
    const hfToken = process.env.HF_API_TOKEN

    const hasKieKey = kieApiKey && kieApiKey !== 'kie_...' && !kieApiKey.includes('...')
    const hasReplicateToken = replicateToken && replicateToken !== 'r8_...' && !replicateToken.includes('...')
    const hasHFToken = hfToken && hfToken !== 'hf_...' && !hfToken.includes('...')

    console.log('🔑 API 密钥状态:', {
      hasKieKey,
      hasReplicateToken,
      hasHFToken,
      kiePrefix: kieApiKey?.substring(0, 5) || 'null',
      replicatePrefix: replicateToken?.substring(0, 5) || 'null',
      hfPrefix: hfToken?.substring(0, 5) || 'null'
    })

    // 如果没有配置任何API，返回演示模式
    if (!hasKieKey && !hasReplicateToken && !hasHFToken) {
      console.log('⚠️ 未配置 API 密钥，使用演示模式')
      console.log('⏳ 返回演示视频...')

      await new Promise(resolve => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        videoUrl: '/demo-video.mp4',
        imageUrl: '/demo-image.jpg',
        creditsUsed: 0,
        message: '演示模式：请配置 KIE_API_KEY、REPLICATE_API_TOKEN 或 HF_API_TOKEN 以使用真实的 AI 视频生成服务',
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
      let usedModel = 'unknown'

      // 优先使用 Kie.ai Sora 2（最佳质量和性价比）
      if (hasKieKey) {
        videoUrl = await generateWithKie(imageBase64, prompt, duration, resolution)
        usedModel = 'Sora 2 (Kie.ai)'
      }
      // 备选使用 Replicate（质量好）
      else if (hasReplicateToken) {
        videoUrl = await generateWithReplicate(imageBase64, prompt)
        usedModel = 'Stable Video Diffusion (Replicate)'
      }
      // 最后使用 Hugging Face（完全免费）
      else if (hasHFToken) {
        videoUrl = await generateWithHuggingFace(imageBase64, prompt)
        usedModel = 'Stable Video Diffusion (HuggingFace)'
      } else {
        throw new Error('未配置任何 API 密钥')
      }

      console.log('✅ 视频生成成功')

      return NextResponse.json({
        success: true,
        videoUrl: videoUrl,
        creditsUsed: hasKieKey ? 1 : (hasReplicateToken ? 1 : 0),
        message: '视频生成成功！',
        prompt: prompt,
        model: usedModel,
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

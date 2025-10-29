import { NextRequest, NextResponse } from 'next/server'

// Type definitions
type GenerationMode = 'text' | 'image'
type Resolution = '720p' | '1080p'
type VideoRatio = '16:9' | '9:16'

interface VideoGenerationRequest {
  mode: GenerationMode
  textPrompt?: string
  motionPrompt?: string
  image?: File
  model: string
  resolution: Resolution
  videoRatio: VideoRatio
  duration: string
  isPublic?: string
  audio?: File
}

interface VideoGenerationResponse {
  success: boolean
  videoUrl?: string
  imageUrl?: string
  creditsUsed: number
  message: string
  mode: GenerationMode
  prompt: string
  model: string
  resolution: string
  duration: string
  isDemo: boolean
  error?: string
  details?: string
}

interface ReplicatePrediction {
  id: string
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  output?: string | string[]
  error?: string
}

interface KieTaskResponse {
  taskId?: string
  videoUrl?: string
  video_url?: string
  url?: string
  status?: 'pending' | 'processing' | 'completed' | 'succeeded' | 'failed' | 'error'
  error?: string
  message?: string
}

// API configuration constants
const API_CONFIG = {
  // Replicate API
  REPLICATE: {
    MODEL_VERSION: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    FPS: 7,
    MOTION_BUCKET_ID: 127,
    COND_AUG: 0.02,
    DECODING_T: 14,
  },
  // Hugging Face API
  HUGGING_FACE: {
    MODEL: 'stabilityai/stable-video-diffusion-img2vid-xt',
    NUM_FRAMES: 14,
    NUM_INFERENCE_STEPS: 25,
  },
  // Kie.ai API
  KIE: {
    BASE_URL: 'https://api.kie.ai',
    CREATE_TASK_ENDPOINT: '/createTask',
    GET_TASK_ENDPOINT: '/getTaskResult',
    DEFAULT_ASPECT_RATIO: '16:9',
  },
  // Polling configuration
  POLLING: {
    MAX_ATTEMPTS: 60,
    INTERVAL_MS: 2000,
  },
}

// Validation configuration constants
const VALIDATION_CONFIG = {
  MAX_TEXT_PROMPT_LENGTH: 1000,
  MAX_MOTION_PROMPT_LENGTH: 500,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_IMAGE_DIMENSION: 360,
  MAX_IMAGE_DIMENSION: 2000,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'],
  ALLOWED_RESOLUTIONS: ['720p', '1080p'],
  ALLOWED_VIDEO_RATIOS: ['16:9', '9:16'],
  MIN_DURATION: 5,
  MAX_DURATION: 10,
}

// Convert image file to Base64 encoding
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return `data:${file.type};base64,${buffer.toString('base64')}`
}

// Helper function: Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 60000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs / 1000}s`)
    }
    throw error
  }
}

// Helper function: Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on authentication errors
      if (lastError.message.includes('401') || lastError.message.includes('403')) {
        throw lastError
      }

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i)
        console.log(`⚠️ Attempt ${i + 1} failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('All retry attempts failed')
}

// Text-to-Video - Using Replicate API
async function generateTextToVideoWithReplicate(textPrompt: string, duration: string, resolution: string): Promise<string> {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not configured')
  }

  console.log('📡 Generating text-to-video with Replicate API...')

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: API_CONFIG.REPLICATE.MODEL_VERSION,
      input: {
        prompt: textPrompt,
        num_frames: parseInt(duration) * API_CONFIG.REPLICATE.FPS,
        fps: API_CONFIG.REPLICATE.FPS,
        seed: Math.floor(Math.random() * 1000000)
      }
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Replicate API error: ${error.detail || response.statusText}`)
  }

  const prediction = await response.json()
  console.log('⏳ Prediction ID:', prediction.id)

  // Poll results
  let result = prediction
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, API_CONFIG.POLLING.INTERVAL_MS))

    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      },
    })

    result = await statusResponse.json()
    console.log('📊 Status:', result.status)
  }

  if (result.status === 'succeeded' && result.output) {
    return result.output
  } else {
    throw new Error(`Video generation failed: ${result.error || 'Unknown error'}`)
  }
}

// Image-to-Video - Using Replicate API
async function generateImageToVideoWithReplicate(imageBase64: string, prompt: string): Promise<string> {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not configured')
  }

  console.log('📡 Generating image-to-video with Replicate API...')

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: API_CONFIG.REPLICATE.MODEL_VERSION,
      input: {
        input_image: imageBase64,
        motion_bucket_id: API_CONFIG.REPLICATE.MOTION_BUCKET_ID,
        fps: API_CONFIG.REPLICATE.FPS,
        cond_aug: API_CONFIG.REPLICATE.COND_AUG,
        decoding_t: API_CONFIG.REPLICATE.DECODING_T,
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
    await new Promise(resolve => setTimeout(resolve, API_CONFIG.POLLING.INTERVAL_MS))

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

// Kie.ai Sora 2 API - Supports text-to-video and image-to-video
async function generateWithKie(
  mode: 'text' | 'image',
  textPrompt: string,
  imageFile: File | null,
  motionPrompt: string,
  duration: string,
  videoRatio: string
): Promise<string> {
  const KIE_API_KEY = process.env.KIE_API_KEY

  if (!KIE_API_KEY) {
    throw new Error('KIE_API_KEY is not configured')
  }

  console.log(`📡 Generating ${mode === 'text' ? 'text-to-video' : 'image-to-video'} with Kie.ai Sora 2 API...`)

  // Determine model based on mode
  const model = mode === 'text' ? 'sora-2-text-to-video' : 'sora-2-image-to-video'

  // Convert video ratio to aspect_ratio format
  const aspectRatio = videoRatio === '9:16' ? 'portrait' : 'landscape'

  // Convert duration to n_frames (10s or 15s)
  const nFrames = parseInt(duration) >= 10 ? '10s' : '5s'

  const requestBody: any = {
    model: model,
    prompt: mode === 'text' ? textPrompt : motionPrompt,
    aspect_ratio: aspectRatio,
    n_frames: nFrames,
    remove_watermark: true
  }

  // For image-to-video, convert image to base64 and include in request
  if (mode === 'image' && imageFile) {
    console.log('📤 Converting image to base64...')
    const imageBase64 = await fileToBase64(imageFile)
    // Use base64 data URL directly
    requestBody.image_urls = [imageBase64]
  }

  console.log('📝 Request body:', JSON.stringify({ ...requestBody, image_urls: requestBody.image_urls ? ['<base64_data>'] : undefined }, null, 2))

  const response = await fetchWithTimeout(
    `${API_CONFIG.KIE.BASE_URL}${API_CONFIG.KIE.CREATE_TASK_ENDPOINT}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
    30000
  )

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`

    try {
      const error = JSON.parse(errorText)
      errorMessage = error.error || error.message || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }

    throw new Error(`Kie API error: ${errorMessage}`)
  }

  const result = await response.json()
  console.log('📊 Kie API response:', result)

  // Kie API returns task ID that needs polling
  if (result.taskId || result.task_id || result.id) {
    const taskId = result.taskId || result.task_id || result.id
    console.log('⏳ Task ID:', taskId)
    return await pollKieTask(taskId, KIE_API_KEY)
  } else if (result.videoUrl || result.video_url || result.url) {
    return result.videoUrl || result.video_url || result.url
  } else {
    throw new Error('Kie API returned invalid format: ' + JSON.stringify(result))
  }
}

// Poll Kie API task status
async function pollKieTask(taskId: string, apiKey: string): Promise<string> {
  let attempts = 0

  while (attempts < API_CONFIG.POLLING.MAX_ATTEMPTS) {
    await new Promise(resolve => setTimeout(resolve, API_CONFIG.POLLING.INTERVAL_MS))
    attempts++

    const response = await fetch(`${API_CONFIG.KIE.BASE_URL}${API_CONFIG.KIE.GET_TASK_ENDPOINT}?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Task polling failed: HTTP ${response.status}`)
    }

    const result = await response.json()
    console.log(`📊 Task status (${attempts}/${API_CONFIG.POLLING.MAX_ATTEMPTS}):`, result.status || result.state)

    const status = result.status || result.state

    if (status === 'completed' || status === 'succeeded' || status === 'success') {
      if (result.videoUrl || result.video_url || result.url || result.output) {
        return result.videoUrl || result.video_url || result.url || result.output
      }
      throw new Error('Task completed but no video URL returned: ' + JSON.stringify(result))
    } else if (status === 'failed' || status === 'error') {
      throw new Error(`Task failed: ${result.error || result.message || 'Unknown error'}`)
    }
  }

  throw new Error('Task timeout: Video generation took too long')
}

// Hugging Face Inference API - Image-to-Video
async function generateImageToVideoWithHuggingFace(imageBase64: string, prompt: string): Promise<string> {
  const HF_API_TOKEN = process.env.HF_API_TOKEN

  if (!HF_API_TOKEN) {
    throw new Error('HF_API_TOKEN is not configured')
  }

  console.log('📡 Generating image-to-video with Hugging Face API...')

  // Remove base64 prefix
  const base64Data = imageBase64.split(',')[1]

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${API_CONFIG.HUGGING_FACE.MODEL}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: base64Data,
        parameters: {
          num_frames: API_CONFIG.HUGGING_FACE.NUM_FRAMES,
          num_inference_steps: API_CONFIG.HUGGING_FACE.NUM_INFERENCE_STEPS
        }
      }),
    }
  )

  if (!response.ok) {
    if (response.status === 503) {
      throw new Error('Model is loading, please try again in ~20 seconds')
    }
    const error = await response.json()
    throw new Error(`Hugging Face API error: ${error.error || response.statusText}`)
  }

  // Convert response to Base64
  const videoBlob = await response.blob()
  const buffer = Buffer.from(await videoBlob.arrayBuffer())
  return `data:video/mp4;base64,${buffer.toString('base64')}`
}

// Validation configuration constants
const MAX_TEXT_PROMPT_LENGTH = 1000
const MAX_MOTION_PROMPT_LENGTH = 500
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MIN_IMAGE_DIMENSION = 360
const MAX_IMAGE_DIMENSION = 2000
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']
const ALLOWED_RESOLUTIONS = ['720p', '1080p']
const ALLOWED_VIDEO_RATIOS = ['16:9', '9:16']
const MIN_DURATION = 5
const MAX_DURATION = 10

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const mode = formData.get('mode') as string
    const textPrompt = formData.get('textPrompt') as string
    const motionPrompt = formData.get('motionPrompt') as string
    const image = formData.get('image') as File
    const model = formData.get('model') as string
    const resolution = formData.get('resolution') as string
    const videoRatio = formData.get('videoRatio') as string
    const duration = formData.get('duration') as string

    // Validate inputs
    if (mode === 'text') {
      if (!textPrompt || !textPrompt.trim()) {
        return NextResponse.json({ error: 'Please enter a video description' }, { status: 400 })
      }
      if (textPrompt.length > MAX_TEXT_PROMPT_LENGTH) {
        return NextResponse.json({
          error: `Text prompt exceeds maximum length of ${MAX_TEXT_PROMPT_LENGTH} characters`
        }, { status: 400 })
      }
    } else if (mode === 'image') {
      if (!image) {
        return NextResponse.json({ error: 'Please upload an image file' }, { status: 400 })
      }

      // Validate image type
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return NextResponse.json({
          error: `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
        }, { status: 400 })
      }

      // Validate image size
      if (image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({
          error: `Image size exceeds maximum of ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
        }, { status: 400 })
      }

      // Validate image dimensions
      try {
        const buffer = Buffer.from(await image.arrayBuffer())
        const base64 = buffer.toString('base64')
        const img = Buffer.from(base64, 'base64')

        // Validate dimensions using Image metadata (simplified version, use sharp library in production)
        // Skipping detailed dimension checks here as it requires additional image processing libraries
        // Recommend adding sharp library for dimension validation in production deployment
      } catch (error) {
        return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })
      }

      if (!motionPrompt || !motionPrompt.trim()) {
        return NextResponse.json({ error: 'Please enter a motion description' }, { status: 400 })
      }
      if (motionPrompt.length > MAX_MOTION_PROMPT_LENGTH) {
        return NextResponse.json({
          error: `Motion prompt exceeds maximum length of ${MAX_MOTION_PROMPT_LENGTH} characters`
        }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'Invalid generation mode' }, { status: 400 })
    }

    // Validate resolution
    if (resolution && !ALLOWED_RESOLUTIONS.includes(resolution)) {
      return NextResponse.json({
        error: `Invalid resolution. Allowed: ${ALLOWED_RESOLUTIONS.join(', ')}`
      }, { status: 400 })
    }

    // Validate video ratio
    if (videoRatio && !ALLOWED_VIDEO_RATIOS.includes(videoRatio)) {
      return NextResponse.json({
        error: `Invalid video ratio. Allowed: ${ALLOWED_VIDEO_RATIOS.join(', ')}`
      }, { status: 400 })
    }

    // Validate duration
    const durationNum = parseInt(duration)
    if (isNaN(durationNum) || durationNum < MIN_DURATION || durationNum > MAX_DURATION) {
      return NextResponse.json({
        error: `Invalid duration. Must be between ${MIN_DURATION}-${MAX_DURATION} seconds`
      }, { status: 400 })
    }

    // Check if API keys are configured (excluding placeholders)
    const kieApiKey = process.env.KIE_API_KEY
    const replicateToken = process.env.REPLICATE_API_TOKEN
    const hfToken = process.env.HF_API_TOKEN

    // Improved API key validation: check for valid keys (non-empty, non-placeholder, meets minimum length)
    const isValidApiKey = (key: string | undefined, minLength: number = 20): boolean => {
      if (!key || key.trim().length < minLength) return false
      // Exclude common placeholder patterns
      const placeholderPatterns = [
        /^(kie_|r8_|hf_|sk-)?\.{3,}$/,  // kie_..., r8_..., hf_..., sk-...
        /your_.*_here/i,             // your_key_here
        /placeholder/i,              // placeholder
        /^(xxx|aaa|test)/i           // test values
      ]
      return !placeholderPatterns.some(pattern => pattern.test(key))
    }

    const hasKieKey = isValidApiKey(kieApiKey, 20)
    const hasReplicateToken = isValidApiKey(replicateToken, 30)
    const hasHFToken = isValidApiKey(hfToken, 30)

    // If no API is configured, return demo mode
    if (!hasKieKey && !hasReplicateToken && !hasHFToken) {
      console.log('⚠️ No API keys configured, using demo mode')
      await new Promise(resolve => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        videoUrl: '/demo-video.mp4',
        imageUrl: '/demo-image.jpg',
        creditsUsed: 0,
        message: 'Demo mode: Please configure at least one API key (KIE_API_KEY, REPLICATE_API_TOKEN, or HF_API_TOKEN) to use real AI video generation services',
        mode: mode,
        prompt: mode === 'text' ? textPrompt : motionPrompt,
        model: 'demo',
        resolution: resolution,
        duration: duration,
        isDemo: true
      })
    }

    let videoUrl: string
    let usedModel = 'unknown'

    try {
      if (mode === 'text') {
        // Text-to-video - Priority: Kie > Replicate
        if (hasKieKey) {
          videoUrl = await generateWithKie('text', textPrompt, null, '', duration, videoRatio)
          usedModel = 'Sora 2 (Kie.ai) - Text-to-Video'
        } else if (hasReplicateToken) {
          videoUrl = await generateTextToVideoWithReplicate(textPrompt, duration, resolution)
          usedModel = 'Stable Video Diffusion (Replicate) - Text-to-Video'
        } else {
          throw new Error('Text-to-video requires KIE_API_KEY or REPLICATE_API_TOKEN')
        }
      } else {
        // Image-to-video - Priority: Kie > Replicate > HuggingFace
        if (hasKieKey) {
          videoUrl = await generateWithKie('image', '', image, motionPrompt, duration, videoRatio)
          usedModel = 'Sora 2 (Kie.ai) - Image-to-Video'
        } else if (hasReplicateToken) {
          const imageBase64 = await fileToBase64(image)
          videoUrl = await generateImageToVideoWithReplicate(imageBase64, motionPrompt)
          usedModel = 'Stable Video Diffusion (Replicate) - Image-to-Video'
        } else if (hasHFToken) {
          const imageBase64 = await fileToBase64(image)
          videoUrl = await generateImageToVideoWithHuggingFace(imageBase64, motionPrompt)
          usedModel = 'Stable Video Diffusion (HuggingFace) - Image-to-Video'
        } else {
          throw new Error('No API key configured')
        }
      }

      return NextResponse.json({
        success: true,
        videoUrl: videoUrl,
        creditsUsed: hasKieKey ? 1 : (hasReplicateToken ? 1 : 0),
        message: 'Video generated successfully!',
        mode: mode,
        prompt: mode === 'text' ? textPrompt : motionPrompt,
        model: usedModel,
        resolution: resolution,
        duration: duration,
        isDemo: false
      })

    } catch (apiError) {
      // Fallback to demo mode when API fails
      return NextResponse.json({
        success: true,
        videoUrl: '/demo-video.mp4',
        imageUrl: '/demo-image.jpg',
        creditsUsed: 0,
        message: `API call failed, returning demo video. Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`,
        mode: mode,
        prompt: mode === 'text' ? textPrompt : motionPrompt,
        model: 'demo (fallback)',
        resolution: resolution,
        duration: duration,
        isDemo: true
      })
    }

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
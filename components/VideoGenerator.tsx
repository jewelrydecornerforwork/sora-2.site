'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Upload, Image as ImageIcon, Play, Settings, Volume2, Download, Video, Smartphone, Monitor, FileText, Wand2, Sparkles, History, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface VideoHistory {
  id: string
  videoUrl: string
  mode: 'text' | 'image'
  prompt: string
  model: string
  resolution: string
  duration: string
  videoRatio: string
  timestamp: number
  imagePreview?: string
}

interface VideoGeneratorProps {
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
}

export function VideoGenerator({ isGenerating, setIsGenerating }: VideoGeneratorProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [textPrompt, setTextPrompt] = useState('')
  const [motionPrompt, setMotionPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('google-veo3')
  const [resolution, setResolution] = useState('720p')
  const [videoRatio, setVideoRatio] = useState('16:9')
  const [duration, setDuration] = useState('10')
  const [removeWatermark, setRemoveWatermark] = useState(true)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')
  const [isDragOver, setIsDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')

  // Video history state
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load video history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('videoHistory')
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)
        setVideoHistory(parsed)
      }
    } catch (error) {
      console.error('Failed to load video history:', error)
    }
  }, [])

  // Save video to history
  const saveToHistory = (videoUrl: string, usedModel: string) => {
    const historyItem: VideoHistory = {
      id: Date.now().toString(),
      videoUrl,
      mode: activeTab,
      prompt: activeTab === 'text' ? textPrompt : motionPrompt,
      model: usedModel,
      resolution,
      duration,
      videoRatio,
      timestamp: Date.now(),
      imagePreview: activeTab === 'image' ? imagePreview || undefined : undefined
    }

    const newHistory = [historyItem, ...videoHistory].slice(0, 20) // Keep only last 20 videos
    setVideoHistory(newHistory)

    try {
      localStorage.setItem('videoHistory', JSON.stringify(newHistory))
    } catch (error) {
      console.error('Failed to save video history:', error)
      toast.error('Failed to save to history')
    }
  }

  // Load video from history
  const loadFromHistory = (item: VideoHistory) => {
    setGeneratedVideo(item.videoUrl)
    setActiveTab(item.mode)
    if (item.mode === 'text') {
      setTextPrompt(item.prompt)
    } else {
      setMotionPrompt(item.prompt)
      if (item.imagePreview) {
        setImagePreview(item.imagePreview)
      }
    }
    setResolution(item.resolution)
    setDuration(item.duration)
    setVideoRatio(item.videoRatio)
    setShowHistory(false)
    toast.success('Loaded from history')
  }

  // Delete single history item
  const deleteHistoryItem = (id: string) => {
    const newHistory = videoHistory.filter(item => item.id !== id)
    setVideoHistory(newHistory)
    try {
      localStorage.setItem('videoHistory', JSON.stringify(newHistory))
      toast.success('Deleted from history')
    } catch (error) {
      console.error('Failed to delete history item:', error)
    }
  }

  // Clear all history
  const clearHistory = () => {
    setVideoHistory([])
    localStorage.removeItem('videoHistory')
    toast.success('History cleared')
  }

  // Example prompts
  const textPromptExamples = [
    "A serene sunset over a calm ocean with waves gently rolling onto a sandy beach",
    "A futuristic city with flying cars and neon lights at night",
    "A cute puppy playing with a ball in a green park on a sunny day"
  ]

  const motionPromptExamples = [
    "Camera slowly zooms in, the subject looks towards the camera with a gentle smile",
    "Smooth pan from left to right, flowers swaying in the breeze",
    "Dynamic movement with the subject walking forward, background slightly blurred"
  ]

  // Auto-adjust duration when resolution changes to 1080p
  useEffect(() => {
    if (resolution === '1080p' && duration === '15') {
      setDuration('10')
      toast('1080p only supports 10s duration', { icon: 'ℹ️' })
    }
  }, [resolution, duration])

  // 图像上传处理
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  // 处理图片文件
  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success('图片上传成功！')
    } else {
      toast.error('请选择有效的图片文件！')
    }
  }

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processImageFile(files[0])
    }
  }

  // 音频上传处理
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      toast.success('音频文件上传成功！')
    }
  }

  // 生成视频
  const handleGenerateVideo = async () => {
    // 根据模式进行不同的验证
    if (activeTab === 'text') {
      if (!textPrompt.trim()) {
        toast.error('Please enter a text description!')
        return
      }
    } else if (activeTab === 'image') {
      if (!selectedImage) {
        toast.error('Please upload an image first!')
        return
      }
      if (!motionPrompt.trim()) {
        toast.error('Please enter a motion description!')
        return
      }
    }

    setIsGenerating(true)
    setGeneratedVideo(null)
    setProgress(0)
    setProgressMessage('Preparing your request...')

    // 模拟进度更新
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 1000)

    // 设置超时时间为 2 分钟
    const REQUEST_TIMEOUT = 120000
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      toast.error('Request timeout. Please try again.')
    }, REQUEST_TIMEOUT)

    try {
      setProgressMessage('Uploading data...')

      const formData = new FormData()
      formData.append('mode', activeTab)
      formData.append('textPrompt', textPrompt)
      formData.append('motionPrompt', motionPrompt)
      formData.append('model', selectedModel)
      formData.append('resolution', resolution)
      formData.append('videoRatio', videoRatio)
      formData.append('duration', duration)
      formData.append('removeWatermark', removeWatermark.toString())
      formData.append('isPublic', isPublic.toString())

      // 只在 Image to Video 模式下添加图片
      if (activeTab === 'image' && selectedImage) {
        formData.append('image', selectedImage)
      }

      if (audioFile) {
        formData.append('audio', audioFile)
      }

      setProgressMessage('Generating video with AI...')

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      setProgress(100)
      setProgressMessage('Video generated successfully!')

      console.log('API Response:', result)
      console.log('Video URL:', result.videoUrl)

      if (result.videoUrl) {
        setGeneratedVideo(result.videoUrl)

        // Save to history
        saveToHistory(result.videoUrl, result.model || 'Unknown')

        // 区分 Demo 模式和真实生成
        if (result.isDemo) {
          toast('Demo mode: ' + (result.message || 'Using demo video'), {
            icon: '⚠️',
            duration: 5000,
          })
        } else {
          toast.success('Video generated successfully!')
        }
      } else {
        throw new Error('No video URL returned')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setProgress(0)
      setProgressMessage('')

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast.error('Request timeout. The video generation took too long. Please try again.')
        } else if (error.message === 'Failed to fetch') {
          toast.error('Network error: Unable to connect to the server. Please check your internet connection and ensure the server is running.')
        } else {
          toast.error(`Video generation failed: ${error.message}`)
        }
        console.error('Video generation error:', error)
      } else {
        toast.error('Video generation failed: Unknown error')
        console.error('Unknown error:', error)
      }
    } finally {
      clearTimeout(timeoutId)
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  return (
    <section id="video-generator" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Sora-2 AI Video Generator
            </h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="relative p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="View History"
            >
              <History className="w-5 h-5 text-gray-300" />
              {videoHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {videoHistory.length}
                </span>
              )}
            </button>
          </div>
          <p className="text-lg text-gray-300 mb-6">
            Experience the most advanced AI video generation technology with Sora-2. Create stunning videos from text and images in seconds.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 border border-purple-500/30 rounded-full">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Text to Video
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-pink-900/20 border border-pink-500/30 rounded-full">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              Image to Video
            </span>
          </div>

        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-8 bg-gray-700 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Video History ({videoHistory.length})
              </h3>
              {videoHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {videoHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No video history yet. Generate your first video!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {videoHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-600 hover:border-purple-500 transition-colors"
                  >
                    <div className="aspect-video bg-black rounded-lg mb-3 overflow-hidden">
                      <video
                        src={item.videoUrl}
                        className="w-full h-full object-cover"
                        poster={item.imagePreview}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-400 text-xs">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="text-gray-300 line-clamp-2">
                        {item.prompt}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-gray-700 rounded">
                          {item.mode === 'text' ? 'Text' : 'Image'}
                        </span>
                        <span className="px-2 py-1 bg-gray-700 rounded">
                          {item.resolution}
                        </span>
                        <span className="px-2 py-1 bg-gray-700 rounded">
                          {item.duration}s
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => loadFromHistory(item)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6 bg-gray-700 p-6 rounded-xl">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Generation Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    activeTab === 'text'
                      ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                      : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                  }`}
                  aria-label="Switch to text to video mode"
                >
                  <FileText className="w-5 h-5" />
                  <span>Text to Video</span>
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    activeTab === 'image'
                      ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                      : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                  }`}
                  aria-label="Switch to image to video mode"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Image to Video</span>
                </button>
              </div>
            </div>

            {/* Text to Video - Text Input */}
            {activeTab === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Describe the video content you want to create, e.g.: A cute kitten playing in the garden, bright sunshine, gentle breeze..."
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                  rows={6}
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {textPrompt.length}/1000
                </div>

                {/* Example Prompts */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Try these examples:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {textPromptExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setTextPrompt(example)}
                        className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-600 text-gray-300 rounded-full hover:border-blue-500 hover:text-blue-300 transition-colors"
                      >
                        {example.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Image to Video - Image Upload */}
            {activeTab === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={400}
                        height={300}
                        className="max-w-full h-auto max-h-48 mx-auto rounded-lg object-contain"
                        unoptimized
                      />
                            <p className="text-sm text-gray-300">Click to change image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        Choose New Image
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-lg font-medium text-gray-300 mb-2">
                                Click or drag to upload image
                              </p>
                              <p className="text-sm text-gray-400 mb-4">
                                Supports JPEG, PNG, WEBP, BMP formats
                              </p>
                              <p className="text-xs text-gray-500 mb-4">
                                Max 10MB, resolution 360-2000 pixels
                              </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          Choose Image
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image to Video - Motion Description */}
            {activeTab === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Motion Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motionPrompt}
                  onChange={(e) => setMotionPrompt(e.target.value)}
                  placeholder="Describe the motion effect you want, e.g.: The kitten slowly walks towards the camera, then turns and leaves, the flowers in the background gently swaying in the breeze..."
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {motionPrompt.length}/500
                </div>

                {/* Example Motion Prompts */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Try these examples:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {motionPromptExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setMotionPrompt(example)}
                        className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-600 text-gray-300 rounded-full hover:border-blue-500 hover:text-blue-300 transition-colors"
                      >
                        {example.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-300">Video Settings</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resolution
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setResolution('720p')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      resolution === '720p'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-medium">720p</span>
                  </button>
                  <button
                    onClick={() => setResolution('1080p')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      resolution === '1080p'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-medium">1080p</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDuration('10')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      duration === '10'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-medium">10s</span>
                  </button>
                  <button
                    onClick={() => {
                      if (resolution === '1080p') return
                      setDuration('15')
                    }}
                    disabled={resolution === '1080p'}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      duration === '15'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : resolution === '1080p'
                        ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-medium">15s</span>
                    {resolution === '1080p' && (
                      <span className="text-xs block text-gray-500">(720p only)</span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Ratio
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVideoRatio('16:9')}
                    className={`flex-1 p-2 rounded-lg border transition-colors ${
                      videoRatio === '16:9'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Monitor className="w-4 h-4" />
                      <span className="text-xs font-medium">16:9</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setVideoRatio('9:16')}
                    className={`flex-1 p-2 rounded-lg border transition-colors ${
                      videoRatio === '9:16'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-medium">9:16</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remove Watermark
                </label>
                <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-sm text-gray-300">Remove watermarks</div>
                      <div className="text-xs text-gray-400">When enabled, removes watermarks from the generated video</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setRemoveWatermark(!removeWatermark)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      removeWatermark ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        removeWatermark ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || (activeTab === 'text' ? !textPrompt.trim() : (!selectedImage || !motionPrompt.trim()))}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/30"
              aria-label="Generate video from prompt"
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Video</span>
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{progressMessage}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Generation Results */}
          <div className="space-y-6 bg-gray-700 p-6 rounded-xl">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Generation Results
              </h3>

              {isGenerating ? (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div className="skeleton h-4 w-48 mb-3 rounded"></div>
                    <div className="skeleton h-4 w-32 mb-3 rounded"></div>
                    <div className="skeleton h-4 w-40 mb-4 rounded"></div>

                    <div className={`${videoRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-900 rounded-lg overflow-hidden skeleton`}>
                    </div>
                  </div>
                </div>
              ) : generatedVideo ? (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div className="text-sm text-gray-300 mb-2">
                      {new Date().toLocaleString('en-US')}
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      Mode: {activeTab === 'text' ? 'Text to Video' : 'Image to Video'}
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      Model: {selectedModel}
                    </div>
                    <div className="text-sm text-gray-300 mb-4">
                      Description: {activeTab === 'text' ? textPrompt : motionPrompt}
                    </div>

                    <div className={`${videoRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'} bg-black rounded-lg overflow-hidden`}>
                      <video
                        src={generatedVideo}
                        controls
                        className="w-full h-full object-cover"
                        poster={imagePreview || undefined}
                        onError={(e) => {
                          console.error('Video load error:', e)
                          console.error('Video URL:', generatedVideo)
                          toast.error('Failed to load video. The video URL may have expired or is inaccessible.')
                        }}
                        onLoadStart={() => {
                          console.log('Video loading started:', generatedVideo)
                        }}
                        onCanPlay={() => {
                          console.log('Video can play')
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (generatedVideo) {
                          const link = document.createElement('a')
                          link.href = generatedVideo
                          link.download = `sora-2-video-${Date.now()}.mp4`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          toast.success('视频下载开始！')
                        }
                      }}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      aria-label="Download video"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => {
                        if (generatedVideo) {
                          if (navigator.share) {
                            navigator.share({
                              title: 'Sora-2 Generated Video',
                              text: activeTab === 'text' ? textPrompt : motionPrompt,
                              url: window.location.href
                            }).then(() => {
                              toast.success('分享成功！')
                            }).catch(() => {
                              toast.error('分享取消')
                            })
                          } else {
                            navigator.clipboard.writeText(window.location.href)
                            toast.success('链接已复制到剪贴板！')
                          }
                        }
                      }}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      aria-label="Share video"
                    >
                      <Play className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-600">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">
                    Generated video will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
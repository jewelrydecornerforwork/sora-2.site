'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, Image as ImageIcon, Play, Settings, Volume2, Download, Video, Smartphone, Monitor, FileText, Wand2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

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
  const [resolution, setResolution] = useState('standard')
  const [videoRatio, setVideoRatio] = useState('16:9')
  const [duration, setDuration] = useState('5')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')
  const [isDragOver, setIsDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')

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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      setProgress(100)
      setProgressMessage('Video generated successfully!')

      if (result.videoUrl) {
        setGeneratedVideo(result.videoUrl)

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
        } else {
          toast.error(`Video generation failed: ${error.message}`)
        }
      } else {
        toast.error('Video generation failed: Unknown error')
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sora-2 AI Video Generator
          </h2>
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
                    onClick={() => setResolution('standard')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      resolution === 'standard'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-medium">Standard</span>
                  </button>
                  <button
                    onClick={() => setResolution('hd')}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      resolution === 'hd'
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-medium">HD</span>
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
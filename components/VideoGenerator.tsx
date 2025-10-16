'use client'

import { useState, useCallback } from 'react'
import { Upload, Image, Play, Settings, Volume2, Download, Video, Smartphone, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'

interface VideoGeneratorProps {
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
}

export function VideoGenerator({ isGenerating, setIsGenerating }: VideoGeneratorProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [motionPrompt, setMotionPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('google-veo3')
  const [resolution, setResolution] = useState('standard')
  const [videoRatio, setVideoRatio] = useState('9:16')
  const [duration, setDuration] = useState('5')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')

  // 图像上传处理
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success('Image uploaded successfully!')
    }
  }

  // 音频上传处理
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      toast.success('Audio file uploaded successfully!')
    }
  }

  // 生成视频
  const handleGenerateVideo = async () => {
    console.log('🎬 开始生成视频...')
    
    if (!selectedImage) {
      console.log('❌ 没有选择图像')
      toast.error('Please upload an image first!')
      return
    }
    
    if (!motionPrompt.trim()) {
      console.log('❌ 没有输入运动描述')
      toast.error('Please enter a motion description!')
      return
    }

    console.log('📋 生成参数:', {
      imageName: selectedImage.name,
      imageSize: selectedImage.size,
      prompt: motionPrompt,
      model: selectedModel,
      resolution: resolution,
      duration: duration
    })

    setIsGenerating(true)
    
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('prompt', motionPrompt)
      formData.append('model', selectedModel)
      formData.append('resolution', resolution)
      formData.append('duration', duration)
      formData.append('isPublic', isPublic.toString())
      
      if (audioFile) {
        formData.append('audio', audioFile)
        console.log('🎵 包含音频文件:', audioFile.name)
      }

      console.log('📤 发送请求到 API...')
      
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
      })

      console.log('📥 收到响应:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API 错误:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ 生成结果:', result)
      
      setGeneratedVideo(result.videoUrl)
      toast.success(result.message || 'Video generated successfully!')
    } catch (error) {
      console.error('❌ 生成视频时发生错误:', error)
      toast.error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* 左侧面板 - Sora 2 Generator */}
        <div className="w-1/2 p-8 bg-gray-800 border-r border-gray-700">
          <div className="h-full flex flex-col">
            {/* 标题和选项卡 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Sora 2 Generator</h1>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'text' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  Text to Video
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'image' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  Image to Video
                </button>
              </div>
            </div>

            {/* Prompt 输入区域 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prompt
              </label>
              <textarea
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={6}
                maxLength={5000}
              />
              <div className="text-right text-sm text-gray-400 mt-1">
                {motionPrompt.length}/5000
              </div>
            </div>

            {/* Video Ratio 选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video Ratio
              </label>
              <p className="text-xs text-gray-400 mb-3">Select the aspect ratio for your Video</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setVideoRatio('9:16')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    videoRatio === '9:16'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Smartphone className="w-6 h-6 text-white" />
                    <span className="text-sm font-medium text-white">9:16</span>
                  </div>
                </button>
                <button
                  onClick={() => setVideoRatio('16:9')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    videoRatio === '16:9'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Monitor className="w-6 h-6 text-white" />
                    <span className="text-sm font-medium text-white">16:9</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Resolution 选择 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resolution
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setResolution('standard')}
                  className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                    resolution === 'standard'
                      ? 'border-green-500 bg-green-500/10 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setResolution('hd')}
                  className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                    resolution === 'hd'
                      ? 'border-green-500 bg-green-500/10 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  HD
                </button>
              </div>
            </div>

            {/* 生成按钮区域 */}
            <div className="mt-auto">
              <p className="text-xs text-gray-400 mb-2">Sign in to generate</p>
              <button
                onClick={handleGenerateVideo}
                disabled={isGenerating || !motionPrompt.trim()}
                className="w-full bg-gradient-to-r from-green-400 to-purple-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    <span>Generate Video</span>
                  </>
                )}
              </button>
              {!motionPrompt.trim() && (
                <p className="text-orange-400 text-xs mt-2">Please enter a prompt to generate video</p>
              )}
            </div>
          </div>
        </div>

        {/* 右侧面板 - 结果展示 */}
        <div className="w-1/2 p-8 bg-gray-800">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Sora 2 AI Video Generator Result</h2>
            
            {isGenerating && (
              <div className="mb-4">
                <p className="text-orange-400 text-sm">
                  Video generation takes 5-10 min. Please don't close this tab. Please don't close this tab.
                </p>
              </div>
            )}

            <div className="flex-1 flex items-center justify-center">
              {generatedVideo ? (
                <div className="w-full max-w-sm">
                  <div className={`relative ${videoRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'} bg-black rounded-lg overflow-hidden`}>
                    <video
                      src={generatedVideo}
                      controls
                      className="w-full h-full object-cover"
                      poster={imagePreview || undefined}
                    />
                    {/* Sora 标志 */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                        <span className="text-white text-xs font-medium">Sora</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">download result</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                      <span className="text-sm">My Assets</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`${videoRatio === '9:16' ? 'w-48 h-80' : 'w-80 h-48'} bg-gray-700 rounded-lg flex items-center justify-center mb-4`}>
                    <Video className="w-16 h-16 text-gray-500" />
                  </div>
                  <p className="text-gray-400">Generated video will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
// import { useDropzone } from 'react-dropzone'
import { Upload, Image, Play, Settings, Volume2, Download } from 'lucide-react'
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
  const [resolution, setResolution] = useState('720p')
  const [duration, setDuration] = useState('5')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sora-2 Ai - Image to Video Generator
          </h2>
          <p className="text-lg text-gray-600">
            Transform your images into dynamic videos with AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            {/* AI 模型选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="google-veo3">Google Veo3</option>
                <option value="runway-gen3">Runway Gen-3</option>
                <option value="pika-labs">Pika Labs</option>
              </select>
            </div>

            {/* 图像上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-48 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600">Click to change image</p>
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
                      Select New Image
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Select Image File
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports JPEG, PNG, WEBP, BMP formats
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
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
                        Select Image
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 运动描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motion Prompt (describe desired movement)
              </label>
              <textarea
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
                placeholder="e.g.: A woman walks on the beach and says: 'Have you heard? Sora-2 is now available on sora-2.site!'"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {motionPrompt.length}/500
              </div>
            </div>

            {/* 设置 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Settings</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                  </select>
                </div>
              </div>

              {/* 音频上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Music (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Select Audio File</span>
                  </label>
                  {audioFile && (
                    <span className="text-sm text-gray-600">
                      {audioFile.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Supports WAV/MP3, 3-30 seconds, max 15MB
                </p>
              </div>

              {/* 公开设置 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Video Public
                </label>
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || !selectedImage || !motionPrompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Generate Video</span>
                </>
              )}
            </button>
          </div>

          {/* 右侧：生成结果 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generated Video
              </h3>
              
              {generatedVideo ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">
                      {new Date().toLocaleString('en-US')}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Model: {selectedModel}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Prompt: {motionPrompt}
                    </div>
                    
                    <video
                      src={generatedVideo}
                      controls
                      className="w-full rounded-lg"
                      poster={imagePreview || undefined}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
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

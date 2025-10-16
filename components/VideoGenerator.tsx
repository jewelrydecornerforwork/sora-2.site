'use client'

import { useState, useCallback } from 'react'
import { Upload, Image, Play, Settings, Volume2, Download, Video, Smartphone, Monitor, FileText, Wand2 } from 'lucide-react'
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
  const [resolution, setResolution] = useState('720p')
  const [videoRatio, setVideoRatio] = useState('16:9')
  const [duration, setDuration] = useState('5')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')
  const [isDragOver, setIsDragOver] = useState(false)

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
    console.log('🎬 开始生成视频...')
    
    // 根据模式进行不同的验证
    if (activeTab === 'text') {
      if (!textPrompt.trim()) {
        console.log('❌ 没有输入文本提示词')
        toast.error('请输入文本描述！')
        return
      }
    } else if (activeTab === 'image') {
      if (!selectedImage) {
        console.log('❌ 没有选择图像')
        toast.error('请先上传图片！')
        return
      }
      if (!motionPrompt.trim()) {
        console.log('❌ 没有输入运动描述')
        toast.error('请输入运动描述！')
        return
      }
    }

    console.log('📋 生成参数:', {
      mode: activeTab,
      textPrompt: textPrompt,
      imageName: selectedImage?.name,
      imageSize: selectedImage?.size,
      motionPrompt: motionPrompt,
      model: selectedModel,
      resolution: resolution,
      videoRatio: videoRatio,
      duration: duration
    })

    setIsGenerating(true)
    setGeneratedVideo(null)

    try {
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

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ 视频生成成功:', result)

      if (result.videoUrl) {
        setGeneratedVideo(result.videoUrl)
        toast.success('视频生成成功！')
      } else {
        throw new Error('No video URL returned')
      }
    } catch (error) {
      console.error('❌ 视频生成失败:', error)
      toast.error(`视频生成失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="video-generator" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎬 Sora-2 AI Video Generator
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Experience the most advanced AI video generation technology with Sora-2. Create stunning videos from text and images in seconds.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Text to Video
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Image to Video
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Multiple Resolutions
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Generation Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    activeTab === 'text' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Text to Video</span>
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    activeTab === 'image' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Image className="w-5 h-5" />
                  <span>Image to Video</span>
                </button>
              </div>
            </div>

            {/* Text to Video - Text Input */}
            {activeTab === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Describe the video content you want to create, e.g.: A cute kitten playing in the garden, bright sunshine, gentle breeze..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {textPrompt.length}/1000
                </div>
              </div>
            )}

            {/* Image to Video - Image Upload */}
            {activeTab === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
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
                        Choose New Image
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Click or drag to upload image
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motion Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motionPrompt}
                  onChange={(e) => setMotionPrompt(e.target.value)}
                  placeholder="Describe the motion effect you want, e.g.: The kitten slowly walks towards the camera, then turns and leaves, the flowers in the background gently swaying in the breeze..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {motionPrompt.length}/500
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Video Settings</span>
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
                    <option value="720p">Standard (720p)</option>
                    <option value="1080p">HD (1080p)</option>
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
                    <option value="8">8 seconds</option>
                    <option value="10">10 seconds</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Ratio
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setVideoRatio('16:9')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      videoRatio === '16:9'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Monitor className="w-5 h-5" />
                      <span className="text-sm font-medium">16:9</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setVideoRatio('9:16')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      videoRatio === '9:16'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Smartphone className="w-5 h-5" />
                      <span className="text-sm font-medium">9:16</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Audio Upload */}
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
                    <span className="text-sm">Choose Audio File</span>
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

              {/* Public Setting */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Public Video
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || (activeTab === 'text' ? !textPrompt.trim() : (!selectedImage || !motionPrompt.trim()))}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
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
          </div>

          {/* Right Side: Generation Results */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generation Results
              </h3>
              
              {generatedVideo ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">
                      {new Date().toLocaleString('en-US')}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Mode: {activeTab === 'text' ? 'Text to Video' : 'Image to Video'}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Model: {selectedModel}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
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
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, Image as ImageIcon, Play, Settings, Volume2, Download, Video, Smartphone, Monitor, FileText, Wand2 } from 'lucide-react'
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
    // 根据模式进行不同的验证
    if (activeTab === 'text') {
      if (!textPrompt.trim()) {
        toast.error('请输入文本描述！')
        return
      }
    } else if (activeTab === 'image') {
      if (!selectedImage) {
        toast.error('请先上传图片！')
        return
      }
      if (!motionPrompt.trim()) {
        toast.error('请输入运动描述！')
        return
      }
    }

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

      if (result.videoUrl) {
        setGeneratedVideo(result.videoUrl)
        toast.success('视频生成成功！')
      } else {
        throw new Error('No video URL returned')
      }
    } catch (error) {
      toast.error(`视频生成失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="video-generator" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sora-2 AI Video Generator
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Experience the most advanced AI video generation technology with Sora-2. Create stunning videos from text and images in seconds.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400 mb-8">
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
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      resolution === '720p' 
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300' 
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setResolution('1080p')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      resolution === '1080p' 
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300' 
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    HD
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

              {/* Audio Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Choose Audio File</span>
                  </label>
                  {audioFile && (
                    <span className="text-sm text-gray-300">
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
                <label htmlFor="isPublic" className="text-sm text-gray-300">
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
          <div className="space-y-6 bg-gray-700 p-6 rounded-xl">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Generation Results
              </h3>
              
              {generatedVideo ? (
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
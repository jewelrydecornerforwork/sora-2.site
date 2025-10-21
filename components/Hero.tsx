'use client'

import { Sparkles, Video, Image as ImageIcon } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 视频背景 */}
      <div className="absolute inset-0 -z-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/demo-video.mp4" type="video/mp4" />
        </video>
        {/* 视频覆盖层 - 增加对比度 */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/50 rounded-full mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">The Best AI Video Generator in One Place</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in leading-tight">
            Create Stunning <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">AI Videos</span>
          </h1>

          <h2 className="text-xl md:text-2xl font-medium text-gray-300 mb-8">
            Transform Text & Images into Professional Videos with AI
          </h2>

          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the power of next-generation AI video creation. Turn your ideas into captivating videos in seconds with our advanced Sora-2 technology. No technical skills required.
          </p>


          {/* Dual CTA 按钮 */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                const generator = document.getElementById('video-generator')
                generator?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50"
              aria-label="Create free video"
            >
              <span className="flex items-center justify-center gap-2">
                <Video className="w-5 h-5" />
                Create Free Video
              </span>
            </button>
            <button
              onClick={() => {
                const generator = document.getElementById('video-generator')
                generator?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="group relative px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(#1f2937, #1f2937) padding-box, linear-gradient(45deg, #9333ea, #ec4899) border-box',
                border: '2px solid transparent'
              }}
              aria-label="Create AI image"
            >
              <span className="flex items-center justify-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Create AI Image
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 背景装饰 - 紫色主题 - 在视频之上 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/8 to-blue-500/8 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </section>
  )
}


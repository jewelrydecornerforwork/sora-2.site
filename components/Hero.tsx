'use client'

import { Play, Sparkles, Zap, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* 主标题 */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="gradient-text">Sora-2</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
            Advanced AI Video Generation Platform
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform any text or image into captivating videos with simple prompts. Sora-2's advanced AI model delivers stunning video generation and scene creativity that brings your ideas to life. Experience the future of AI video creation.
          </p>


          {/* CTA 按钮 */}
          <div className="flex justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Try Sora-2 Ai Free
            </button>
          </div>


        </div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}


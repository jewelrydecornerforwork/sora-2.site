'use client'

import { Play, Sparkles, Zap, Shield } from 'lucide-react'

interface HeroProps {
  onStartGenerating?: () => void
}

export function Hero({ onStartGenerating }: HeroProps) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* 主标题 */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Sora2
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform any text or image into captivating videos with simple prompts. Sora2's advanced AI model delivers stunning video generation and scene creativity that brings your ideas to life. Experience the future of AI video creation.
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={onStartGenerating}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
            >
              Start with Sora2 Free
            </button>
          </div>

        </div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}


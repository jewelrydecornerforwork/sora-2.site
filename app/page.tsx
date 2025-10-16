'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { VideoGenerator } from '@/components/VideoGenerator'
import { Features } from '@/components/Features'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)

  const handleStartGenerating = () => {
    console.log('开始生成视频被调用')
    setShowGenerator(true)
  }

  console.log('当前状态 - showGenerator:', showGenerator)

  if (showGenerator) {
    console.log('显示视频生成器界面')
    return (
      <VideoGenerator 
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        <Hero onStartGenerating={handleStartGenerating} />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

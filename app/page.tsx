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

  if (showGenerator) {
    return (
      <VideoGenerator 
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main>
        <Hero onStartGenerating={() => setShowGenerator(true)} />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

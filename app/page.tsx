'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { VideoGenerator } from '@/components/VideoGenerator'
import { Features } from '@/components/Features'
import { Pricing } from '@/components/Pricing'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        <Hero />
        <VideoGenerator
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

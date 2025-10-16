'use client'

import { useState } from 'react'
import { VideoGenerator } from '@/components/VideoGenerator'

export default function GeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  return (
    <VideoGenerator 
      isGenerating={isGenerating}
      setIsGenerating={setIsGenerating}
    />
  )
}

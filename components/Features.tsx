'use client'

import { Monitor, Zap, Volume2, Clock, Brain, Image, Play } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Monitor,
      title: 'Multi-Resolution Support',
      description: 'Generate videos in 480p, 720p, or 1080p resolution. Choose quality based on project needs, processing time 1-3 minutes.',
    },
    {
      icon: Zap,
      title: 'Motion Control',
      description: 'Transform static images into dynamic videos based on text prompts with precise control over movement and animation effects.',
    },
    {
      icon: Volume2,
      title: 'Audio Integration',
      description: 'Support for WAV/MP3 background music. Audio duration handling with automatic truncation and silence padding.',
    },
    {
      icon: Clock,
      title: 'Flexible Duration',
      description: 'Generate videos with 5-second or 10-second duration. Perfect for social media, presentations, or creative projects.',
    },
    {
      icon: Brain,
      title: 'Smart Prompts',
      description: 'Intelligent prompt expansion using LLM technology. Get better results through automatic prompt enhancement.',
    },
    {
      icon: Image,
      title: 'Multi-Format Support',
      description: 'Support for JPEG, JPG, PNG, BMP, WEBP images up to 10MB. Resolution range 360-2000 pixels.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Sora-2 Ai
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI technology for professional video generation with comprehensive features and flexible options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
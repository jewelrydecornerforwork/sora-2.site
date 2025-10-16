'use client'

import { Monitor, Zap, Volume2, Clock, Brain, Image, Play } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Monitor,
      title: 'Text to Video',
      description: 'Transform text prompts into high-quality results using advanced AI algorithms. Create professional content in minutes.',
    },
    {
      icon: Image,
      title: 'Image to Video',
      description: 'Turn static images into dynamic content with advanced AI technology. Bring your visuals to life effortlessly.',
    },
    {
      icon: Zap,
      title: 'HD Quality Output',
      description: 'Get crystal-clear high-definition results perfect for social media, marketing, and professional presentations.',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Experience lightning-fast generation. Create multiple outputs quickly without compromising quality.',
    },
    {
      icon: Brain,
      title: 'Easy Interface',
      description: 'Intuitive interface makes AI creation accessible to everyone, from beginners to professionals.',
    },
    {
      icon: Play,
      title: 'Flexible Export',
      description: 'Export generated content in multiple formats and resolutions, ready for any platform or purpose.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Sora-2
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the most advanced AI video generation technology with Sora-2. Create stunning videos from text and images with comprehensive features and flexible options.
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
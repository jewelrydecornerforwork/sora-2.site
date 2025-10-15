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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Sora2
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced Content Creation
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-2">
            Discover powerful AI generation technology for creators worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
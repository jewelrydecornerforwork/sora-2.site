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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Sora-2 Ai
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional video generation features with motion control, audio integration, and multiple resolution options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Example Showcase */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Amazing Sora-2 Ai Community Videos
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            See how Sora-2 Ai transforms your ideas into stunning reality - from concept to creation in just seconds
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Example 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Complete Sora-2 Ai Lip Sync Conversion Process
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Original Image</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Video Prompt</div>
                    <p className="text-sm text-gray-700 italic">
                      "A woman walking on the beach saying: 'Have you heard? Sora-2 is now available on sora-2.site!'"
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">AI Generated Video</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Try This Style
                </button>
              </div>
            </div>

            {/* Example 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Complete Sora-2 Ai Animation Motion Conversion Process
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Original Image</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Video Prompt</div>
                    <p className="text-sm text-gray-700 italic">
                      "Make it fight"
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">AI Generated Video</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Try This Style
                </button>
              </div>
            </div>

            {/* Example 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Complete Sora-2 Ai Product Conversion Process
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Original Image</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Video Prompt</div>
                    <p className="text-sm text-gray-700 italic">
                      "Subject remains the same, but lighting changes"
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">AI Generated Video</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Try This Style
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              Explore More Creations
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

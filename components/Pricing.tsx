'use client'

import { Check } from 'lucide-react'

export function Pricing() {
  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: 'forever',
      credits: '10 credits',
      description: 'Perfect for trying out Sora-2',
      features: [
        '10 free credits (5 videos)',
        '720p resolution',
        'Text-to-video generation',
        'Image-to-video generation',
        'Standard queue',
        'Watermarked videos',
        'Community support'
      ],
      cta: 'Start Free',
      popular: false,
      highlight: false
    },
    {
      name: 'Starter',
      price: '$19.90',
      period: 'per month',
      credits: '100 credits',
      description: 'Great for individual creators',
      features: [
        '100 credits per month (~50 videos)',
        '1080p HD resolution',
        'Text-to-video generation',
        'Image-to-video generation',
        'Priority queue',
        'No watermark',
        'Commercial license',
        'Email support'
      ],
      cta: 'Get Started',
      popular: true,
      highlight: true
    },
    {
      name: 'Pro',
      price: '$49.90',
      period: 'per month',
      credits: '300 credits',
      description: 'Best for professionals and businesses',
      features: [
        '300 credits per month (~150 videos)',
        '1080p HD resolution',
        'Text-to-video generation',
        'Image-to-video generation',
        'Fastest queue',
        'No watermark',
        'Full commercial license',
        'API access',
        'Priority support',
        'Advanced features'
      ],
      cta: 'Go Pro',
      popular: false,
      highlight: false
    },
    {
      name: 'Enterprise',
      price: '$99.90',
      period: 'per month',
      credits: '1000 credits',
      description: 'For teams and high-volume users',
      features: [
        '1000 credits per month (~500 videos)',
        '1080p HD resolution',
        'All generation modes',
        'Highest priority queue',
        'No watermark',
        'Unrestricted commercial license',
        'Full API access',
        'Team collaboration',
        'Dedicated support',
        'Custom integrations',
        'Volume discounts available'
      ],
      cta: 'Contact Sales',
      popular: false,
      highlight: false
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your creative needs. All plans include commercial usage rights.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-2 border-purple-500 shadow-2xl shadow-purple-500/20 transform scale-105'
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 hover:border-purple-500/50'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline mb-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period.split(' ')[1] || plan.period}</span>
                </div>
                <p className="text-purple-400 font-semibold">{plan.credits}</p>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold mb-6 transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>

              {/* Features List */}
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            All plans include a 7-day money-back guarantee. No questions asked.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
            <span>✓ Commercial license included</span>
            <span>✓ No hidden fees</span>
          </div>
        </div>

        {/* Credits Explanation */}
        <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">How Credits Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="bg-purple-500/20 rounded-lg p-3 mr-4">
                <span className="text-2xl font-bold text-purple-400">2-3</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Text-to-Video</h4>
                <p className="text-gray-400 text-sm">2 credits for 5s, 3 credits for 10s</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-500/20 rounded-lg p-3 mr-4">
                <span className="text-2xl font-bold text-blue-400">3-5</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Image-to-Video</h4>
                <p className="text-gray-400 text-sm">3 credits for 5s, 5 credits for 10s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

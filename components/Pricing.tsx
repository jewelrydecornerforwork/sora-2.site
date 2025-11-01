'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('')

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: 49.99,
      yearlyPrice: 449.88,
      credits: '500 credits',
      description: 'Great for individual creators',
      features: [
        '500 credits per month (~250 videos)',
        '1080p HD resolution',
        'Text-to-video generation',
        'Image-to-video generation',
        'Priority processing',
        'No watermark',
        'Commercial license',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false,
      highlight: true,
      savings: 150.00,
      discount: '25% off'
    },
    {
      name: 'Pro',
      monthlyPrice: 99.99,
      yearlyPrice: 839.88,
      credits: '1,200 credits',
      description: 'Best for professionals',
      features: [
        '1,200 credits per month (~600 videos)',
        '1080p HD resolution',
        'All generation modes',
        'Fastest processing',
        'No watermark',
        'Full commercial license',
        'API access',
        'Priority support',
        'Advanced features'
      ],
      cta: 'Get Started',
      popular: true,
      highlight: false,
      savings: 360.00,
      discount: '30% off'
    },
    {
      name: 'Enterprise',
      monthlyPrice: 199.99,
      yearlyPrice: 1559.88,
      credits: '2,500 credits',
      description: 'For teams and agencies',
      features: [
        '2,500 credits per month (~1,250 videos)',
        '1080p HD resolution',
        'Unlimited generations',
        'Highest priority',
        'No watermark',
        'Unrestricted commercial use',
        'Full API access',
        'Team collaboration',
        'Dedicated account manager',
        'Custom integrations',
        'Volume discounts'
      ],
      cta: 'Get Started',
      popular: false,
      highlight: false,
      savings: 840.00,
      discount: '35% off'
    }
  ]

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return '$0'
    // Yearly mode: show monthly price, Monthly mode: show monthly price
    return isYearly ? `$${(plan.yearlyPrice / 12).toFixed(2)}` : `$${plan.monthlyPrice}`
  }

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return 'forever'
    return 'per month'
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your creative needs. All plans include commercial usage rights.
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex rounded-lg bg-gray-800/80 p-1 backdrop-blur-sm border border-gray-700">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isYearly
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isYearly
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Savings Badge */}
          {isYearly && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              <span className="text-sm text-green-300 font-medium">Save up to 35% with yearly billing</span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative rounded-3xl p-10 transition-all duration-300 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700 hover:border-purple-500"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-4">
                <h3 className="text-xl text-white mb-2">{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline mb-1 gap-2">
                  <span className="text-4xl font-bold text-white">{getPrice(plan)}</span>
                  <span className="text-4xl text-white">/month</span>
                  {/* Discount Badge for Yearly - inline with price */}
                  {isYearly && plan.discount && (
                    <span className="bg-green-900/50 text-green-300 text-xs font-bold px-2 py-1 rounded shadow-lg border border-green-700/50">
                      {plan.discount}
                    </span>
                  )}
                </div>
                {isYearly && plan.monthlyPrice > 0 && (
                  <p className="text-sm text-gray-400">
                    ${plan.yearlyPrice.toFixed(2)}/year billed annually
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
              </div>

              {/* CTA Button */}
              <button
                className="w-full py-3 px-6 rounded-lg font-semibold mb-6 transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg"
              >
                {plan.cta}
              </button>

              {/* Features List */}
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

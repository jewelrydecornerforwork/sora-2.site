'use client'

import { useState } from 'react'
import { Check, Star, Zap } from 'lucide-react'

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('annually')

  const plans = [
    {
      name: 'Starter',
      description: '适合初学者',
      monthlyPrice: 19.9,
      annualPrice: 238.8,
      credits: 1000,
      annualCredits: 12000,
      features: [
        '1,000 积分/月',
        '720p 视频生成',
        '5-10 秒视频',
        '音频支持',
        '无限制内容政策',
        '商业授权',
      ],
      popular: false,
      color: 'blue',
    },
    {
      name: 'Premium',
      description: '最受欢迎的选择',
      monthlyPrice: 34.9,
      annualPrice: 418.8,
      credits: 2000,
      annualCredits: 24000,
      features: [
        '2,000 积分/月',
        '1080p 视频生成',
        '优先处理',
        '音频集成',
        '无限制内容政策',
        '商业授权',
        '优先支持',
      ],
      popular: true,
      color: 'purple',
    },
    {
      name: 'Advanced',
      description: '为专业创作者',
      monthlyPrice: 62.9,
      annualPrice: 754.8,
      credits: 5000,
      annualCredits: 60000,
      features: [
        '5,000 积分/月',
        '无限 1080p 生成',
        '最快处理速度',
        '完整音频功能',
        '无限制内容政策',
        '商业授权',
        '专属支持',
      ],
      popular: false,
      color: 'green',
    },
  ]

  const addOns = [
    {
      name: 'Small Add-on Package',
      description: '按需额外积分',
      price: 50,
      credits: 2000,
      features: ['一次性套餐', '2000 积分', '无订阅', '720p 生成', '永久历史'],
    },
    {
      name: 'Large Add-on Package',
      description: '重度用户更多积分',
      price: 100,
      credits: 5000,
      features: ['一次性套餐', '5000 积分', '无订阅', '1080p 生成', '永久历史'],
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sora 2 AI 适合每位创作者
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            选择最适合您需求的计划
          </p>

          {/* 计费周期切换 */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              月付
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annually' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingPeriod === 'annually' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'annually' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'annually' ? 'text-gray-900' : 'text-gray-500'}`}>
              年付
            </span>
            {billingPeriod === 'annually' && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                节省 50% 🔥
              </span>
            )}
          </div>
        </div>

        {/* 主要计划 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-purple-500 transform scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>最受欢迎</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingPeriod === 'annually' ? plan.annualPrice / 12 : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">/月</span>
                  </div>
                  {billingPeriod === 'annually' && (
                    <div className="text-sm text-gray-500">
                      年付: ${plan.annualPrice}
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="text-2xl font-bold text-blue-600">
                      💎 {billingPeriod === 'annually' ? plan.annualCredits : plan.credits}
                    </span>
                    <span className="text-gray-600"> 积分/月</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  选择计划
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 附加套餐 */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            无订阅附加套餐
          </h3>
          <p className="text-gray-600 mb-8">
            为重度用户提供更多积分
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {addOns.map((addon, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {addon.name}
                </h4>
                <p className="text-gray-600 mb-4">
                  {addon.description}
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${addon.price}
                </div>
                <div className="text-sm text-gray-500">
                  一次性付款
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-blue-600">
                    💎 {addon.credits}
                  </span>
                  <span className="text-gray-600"> 积分</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {addon.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                购买套餐
              </button>
            </div>
          ))}
        </div>

        {/* 常见问题链接 */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            不确定选择哪个计划？
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            查看所有计划 →
          </button>
        </div>
      </div>
    </section>
  )
}


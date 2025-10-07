'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Sora 2 AI 支持哪些视频分辨率？',
      answer: 'Sora 2 AI 支持 480p、720p 和 1080p 视频生成。根据项目需求选择最适合的分辨率，处理时间根据质量和时长在 1-3 分钟之间。'
    },
    {
      question: '我可以在 Sora 2 中生成多长的视频？',
      answer: '您可以生成 5 秒或 10 秒时长的视频。这对于社交媒体内容、演示文稿、动画和需要精确时间控制的创意项目来说是完美的。'
    },
    {
      question: '我可以在 Sora 2 中为视频添加音频吗？',
      answer: '是的！Sora 2 AI 支持 WAV 和 MP3 格式的音频集成。音频时长 3-30 秒，文件大小最大 15MB。音频会自动处理以匹配视频长度。'
    },
    {
      question: 'Sora 2 支持哪些图像格式？',
      answer: '支持的格式包括 JPEG、JPG、PNG（无透明通道）、BMP 和 WEBP。图像应为 360-2000 像素的宽度和高度，最大文件大小为 10MB 以获得最佳处理效果。'
    },
    {
      question: 'Sora 2 AI 中的提示扩展是什么？',
      answer: '提示扩展使用 LLM 技术自动增强您的文本提示，以获得更好的视频生成结果。此功能有助于创建更详细和准确的运动描述。'
    },
    {
      question: 'Sora 2 AI 的视频处理需要多长时间？',
      answer: '处理通常需要 1-3 分钟，具体取决于分辨率和时长。1080p 和 10 秒视频比 480p 和 5 秒视频需要更长时间。处理过程中您会收到状态更新。'
    },
    {
      question: '我可以将 Sora 2 AI 用于商业项目吗？',
      answer: '是的！所有付费计划都包含商业许可权。您可以创建用于营销、社交媒体、演示文稿或任何商业目的的视频，拥有完整的使用权。'
    },
    {
      question: 'Sora 2 AI 与其他工具有什么不同？',
      answer: 'Sora 2 AI 提供专业质量，具有多种分辨率选项、音频集成、灵活的时长控制和先进的提示扩展。它专为初学者和专业人士设计。'
    },
    {
      question: '积分系统是如何工作的？',
      answer: '每次视频生成都会根据分辨率和时长使用积分。更高质量（1080p）和更长时长（10秒）的视频消耗更多积分。请查看您的计划了解积分额度和定价。'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            关于 Sora 2 AI 的常见问题
          </h2>
          <p className="text-lg text-gray-600">
            找到您需要的答案
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 联系支持 */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              还有其他问题？
            </h3>
            <p className="text-gray-600 mb-6">
              我们的支持团队随时为您提供帮助
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                联系支持
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                查看文档
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
